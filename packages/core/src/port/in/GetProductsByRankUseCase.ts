import { ProductsEntity } from '../../domain/entities/Product';

export interface GetProductsByRankUseCase {
  execute(rank: number): Promise<ProductsEntity>;
}

export interface GetProductByIdUseCase {
  execute(id: string): Promise<ProductsEntity>;
}

export interface GetAllProductsUseCase {
  execute(): Promise<ProductsEntity>;
}

export interface SearchProductsUseCase {
  execute(query: string): Promise<ProductsEntity>;
}

export interface GetProductsByCategoryUseCase {
  execute(categoryId: string): Promise<ProductsEntity>;
}