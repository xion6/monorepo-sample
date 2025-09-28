import 'reflect-metadata'
import type { DependencyContainer as TSyringeDependencyContainer } from 'tsyringe'

import { container } from 'tsyringe'

import { GetProductsApplicationService } from './application/services/GetProductsApplicationService'
import type { GetProductsUseCase } from './port/in/GetProductsUseCase'
import type { GetProductsPort } from './port/out/GetProductsPort'

// Register dependencies
export function setupContainer(
  productsPort: GetProductsPort
): TSyringeDependencyContainer {
  // Register the port implementation
  container.register<GetProductsPort>('GetProductsPort', {
    useValue: productsPort,
  })

  // Register application services (they will auto-resolve dependencies)
  container.register<GetProductsUseCase>('GetProductsUseCase', {
    useClass: GetProductsApplicationService,
  })

  return container
}

// Convenience functions for getting services
export function GetProductsUseCase(): GetProductsUseCase {
  return container.resolve<GetProductsUseCase>('GetProductsUseCase')
}
