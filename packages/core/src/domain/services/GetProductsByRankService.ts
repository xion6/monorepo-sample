import {
  GetProductsByRankUseCase,
  GetProductByIdUseCase,
  GetAllProductsUseCase,
  SearchProductsUseCase,
  GetProductsByCategoryUseCase
} from '../../port/in/GetProductsByRankUseCase';
import { GetProductsPort } from '../../port/out/GetProductsPort';
import { ProductsEntity, ProductEntity } from '../entities/Product';

export class ProductService {
  constructor(private readonly productsPort: GetProductsPort) {}

  async getByRank(rank: number): Promise<ProductsEntity> {
    const products = await this.productsPort.findByRank(rank);
    return new ProductsEntity(products);
  }

  async getById(id: string): Promise<ProductEntity | null> {
    const product = await this.productsPort.findById(id);
    return product ? new ProductEntity(product) : null;
  }

  async getAll(): Promise<ProductsEntity> {
    const products = await this.productsPort.findAll();
    return new ProductsEntity(products);
  }

  async search(query: string): Promise<ProductsEntity> {
    const products = await this.productsPort.search(query);
    return new ProductsEntity(products);
  }

  async getByCategory(categoryId: string): Promise<ProductsEntity> {
    const products = await this.productsPort.findByCategory(categoryId);
    return new ProductsEntity(products);
  }
}

export class GetProductsByRankService implements GetProductsByRankUseCase {
  constructor(private readonly productsPort: GetProductsPort) {}

  async execute(rank: number): Promise<ProductsEntity> {
    const products = await this.productsPort.findByRank(rank);
    return new ProductsEntity(products);
  }
}

export class GetProductByIdService implements GetProductByIdUseCase {
  constructor(private readonly productsPort: GetProductsPort) {}

  async execute(id: string): Promise<ProductsEntity> {
    const product = await this.productsPort.findById(id);
    const products = product ? [product] : [];
    return new ProductsEntity(products);
  }
}

export class GetAllProductsService implements GetAllProductsUseCase {
  constructor(private readonly productsPort: GetProductsPort) {}

  async execute(): Promise<ProductsEntity> {
    const products = await this.productsPort.findAll();
    return new ProductsEntity(products);
  }
}

export class SearchProductsService implements SearchProductsUseCase {
  constructor(private readonly productsPort: GetProductsPort) {}

  async execute(query: string): Promise<ProductsEntity> {
    const products = await this.productsPort.search(query);
    return new ProductsEntity(products);
  }
}

export class GetProductsByCategoryService implements GetProductsByCategoryUseCase {
  constructor(private readonly productsPort: GetProductsPort) {}

  async execute(categoryId: string): Promise<ProductsEntity> {
    const products = await this.productsPort.findByCategory(categoryId);
    return new ProductsEntity(products);
  }
}