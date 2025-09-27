import "reflect-metadata";
import { container } from "tsyringe";
import type { DependencyContainer as TSyringeDependencyContainer } from "tsyringe";
import { GetRankedProdoctsUseCase } from "./port/in/GetRankedProductsUseCase";
import { GetProductsPort } from "./port/out/GetProductsPort";
import { GetRankedProdoctsService } from "./domain/services/GetRankedProdoctsService";

// Register dependencies
export function setupContainer(
  productsPort: GetProductsPort,
): TSyringeDependencyContainer {
  // Register the port implementation
  container.register<GetProductsPort>("GetProductsPort", {
    useValue: productsPort,
  });

  // Register services (they will auto-resolve dependencies)
  container.register<GetRankedProdoctsUseCase>("GetRankedProdoctsUseCase", {
    useClass: GetRankedProdoctsService,
  });

  return container;
}

// Convenience functions for getting services
export function GetRankedProdoctsUseCase(): GetRankedProdoctsUseCase {
  return container.resolve<GetRankedProdoctsUseCase>(
    "GetRankedProdoctsUseCase",
  );
}
