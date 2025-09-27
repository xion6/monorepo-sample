# @ecommerce/api-client

Enterprise-grade, type-safe HTTP client library for modern ecommerce applications.

## Installation

```bash
pnpm add @ecommerce/api-client

# For React integration (optional)
pnpm add @tanstack/react-query react
```

## Quick Start

### 1. Basic Usage with Services

```typescript
import { ApiClient, ProductService } from '@ecommerce/api-client';

// Initialize with authentication
const client = new ApiClient('https://api.example.com', {
  auth: {
    type: 'jwt',
    token: 'your-jwt-token',
    refreshToken: 'your-refresh-token',
    refreshEndpoint: '/auth/refresh'
  }
});

const productService = new ProductService(client);

// Type-safe API calls
const products = await productService.getProducts({
  category: 'electronics',
  page: 1,
  size: 20,
  sortBy: 'price',
  sortOrder: 'asc'
});
```

### 2. React Integration with Hooks

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  ApiClientProvider, 
  useProducts, 
  useCreateProduct,
  createQueryClient 
} from '@ecommerce/api-client';

// Setup providers
const apiClient = new ApiClient('https://api.example.com');
const queryClient = createQueryClient(); // Optimized React Query config

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        <ProductList />
      </ApiClientProvider>
    </QueryClientProvider>
  );
}

// Use hooks in components
function ProductList() {
  const { data: products, isLoading, error } = useProducts({
    category: 'electronics'
  });
  
  const createProduct = useCreateProduct();
  
  const handleCreate = () => {
    createProduct.mutate({
      name: 'New Product',
      price: 99.99,
      currency: 'USD'
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={handleCreate}>Add Product</button>
    </div>
  );
}
```

### 3. Advanced Authentication

```typescript
// JWT with auto-refresh
const client = new ApiClient('https://api.example.com', {
  auth: {
    type: 'jwt',
    token: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    refreshEndpoint: '/auth/refresh'
  }
});

// API Key authentication
const client = new ApiClient('https://api.example.com', {
  auth: {
    type: 'apikey',
    apiKey: 'your-api-key',
    apiKeyHeader: 'X-API-Key'
  }
});
```

### 4. Error Handling & Monitoring

```typescript
import { ApiError } from '@ecommerce/api-client';

try {
  const product = await productService.getProduct('123');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isNotFound()) {
      console.log('Product not found');
    } else if (error.isUnauthorized()) {
      // Redirect to login
    } else if (error.isServerError()) {
      // Show server error message
    }
  }
}

// Access performance metrics
const monitor = client.getPerformanceMonitor();
const stats = monitor.getStats(); // Last hour stats
console.log(`Average response time: ${stats.averageResponseTime}ms`);
console.log(`Success rate: ${stats.successRate}%`);
```

### 5. Direct API Routes Usage

```typescript
// Direct URL access with centralized management
import { API_ROUTES } from '@ecommerce/api-client';

// Static routes - no function calls needed
const productsUrl = API_ROUTES.products.list;     // '/api/products'
const loginUrl = API_ROUTES.auth.login;           // '/api/auth/login'

// Dynamic routes - function calls for parameters
const productUrl = API_ROUTES.products.detail('123');        // '/api/products/123'
const categoryUrl = API_ROUTES.products.byCategory('tech');  // '/api/products/category/tech'
const orderUrl = API_ROUTES.orders.cancel('456');            // '/api/orders/456/cancel'

// Use with any HTTP client
fetch(API_ROUTES.products.list)
  .then(response => response.json())
  .then(products => console.log(products));
```

### 6. Advanced Features

```typescript
// Request with retry logic
const productWithRetry = await client.requestWithRetry(
  () => productService.getProduct('123'),
  3, // max retries
  1000 // base delay
);

// Cache management
import { CacheManager } from '@ecommerce/api-client';

const cacheManager = new CacheManager({
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultGcTime: 10 * 60 * 1000,   // 10 minutes
});

// Infinite scroll with React Query
function InfiniteProductList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts({ category: 'electronics' });

  return (
    <div>
      {data?.pages.map(page => 
        page.data.map(product => (
          <div key={product.id}>{product.name}</div>
        ))
      )}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More
        </button>
      )}
    </div>
  );
}
```

## 🚀 Features

### Core Features
- ✅ **Type Safety**: Full TypeScript support with comprehensive type definitions
- ✅ **HTTP Methods**: Complete REST API support (GET, POST, PUT, PATCH, DELETE)
- ✅ **Error Handling**: Structured error handling with custom ApiError class
- ✅ **Service Layer**: Repository pattern with dedicated service classes

### Enterprise Features
- ✅ **Authentication**: JWT, API Key, Bearer token support with auto-refresh
- ✅ **Monitoring**: Request/response logging with performance metrics
- ✅ **Retry Logic**: Exponential backoff with configurable retry strategies
- ✅ **React Integration**: Optimized hooks for React Query integration
- ✅ **Caching**: Intelligent cache management with customizable strategies
- ✅ **Interceptors**: Request/response interceptors for cross-cutting concerns

### Developer Experience
- ✅ **Modern Architecture**: Clean separation of concerns and SOLID principles
- ✅ **Centralized API Management**: Type-safe URL definitions with API_ROUTES
- ✅ **Optimized Structure**: Flattened hierarchy for better maintainability  
- ✅ **Zero Dependencies**: Minimal peer dependencies (axios, optional React/React Query)
- ✅ **Tree Shaking**: ESM modules for optimal bundle size
- ✅ **IntelliSense**: Rich TypeScript types for enhanced developer experience

## 📚 API Reference

### Core Classes
- `ApiClient` - Main HTTP client with auth and monitoring  
- `ProductService` - Service for product-related operations
- `AuthManager` - Authentication token management
- `Logger` - Structured logging with configurable levels
- `PerformanceMonitor` - Request performance tracking
- `CacheManager` - Cache strategy management

### API Routes
- `API_ROUTES` - Centralized API endpoint definitions with type safety
  - `API_ROUTES.products.*` - Product-related endpoints
  - `API_ROUTES.auth.*` - Authentication endpoints  
  - `API_ROUTES.orders.*` - Order management endpoints
  - `API_ROUTES.categories.*` - Category endpoints

### React Hooks
- `useProducts()` - Fetch paginated products with filters
- `useProduct(id)` - Fetch single product by ID
- `useCreateProduct()` - Create new product mutation
- `useUpdateProduct()` - Update existing product mutation
- `useDeleteProduct()` - Delete product mutation
- `useInfiniteProducts()` - Infinite scroll product loading

## 🛠 Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## 📈 Architecture Status

- ✅ **Phase 1**: Foundation (package.json, tsconfig.json, structure)
- ✅ **Phase 2**: Core functionality (HTTP methods, error handling, types, services)  
- ✅ **Phase 3**: Enterprise features (auth, caching, monitoring, React hooks)
- ✅ **Optimizations**: Centralized API routes, flattened structure, improved maintainability

## 🎯 Migration from Legacy

```typescript
// Before: Basic axios usage
import axios from 'axios';
const response = await axios.get('/api/products');

// After: Type-safe service layer
import { ApiClient, ProductService } from '@ecommerce/api-client';
const client = new ApiClient('https://api.example.com');
const productService = new ProductService(client);
const products = await productService.getProducts(); // Full type safety!
```

Enterprise-ready HTTP client with 10x improved developer experience! 🚀