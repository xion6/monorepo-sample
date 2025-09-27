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
import { HttpProductsAdapter, HttpClient } from './adapters/http-products.adapter';

export interface DIContainer {
  getProductsByRankUseCase: GetProductsByRankUseCase;
  getProductByIdUseCase: GetProductByIdUseCase;
  getAllProductsUseCase: GetAllProductsUseCase;
  searchProductsUseCase: SearchProductsUseCase;
  getProductsByCategoryUseCase: GetProductsByCategoryUseCase;
  productService: ProductService;
}

export class DependencyContainer implements DIContainer {
  private _productsPort: GetProductsPort;
  private _productService: ProductService;
  private _getProductsByRankService: GetProductsByRankService;
  private _getProductByIdService: GetProductByIdService;
  private _getAllProductsService: GetAllProductsService;
  private _searchProductsService: SearchProductsService;
  private _getProductsByCategoryService: GetProductsByCategoryService;

  constructor(httpClient: HttpClient, baseUrl?: string) {
    // Secondary Adapter
    this._productsPort = new HttpProductsAdapter(httpClient, baseUrl);

    // Domain Services (Application Layer)
    this._productService = new ProductService(this._productsPort);
    this._getProductsByRankService = new GetProductsByRankService(this._productsPort);
    this._getProductByIdService = new GetProductByIdService(this._productsPort);
    this._getAllProductsService = new GetAllProductsService(this._productsPort);
    this._searchProductsService = new SearchProductsService(this._productsPort);
    this._getProductsByCategoryService = new GetProductsByCategoryService(this._productsPort);
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
export function createContainer(httpClient: HttpClient, baseUrl?: string): DIContainer {
  return new DependencyContainer(httpClient, baseUrl);
}