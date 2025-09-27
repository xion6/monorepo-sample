import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import {
  GetProductsByRankUseCase,




} from '../../port/in/GetProductsByRankUseCase';
import { GetProductsPort } from '../../port/out/GetProductsPort';
import { ProductsEntity, ProductEntity } from '../entities/Product';

@injectable()
export class GetProductsByRankService implements GetProductsByRankUseCase {
  constructor(@inject("GetProductsPort") private readonly productsPort: GetProductsPort) { }

  async execute(rank: number): Promise<ProductsEntity> {
    const products = await this.productsPort.findByRank(rank);
    return new ProductsEntity(products);
  }
}