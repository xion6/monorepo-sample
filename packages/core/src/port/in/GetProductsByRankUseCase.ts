import { ProductsEntity } from '../../domain/entities/Product';

export interface GetProductsByRankUseCase {
  execute(rank: number): Promise<ProductsEntity>;
}