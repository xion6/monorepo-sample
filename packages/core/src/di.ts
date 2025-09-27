import 'reflect-metadata'
import type { DependencyContainer as TSyringeDependencyContainer } from 'tsyringe'

import { container } from 'tsyringe'

import { GetRankedProdoctsService } from './domain/services/GetRankedProdoctsService'
import { GetRankedProdoctsUseCase } from './port/in/GetRankedProductsUseCase'
import { GetProductsPort } from './port/out/GetProductsPort'

// Register dependencies
export function setupContainer(
  productsPort: GetProductsPort
): TSyringeDependencyContainer {
  // Register the port implementation
  container.register<GetProductsPort>('GetProductsPort', {
    useValue: productsPort,
  })

  // Register services (they will auto-resolve dependencies)
  container.register<GetRankedProdoctsUseCase>('GetRankedProdoctsUseCase', {
    useClass: GetRankedProdoctsService,
  })

  return container
}

// Convenience functions for getting services
export function GetRankedProdoctsUseCase(): GetRankedProdoctsUseCase {
  return container.resolve<GetRankedProdoctsUseCase>('GetRankedProdoctsUseCase')
}
