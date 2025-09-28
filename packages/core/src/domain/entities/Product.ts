import { z } from 'zod'

// === Domain Value Object Schema ===
// Zodスキーマ：データ構造の定義とバリデーション
export const ProductDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  rank: z.number().int().min(1),
  description: z.string(),
  price: z.number().positive(),
  categoryId: z.string(),
  imageUrl: z.string().url(),
  stock: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// === Domain Types ===
// プリミティブデータ型：外部システムとのデータ交換用
export type ProductData = z.infer<typeof ProductDataSchema>

// === Domain Entity ===
// ドメインエンティティ：ビジネスルールとライフサイクルを持つ
export class Product {
  private constructor(private readonly data: ProductData) {}

  // === Factory Methods ===
  static create(data: ProductData): Product {
    // ドメインレベルのバリデーション
    const validatedData = ProductDataSchema.parse(data)
    return new Product(validatedData)
  }

  static reconstitute(data: ProductData): Product {
    // データベースから復元時（バリデーション済み前提）
    return new Product(data)
  }

  // === Value Object Properties ===
  get id(): string {
    return this.data.id
  }

  get name(): string {
    return this.data.name
  }

  get price(): number {
    return this.data.price
  }

  get rank(): number {
    return this.data.rank
  }

  get description(): string {
    return this.data.description
  }

  get categoryId(): string {
    return this.data.categoryId
  }

  get imageUrl(): string {
    return this.data.imageUrl
  }

  get stock(): number {
    return this.data.stock
  }

  get createdAt(): Date {
    return this.data.createdAt
  }

  get updatedAt(): Date {
    return this.data.updatedAt
  }

  // === Business Rules ===
  isInStock(): boolean {
    return this.data.stock > 0
  }

  canPurchase(quantity: number): boolean {
    if (quantity <= 0) {
      return false
    }
    return this.data.stock >= quantity
  }

  isNewlyAdded(): boolean {
    const daysSinceCreation = Math.floor(
      (Date.now() - this.data.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceCreation <= 7
  }

  isRecentlyUpdated(): boolean {
    const daysSinceUpdate = Math.floor(
      (Date.now() - this.data.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceUpdate <= 3
  }

  // === State Transitions ===
  updateStock(newStock: number): Product {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative')
    }

    const updatedData: ProductData = {
      ...this.data,
      stock: newStock,
      updatedAt: new Date(),
    }

    return new Product(updatedData)
  }

  updatePrice(newPrice: number): Product {
    if (newPrice <= 0) {
      throw new Error('Price must be positive')
    }

    const updatedData: ProductData = {
      ...this.data,
      price: newPrice,
      updatedAt: new Date(),
    }

    return new Product(updatedData)
  }

  // === Data Access ===
  toData(): ProductData {
    return { ...this.data }
  }
}
