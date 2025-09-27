// Product-specific API types
// These should ideally import from @ecommerce/domain for consistency

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  currency: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  inStock?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  size?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}