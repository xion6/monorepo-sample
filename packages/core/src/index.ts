// Export all entities and services
export { Product, ProductDataSchema, type ProductData } from './domain/entities'

// Export ports
export { GetProductsPort } from './port/out/GetProductsPort'

// Export DI container
export { setupContainer, GetProductsUseCase } from './di'

// Export application services for external use
export { GetProductsApplicationService } from './application/services/GetProductsApplicationService'

// Export domain services
export { ProductDomainService } from './domain/services/ProductDomainService'
