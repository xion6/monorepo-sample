// Main exports for @ecommerce/api-client package

// Core client
export { ApiClient } from './client';

// Services
export { BaseService, ProductService } from './services';

// Authentication
export { AuthManager, type AuthConfig, type AuthTokens } from './auth';

// Error handling
export { ApiError, ErrorHandler } from './errors';

// Monitoring
export { Logger, PerformanceMonitor, type LogLevel, type PerformanceStats } from './monitoring';

// Caching
export { CacheManager, createQueryClient, queryClient } from './cache';

// React Hooks (optional - requires React and React Query)
export * from './hooks';

// API Routes (modern approach)
export { API_ROUTES, type ApiRoutes, type ProductRoutes } from './api-routes';

// Types
export type * from './types';

// Re-export for convenience
export type { AxiosRequestConfig } from 'axios';