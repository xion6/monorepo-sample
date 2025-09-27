import { ProductsEntity } from '../../domain/entities/Product';

export interface GetRankedProdoctsUseCase {
  execute(query: unknown): Promise<ProductsEntity>;
}