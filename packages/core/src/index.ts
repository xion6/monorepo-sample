// Export all entities and services
// export { Product, ProductDataSchema, type ProductData } from './domain/entities'
export {
  Product,
  ProductDataSchema,
  type ProductData,
} from './domain/entities/index.js'

// Export ports
export type { GetProductsPort } from './port/out/GetProductsPort.js'

// Export DI container
export { setupContainer, GetProductsUseCase } from './di.js'

// Export application services for external use
export { GetProductsApplicationService } from './application/services/GetProductsApplicationService.js'

// Export domain services
export { ProductDomainService } from './domain/services/ProductDomainService.js'
