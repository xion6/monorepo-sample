import {
  DIContainer,
  createContainer,
  ProductsEntity,
  ProductEntity
} from '@ecommerce/core';
import { AxiosHttpClient } from '../adapters/axios-http-client';
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
  ApiResponse,
  PaginatedResponse
} from '../types';

export class ProductService {
  private container: DIContainer;

  constructor(baseURL: string) {
    const httpClient = new AxiosHttpClient(baseURL);
    this.container = createContainer(httpClient);
  }

  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<ProductEntity>> {
    const productsEntity = await this.container.getAllProductsUseCase.execute();

    // Transform domain entity to API response format
    const items = productsEntity.all.map(product => new ProductEntity(product));

    return {
      items,
      total: items.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasMore: false // Simplified for demo
    };
  }

  async getProduct(id: string): Promise<ApiResponse<ProductEntity>> {
    const productsEntity = await this.container.getProductByIdUseCase.execute(id);
    const product = productsEntity.findById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      data: product,
      success: true,
      message: 'Product retrieved successfully'
    };
  }

  async searchProducts(query: string, params?: Omit<ProductQueryParams, 'search'>): Promise<PaginatedResponse<ProductEntity>> {
    const productsEntity = await this.container.searchProductsUseCase.execute(query);
    const items = productsEntity.all.map(product => new ProductEntity(product));

    return {
      items,
      total: items.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasMore: false
    };
  }

  async getProductsByCategory(category: string, params?: Omit<ProductQueryParams, 'category'>): Promise<PaginatedResponse<ProductEntity>> {
    const productsEntity = await this.container.getProductsByCategoryUseCase.execute(category);
    const items = productsEntity.all.map(product => new ProductEntity(product));

    return {
      items,
      total: items.length,
      page: params?.page || 1,
      limit: params?.limit || 10,
      hasMore: false
    };
  }

  async getProductsByRank(rank: number): Promise<ProductsEntity> {
    return this.container.getProductsByRankUseCase.execute(rank);
  }

  // Legacy methods for backward compatibility (will be deprecated)
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<ProductEntity>> {
    throw new Error('Create product not implemented in hexagonal architecture yet');
  }

  async updateProduct(data: UpdateProductRequest): Promise<ApiResponse<ProductEntity>> {
    throw new Error('Update product not implemented in hexagonal architecture yet');
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    throw new Error('Delete product not implemented in hexagonal architecture yet');
  }
}