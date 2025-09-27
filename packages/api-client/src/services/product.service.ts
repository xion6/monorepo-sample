import { BaseService } from './base.service';
import { API_ROUTES } from '../api-routes';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductQueryParams,
  ApiResponse,
  PaginatedResponse 
} from '../types';

export class ProductService extends BaseService {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const url = this.buildUrl(API_ROUTES.products.list, params);
    return this.get<PaginatedResponse<Product>>(url);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.get<ApiResponse<Product>>(API_ROUTES.products.detail(id));
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    return this.post<ApiResponse<Product>, CreateProductRequest>(API_ROUTES.products.create, data);
  }

  async updateProduct(data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    const { id, ...updateData } = data;
    return this.put<ApiResponse<Product>, Omit<UpdateProductRequest, 'id'>>(
      API_ROUTES.products.update(id), 
      updateData
    );
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(API_ROUTES.products.delete(id));
  }

  async searchProducts(query: string, params?: Omit<ProductQueryParams, 'search'>): Promise<PaginatedResponse<Product>> {
    const searchParams = { ...params, search: query };
    const url = this.buildUrl(API_ROUTES.products.search, searchParams);
    return this.get<PaginatedResponse<Product>>(url);
  }

  async getProductsByCategory(category: string, params?: Omit<ProductQueryParams, 'category'>): Promise<PaginatedResponse<Product>> {
    // Use the dedicated byCategory route instead of query params
    const url = this.buildUrl(API_ROUTES.products.byCategory(category), params);
    return this.get<PaginatedResponse<Product>>(url);
  }
}