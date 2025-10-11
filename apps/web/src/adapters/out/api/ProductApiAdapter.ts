import { z } from 'zod'

import {
  ProductDataSchema,
  type GetProductsPort,
  type ProductData,
} from '@ecommerce/core'

/**
 * HTTP Client for external product API
 * Secondary adapter implementing GetProductsPort
 */
export class ProductApiAdapter implements GetProductsPort {
  constructor(
    private readonly baseUrl: string = process.env['NEXT_PUBLIC_API_URL'] ??
      'http://localhost:3001'
  ) {}

  /**
   * Fetches products from external API
   * Implements the GetProductsPort contract
   */
  async getProducts(): Promise<ProductData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Validate response with Zod schema
      const ProductArraySchema = z.array(ProductDataSchema)
      return ProductArraySchema.parse(data)
    } catch (error) {
      console.error('Failed to fetch products from API:', error)

      // Return mock data for development
      return this.getMockProducts()
    }
  }

  /**
   * Mock data for development/testing
   * Remove in production
   */
  private getMockProducts(): ProductData[] {
    return [
      {
        id: '1',
        name: 'Sample Product 1',
        rank: 2,
        description: 'A sample product for testing',
        price: 29.99,
        categoryId: 'electronics',
        imageUrl: 'https://example.com/image1.jpg',
        stock: 10,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Sample Product 2',
        rank: 1,
        description: 'Another sample product',
        price: 49.99,
        categoryId: 'books',
        imageUrl: 'https://example.com/image2.jpg',
        stock: 5,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-16'),
      },
    ]
  }
}
