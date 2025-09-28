import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'

import { Product } from '../../domain/entities/Product'
import { ProductDomainService } from '../../domain/services/ProductDomainService'
import { GetRankedProdoctsUseCase } from '../../port/in/GetRankedProductsUseCase'
import { GetProductsPort } from '../../port/out/GetProductsPort'

/**
 * Application Service for GetRankedProducts use case
 * Orchestrates the workflow and coordinates between external resources and domain logic
 */
@injectable()
export class GetRankedProductsApplicationService
  implements GetRankedProdoctsUseCase
{
  private readonly productDomainService: ProductDomainService

  constructor(
    @inject('GetProductsPort') private readonly productsPort: GetProductsPort
  ) {
    this.productDomainService = new ProductDomainService()
  }

  /**
   * Executes the use case workflow
   * Application layer responsibilities:
   * - Coordinate external resource access
   * - Delegate to domain services for business logic
   * - Handle cross-cutting concerns (logging, transactions, etc.)
   */
  async execute(): Promise<Product[]> {
    try {
      // 1. Fetch data from external resources (via ports)
      const productDataList = await this.productsPort.getProducts()

      // 2. Convert ProductData to Product entities
      const products = productDataList.map((data) => Product.reconstitute(data))

      // 3. Delegate business logic to domain service
      const rankedProducts = this.productDomainService.sortByRank(products)

      // 4. Additional application-level processing could go here:
      // - Audit logging
      // - Performance monitoring
      // - Security checks
      // - Transaction management

      return rankedProducts
    } catch (error) {
      // 5. Application-level error handling
      console.error('Failed to get ranked products:', error)
      throw error
    }
  }
}
