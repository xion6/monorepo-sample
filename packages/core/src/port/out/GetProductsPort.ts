import type { ProductData } from '../../domain/entities/Product.js'

export interface GetProductsPort {
  getProducts(): Promise<ProductData[]>
}
