import 'reflect-metadata'

import { container } from 'tsyringe'
import type { DependencyContainer as TSyringeDependencyContainer } from 'tsyringe'

import { GetProductsApplicationService } from './application/services/GetProductsApplicationService.js'
import type { GetProductsUseCase as IGetProductsUseCase } from './port/in/GetProductsUseCase.js'
import type { GetProductsPort } from './port/out/GetProductsPort.js'

// Register dependencies
export const setupContainer = (
  productsPort: GetProductsPort
): TSyringeDependencyContainer => {
  // Register the port implementation
  container.register<GetProductsPort>('GetProductsPort', {
    useValue: productsPort,
  })

  // Register application services (they will auto-resolve dependencies)
  container.register<IGetProductsUseCase>('GetProductsUseCase', {
    useClass: GetProductsApplicationService,
  })

  return container
}

// Convenience functions for getting services
export const GetProductsUseCase = (): IGetProductsUseCase => {
  return container.resolve<IGetProductsUseCase>('GetProductsUseCase')
}
