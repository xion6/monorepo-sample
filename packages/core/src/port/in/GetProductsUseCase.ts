import type { Product } from '../../domain/entities/Product.js'

export interface GetProductsUseCase {
  getRankedProducts(): Promise<Product[]>
}
