import { BaseService } from './base.service';
import { API_ROUTES } from '../api-routes';
import { ProductEntity, ProductSchema, Product } from '@ecommerce/domain';
import { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductQueryParams,
  ApiResponse,
  PaginatedResponse 
} from '../types';

export class ProductService extends BaseService {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<ProductEntity>> {
    const url = this.buildUrl(API_ROUTES.products.list, params);
    const response = await this.get<PaginatedResponse<Product>>(url);
    
    // Validate and transform response data using domain schema
    const validatedItems = response.items.map((item: Product) => {
      const validated = ProductSchema.parse(item);
      return new ProductEntity(validated);
    });
    
    return { ...response, items: validatedItems };
  }

  async getProduct(id: string): Promise<ApiResponse<ProductEntity>> {
    const response = await this.get<ApiResponse<Product>>(API_ROUTES.products.detail(id));
    
    // Validate and transform response data
    const validated = ProductSchema.parse(response.data);
    return { ...response, data: new ProductEntity(validated) };
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<ProductEntity>> {
    const response = await this.post<ApiResponse<Product>, CreateProductRequest>(API_ROUTES.products.create, data);
    
    // Validate and transform response data
    const validated = ProductSchema.parse(response.data);
    return { ...response, data: new ProductEntity(validated) };
  }

  async updateProduct(data: UpdateProductRequest): Promise<ApiResponse<ProductEntity>> {
    const { id, ...updateData } = data;
    const response = await this.put<ApiResponse<Product>, Omit<UpdateProductRequest, 'id'>>(
      API_ROUTES.products.update(id), 
      updateData
    );
    
    // Validate and transform response data
    const validated = ProductSchema.parse(response.data);
    return { ...response, data: new ProductEntity(validated) };
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(API_ROUTES.products.delete(id));
  }

  async searchProducts(query: string, params?: Omit<ProductQueryParams, 'search'>): Promise<PaginatedResponse<ProductEntity>> {
    const searchParams = { ...params, search: query };
    const url = this.buildUrl(API_ROUTES.products.search, searchParams);
    const response = await this.get<PaginatedResponse<Product>>(url);
    
    // Validate and transform response data
    const validatedItems = response.items.map((item: Product) => {
      const validated = ProductSchema.parse(item);
      return new ProductEntity(validated);
    });
    
    return { ...response, items: validatedItems };
  }

  async getProductsByCategory(category: string, params?: Omit<ProductQueryParams, 'category'>): Promise<PaginatedResponse<ProductEntity>> {
    // Use the dedicated byCategory route instead of query params
    const url = this.buildUrl(API_ROUTES.products.byCategory(category), params);
    const response = await this.get<PaginatedResponse<Product>>(url);
    
    // Validate and transform response data
    const validatedItems = response.items.map((item: Product) => {
      const validated = ProductSchema.parse(item);
      return new ProductEntity(validated);
    });
    
    return { ...response, items: validatedItems };
  }
}