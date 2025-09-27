// Product-specific API types
// Re-export ProductEntity from domain for consistency
export { ProductEntity as Product } from '@ecommerce/core';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  stock?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  limit?: number;
  size?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
}