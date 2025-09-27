import "reflect-metadata";
import { container } from "tsyringe";
import type { DependencyContainer as TSyringeDependencyContainer } from "tsyringe";
import {
  GetProductsByRankUseCase,
} from './port/in/GetProductsByRankUseCase';
import { GetProductsPort } from './port/out/GetProductsPort';
import {
  GetProductsByRankService,
} from './domain/services/GetProductsByRankService';

// Register dependencies
export function setupContainer(productsPort: GetProductsPort): TSyringeDependencyContainer {
  // Register the port implementation
  container.register<GetProductsPort>("GetProductsPort", { useValue: productsPort });

  // Register services (they will auto-resolve dependencies)
  container.register<GetProductsByRankUseCase>("GetProductsByRankUseCase", { useClass: GetProductsByRankService });

  return container;
}

// Convenience functions for getting services
export function getProductsByRankUseCase(): GetProductsByRankUseCase {
  return container.resolve<GetProductsByRankUseCase>("GetProductsByRankUseCase");
}

