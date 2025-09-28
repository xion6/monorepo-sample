import { type ProductData } from '../../domain/entities/Product'

export interface GetProductsPort {
  getProducts(): Promise<ProductData[]>
}
