import { Products } from '../../domain/entities/Product'

export interface GetRankedProdoctsUseCase {
  execute(): Promise<Products>
}
