import { ProductsEntity } from '../../domain/entities/Product'

export interface GetRankedProdoctsUseCase {
  execute(): Promise<ProductsEntity>
}
