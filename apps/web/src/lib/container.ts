import { setupContainer } from '@ecommerce/core'

import { ProductApiAdapter } from '../adapters/out/api/ProductApiAdapter'

/**
 * Application-specific DI container setup
 * Configures the global container with concrete adapter implementations
 */

// Initialize adapters and setup global container
const productApiAdapter = new ProductApiAdapter()
setupContainer(productApiAdapter)

/**
 * Re-export use case functions for easy access
 */
export { GetProductsUseCase } from '@ecommerce/core'
