import {
  GetProductsByRankUseCase,
  GetProductByIdUseCase,
  GetAllProductsUseCase,
  SearchProductsUseCase,
  GetProductsByCategoryUseCase
} from './port/in/GetProductsByRankUseCase';
import { GetProductsPort } from './port/out/GetProductsPort';
import {
  ProductService,
  GetProductsByRankService,
  GetProductByIdService,
  GetAllProductsService,
  SearchProductsService,
  GetProductsByCategoryService
} from './domain/services/GetProductsByRankService';

export interface DIContainer {
  getProductsByRankUseCase: GetProductsByRankUseCase;
  getProductByIdUseCase: GetProductByIdUseCase;
  getAllProductsUseCase: GetAllProductsUseCase;
  searchProductsUseCase: SearchProductsUseCase;
  getProductsByCategoryUseCase: GetProductsByCategoryUseCase;
  productService: ProductService;
}

export class DependencyContainer implements DIContainer {
  private _productService: ProductService;
  private _getProductsByRankService: GetProductsByRankService;
  private _getProductByIdService: GetProductByIdService;
  private _getAllProductsService: GetAllProductsService;
  private _searchProductsService: SearchProductsService;
  private _getProductsByCategoryService: GetProductsByCategoryService;

  constructor(productsPort: GetProductsPort) {
    // Domain Services (Application Layer)
    this._productService = new ProductService(productsPort);
    this._getProductsByRankService = new GetProductsByRankService(productsPort);
    this._getProductByIdService = new GetProductByIdService(productsPort);
    this._getAllProductsService = new GetAllProductsService(productsPort);
    this._searchProductsService = new SearchProductsService(productsPort);
    this._getProductsByCategoryService = new GetProductsByCategoryService(productsPort);
  }

  get getProductsByRankUseCase(): GetProductsByRankUseCase {
    return this._getProductsByRankService;
  }

  get getProductByIdUseCase(): GetProductByIdUseCase {
    return this._getProductByIdService;
  }

  get getAllProductsUseCase(): GetAllProductsUseCase {
    return this._getAllProductsService;
  }

  get searchProductsUseCase(): SearchProductsUseCase {
    return this._searchProductsService;
  }

  get getProductsByCategoryUseCase(): GetProductsByCategoryUseCase {
    return this._getProductsByCategoryService;
  }

  get productService(): ProductService {
    return this._productService;
  }
}

// Factory function for creating container
export function createContainer(productsPort: GetProductsPort): DIContainer {
  return new DependencyContainer(productsPort);
}