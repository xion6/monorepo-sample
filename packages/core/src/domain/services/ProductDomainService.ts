import { Product, Products } from '../entities/Product'

/**
 * Domain Service for product-related business logic
 * Contains pure business rules that don't belong to a single entity
 */
export class ProductDomainService {
  /**
   * Ranks products based on business rules
   * Pure domain logic without external dependencies
   */
  sortByRank(products: Products): Products {
    return [...products].sort((a, b) => a.rank - b.rank)
  }

  /**
   * Filters products by category
   */
  filterByCategory(products: Products, categoryId: string): Products {
    return products.filter((p) => p.categoryId === categoryId)
  }

  /**
   * Sorts products by price
   */
  sortByPrice(products: Products, ascending: boolean = true): Products {
    return [...products].sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    )
  }

  /**
   * Finds product by ID
   */
  findById(products: Products, id: string): Product | undefined {
    return products.find((p) => p.id === id)
  }

  /**
   * Calculates product relevance score based on business criteria
   */
  calculateProductScore(product: Product): number {
    // Base score from product rank
    let score = product.rank

    // Business rule: In-stock products get priority
    if (product.stock > 0) {
      score += 10
    }

    // Business rule: Recently updated products get boost
    const daysSinceUpdate = Math.floor(
      (Date.now() - product.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceUpdate < 7) {
      score += 5
    }

    return score
  }

  /**
   * Determines if products can be grouped together
   * Business rule for product compatibility
   */
  canProductsBeGrouped(products: Products): boolean {
    if (products.length === 0) return false

    // Business rule: All products must be in stock
    return products.every((product) => product.stock > 0)
  }
}
