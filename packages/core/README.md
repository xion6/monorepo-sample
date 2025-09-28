# @ecommerce/core

E-commerceプラットフォームのビジネスロジックとドメイン層を担う中核パッケージ。TypeScript + TSyringe + Zodによる型安全で拡張性の高いアーキテクチャを提供します。

## 🎯 概要

`@ecommerce/core`は、E-commerceプラットフォームのドメイン駆動設計（DDD）を実装したビジネスロジック層です。依存性注入、型安全性、テスタビリティを重視した設計により、保守性の高いコードベースを実現します。

## 🛠️ 技術スタック

### コア技術

- **TypeScript 5**: 型安全なビジネスロジック実装
- **TSyringe**: 依存性注入コンテナ
- **Zod**: 実行時型検証とスキーマバリデーション

### アーキテクチャパターン

- **ドメイン駆動設計**: Entity、Value Object、Repository パターン
- **Clean Architecture**: 依存関係の逆転による疎結合設計
- **CQRS**: Command Query Responsibility Segregation

### 開発・品質管理

- **ESLint 9**: @ecommerce/eslint-config による統一されたコード品質
- **Prettier**: 一貫したコードフォーマット
- **TypeScript strict mode**: 厳密な型チェック

## 🚀 開発コマンド

### 基本操作

```bash
# TypeScript ビルド
pnpm build

# 開発モード（watch mode）
pnpm dev

# 型チェック（noEmit）
pnpm typecheck

# ビルド成果物削除
pnpm clean
```

### 品質管理

```bash
# ESLint実行
pnpm lint

# ESLint自動修正
pnpm lint:fix

# Prettier実行
pnpm format
```

### ルートレベルからの操作

```bash
# Core パッケージのみビルド
pnpm --filter @ecommerce/core build

# Core パッケージのみLint
pnpm --filter @ecommerce/core lint

# Core パッケージのみ開発モード
pnpm --filter @ecommerce/core dev
```

## 📁 ディレクトリ構造

```
packages/core/
├── src/
│   ├── domain/              # ドメイン層
│   │   ├── entities/        # エンティティ
│   │   ├── value-objects/   # 値オブジェクト
│   │   ├── repositories/    # リポジトリインターフェース
│   │   └── services/        # ドメインサービス
│   ├── application/         # アプリケーション層
│   │   ├── services/        # アプリケーションサービス
│   │   ├── use-cases/       # ユースケース
│   │   └── commands/        # コマンド・クエリ
│   ├── infrastructure/      # インフラストラクチャ層
│   │   ├── repositories/    # リポジトリ実装
│   │   ├── external/        # 外部API連携
│   │   └── persistence/     # データ永続化
│   └── index.ts            # パブリックAPI
├── dist/                   # ビルド成果物
└── tsconfig.json          # TypeScript設定
```

## 🏗️ アーキテクチャパターン

### ドメインエンティティ

```typescript
// src/domain/entities/Product.ts
export class Product {
  constructor(
    private readonly id: ProductId,
    private readonly name: ProductName,
    private readonly price: Money
  ) {}

  public getId(): ProductId {
    return this.id
  }

  public changePrice(newPrice: Money): Product {
    return new Product(this.id, this.name, newPrice)
  }
}
```

### 値オブジェクト

```typescript
// src/domain/value-objects/Money.ts
import { z } from 'zod'

const MoneySchema = z.object({
  amount: z.number().min(0),
  currency: z.enum(['JPY', 'USD', 'EUR']),
})

export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {}

  public static create(amount: number, currency: string): Money {
    const result = MoneySchema.parse({ amount, currency })
    return new Money(result.amount, result.currency)
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies')
    }
    return new Money(this.amount + other.amount, this.currency)
  }
}
```

### リポジトリパターン

```typescript
// src/domain/repositories/ProductRepository.ts
export interface ProductRepository {
  findById(id: ProductId): Promise<Product | null>
  save(product: Product): Promise<void>
  findByCategory(category: CategoryId): Promise<Product[]>
}

// src/infrastructure/repositories/InMemoryProductRepository.ts
@injectable()
export class InMemoryProductRepository implements ProductRepository {
  private products: Map<string, Product> = new Map()

  async findById(id: ProductId): Promise<Product | null> {
    return this.products.get(id.value) || null
  }

  async save(product: Product): Promise<void> {
    this.products.set(product.getId().value, product)
  }
}
```

### アプリケーションサービス

```typescript
// src/application/services/ProductApplicationService.ts
@injectable()
export class ProductApplicationService {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async createProduct(command: CreateProductCommand): Promise<ProductId> {
    const product = Product.create(
      ProductId.generate(),
      ProductName.create(command.name),
      Money.create(command.price, command.currency)
    )

    await this.productRepository.save(product)
    return product.getId()
  }
}
```

### 依存性注入設定

```typescript
// src/container.ts
import { container } from 'tsyringe'

export function configureContainer(): void {
  container.register<ProductRepository>('ProductRepository', {
    useClass: InMemoryProductRepository,
  })

  container.register(ProductApplicationService, {
    useClass: ProductApplicationService,
  })
}
```

## 🎯 ドメインモデリング

### E-commerce ドメイン

```typescript
// 主要ドメインエンティティ
export interface EcommerceDomain {
  // 商品管理
  Product: Entity
  Category: Entity
  Inventory: Entity

  // 注文管理
  Order: Entity
  OrderItem: ValueObject
  ShippingAddress: ValueObject

  // 顧客管理
  Customer: Entity
  CustomerProfile: ValueObject

  // 支払い
  Payment: Entity
  PaymentMethod: ValueObject
}
```

### ビジネスルール実装例

```typescript
// src/domain/services/PricingService.ts
@injectable()
export class PricingService {
  calculateTotalPrice(
    items: OrderItem[],
    customer: Customer,
    promotions: Promotion[]
  ): Money {
    let total = items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Money.zero('JPY')
    )

    // ビジネスルール: 会員割引
    if (customer.isPremiumMember()) {
      total = total.multiply(0.9) // 10%割引
    }

    // プロモーション適用
    for (const promotion of promotions) {
      total = promotion.apply(total, items)
    }

    return total
  }
}
```

## 🧪 テストパターン

### ユニットテスト例

```typescript
// src/domain/entities/__tests__/Product.test.ts
describe('Product', () => {
  it('should change price correctly', () => {
    const product = Product.create(
      ProductId.generate(),
      ProductName.create('Test Product'),
      Money.create(1000, 'JPY')
    )

    const newPrice = Money.create(1200, 'JPY')
    const updatedProduct = product.changePrice(newPrice)

    expect(updatedProduct.getPrice()).toBe(newPrice)
  })
})
```

## 🔗 関連パッケージ

- **[@ecommerce/web](../../apps/web/README.md)**: フロントエンドアプリケーション
- **[@ecommerce/ui](../ui/README.md)**: UIコンポーネントライブラリ
- **[@ecommerce/typescript-config](../../tools/typescript-config/README.md)**: 共有TypeScript設定

## 📋 ベストプラクティス

### 依存性注入

```typescript
// ✅ 良い例: インターフェースに依存
constructor(
  @inject('ProductRepository')
  private readonly repository: ProductRepository
) {}

// ❌ 悪い例: 具象クラスに依存
constructor(
  private readonly repository: MySQLProductRepository
) {}
```

### 不変性の保持

```typescript
// ✅ 良い例: 新しいインスタンスを返す
public changePrice(newPrice: Money): Product {
  return new Product(this.id, this.name, newPrice);
}

// ❌ 悪い例: 自身を変更
public changePrice(newPrice: Money): void {
  this.price = newPrice;
}
```

### バリデーション

```typescript
// ✅ 良い例: Zodを使った型安全なバリデーション
const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  currency: z.enum(['JPY', 'USD', 'EUR']),
})

export type CreateProductCommand = z.infer<typeof CreateProductSchema>
```

---

**Note**: このパッケージはビジネスロジックの中核であり、フロントエンド・バックエンド双方から利用されます。ドメインルールの変更時は影響範囲を慎重に検討してください。
