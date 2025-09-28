import { Product } from '../../domain/entities/Product'

export interface GetRankedProdoctsUseCase {
  execute(): Promise<Product[]>
}
