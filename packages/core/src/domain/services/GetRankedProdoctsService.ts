import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { GetRankedProdoctsUseCase } from "../../port/in/GetRankedProductsUseCase";
import { GetProductsPort } from "../../port/out/GetProductsPort";
import { ProductsEntity } from "../entities/Product";

@injectable()
export class GetRankedProdoctsService implements GetRankedProdoctsUseCase {
  constructor(
    @inject("GetProductsPort") private readonly productsPort: GetProductsPort,
  ) {}

  async execute(): Promise<ProductsEntity> {
    const products = await this.productsPort.getProducts();
    return new ProductsEntity(products).sortByRank();
  }
}
