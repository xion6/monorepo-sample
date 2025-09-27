import { Products } from "../../domain/entities/Product";

export interface GetProductsPort {
  getProducts(): Promise<Products>;
}
