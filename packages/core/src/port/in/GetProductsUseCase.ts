import { type Product } from '../../domain/entities/Product'

export interface GetProductsUseCase {
  getRankedProducts(): Promise<Product[]>
}
