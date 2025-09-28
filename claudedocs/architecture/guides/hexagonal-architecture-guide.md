# ヘキサゴナルアーキテクチャ設計ガイド

## 概要

本プロジェクトではヘキサゴナルアーキテクチャ（Ports & Adapters）を採用し、ビジネスロジックを技術実装から完全に分離した保守性の高いシステムを構築しています。

## アーキテクチャ原則

### 基本理念
- **ビジネスロジックの独立性**: ドメインロジックは外部システムや技術実装に依存しない
- **依存性逆転**: アプリケーションコアが外部システムのインターフェースを定義
- **テスタビリティ**: 各層が独立してテスト可能
- **保守性**: 技術実装の変更がビジネスロジックに影響しない

### 依存関係の方向
```
外部システム → Adapters → Ports → Application → Domain
                 ↑         ↑         ↑         ↑
            技術実装   インターフェース  調整  ビジネスロジック
```

## レイヤー構成

### 📁 プロジェクト構造
```
packages/core/src/
├── domain/           # ドメイン層（中心）
│   ├── entities/     # エンティティ
│   └── services/     # ドメインサービス
├── port/             # ポート層（インターフェース）
│   ├── in/          # Inbound Ports（ユースケース）
│   └── out/         # Outbound Ports（外部システム）
├── application/      # アプリケーション層（調整）
│   └── services/    # アプリケーションサービス
└── di.ts            # 依存性注入設定

apps/web/src/
├── adapters/         # アダプター層（技術実装）
│   └── out/         # Secondary Adapters
└── lib/             # DI設定
```

## 各レイヤーの詳細

### 🎯 Domain Layer - ドメイン層

**責務**: 純粋なビジネスロジックとルール

#### Entities - エンティティ
```typescript
// src/domain/entities/Product.ts
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
  // ...
})

export type Product = z.infer<typeof ProductSchema>

export class ProductEntity {
  constructor(private product: Product) {}

  isInStock(): boolean {
    return this.product.stock > 0
  }

  canPurchase(quantity: number): boolean {
    return this.product.stock >= quantity
  }
}
```

#### Domain Services - ドメインサービス
```typescript
// src/domain/services/ProductDomainService.ts
export class ProductDomainService {
  sortByRank(products: Products): Products {
    return [...products].sort((a, b) => a.rank - b.rank)
  }

  calculateProductScore(product: Product): number {
    let score = product.rank
    if (product.stock > 0) score += 10
    return score
  }
}
```

**制約**:
- ❌ 他の層への依存禁止
- ✅ 純粋な関数・クラスのみ
- ✅ ビジネスルールの実装

### 🚪 Port Layer - ポート層

**責務**: インターフェースの定義（契約）

#### Inbound Ports - ユースケース
```typescript
// src/port/in/GetRankedProductsUseCase.ts
export interface GetRankedProductsUseCase {
  execute(): Promise<Products>
}
```

#### Outbound Ports - 外部システムインターフェース
```typescript
// src/port/out/GetProductsPort.ts
export interface GetProductsPort {
  getProducts(): Promise<Products>
}
```

**制約**:
- ❌ アプリケーション層・アダプター層への依存禁止
- ✅ ドメインエンティティのみ参照
- ✅ インターフェース定義のみ

### ⚙️ Application Layer - アプリケーション層

**責務**: ユースケースの調整とオーケストレーション

```typescript
// src/application/services/GetRankedProductsApplicationService.ts
@injectable()
export class GetRankedProductsApplicationService implements GetRankedProductsUseCase {
  constructor(
    @inject('GetProductsPort') private readonly productsPort: GetProductsPort
  ) {
    this.productDomainService = new ProductDomainService()
  }

  async execute(): Promise<Products> {
    // 1. 外部データ取得（ポート経由）
    const products = await this.productsPort.getProducts()

    // 2. ビジネスロジック実行（ドメインサービス経由）
    const rankedProducts = this.productDomainService.sortByRank(products)

    // 3. 横断的関心事（ログ、監査など）
    console.log(`Processed ${rankedProducts.length} products`)

    return rankedProducts
  }
}
```

**制約**:
- ❌ アダプター・インフラへの直接依存禁止
- ✅ ドメイン・ポート層の利用
- ✅ 依存性注入による疎結合

### 🔌 Adapter Layer - アダプター層

**責務**: 外部システムとの技術的な統合

```typescript
// apps/web/src/adapters/out/api/ProductApiAdapter.ts
export class ProductApiAdapter implements GetProductsPort {
  constructor(private readonly baseUrl: string) {}

  async getProducts(): Promise<Products> {
    const response = await fetch(`${this.baseUrl}/api/products`)
    const data = await response.json()
    return ProductArraySchema.parse(data) // バリデーション
  }
}
```

**制約**:
- ⚠️ ドメイン直接アクセス非推奨（ポート経由を推奨）
- ✅ 任意の技術スタック利用可能
- ✅ ポートインターフェースの実装

## 依存性注入（DI）

### Core Package - 抽象的なセットアップ
```typescript
// packages/core/src/di.ts
export function setupContainer(productsPort: GetProductsPort): DependencyContainer {
  container.register<GetProductsPort>('GetProductsPort', {
    useValue: productsPort,
  })

  container.register<GetRankedProductsUseCase>('GetRankedProductsUseCase', {
    useClass: GetRankedProductsApplicationService,
  })

  return container
}
```

### Application Package - 具体的な実装注入
```typescript
// apps/web/src/lib/container.ts
const productApiAdapter = new ProductApiAdapter()
setupContainer(productApiAdapter)

export { GetRankedProductsUseCase } from '@ecommerce/core'
```

## ESLint による依存関係強制

### 設定概要
```javascript
// tools/eslint-config/clean-architecture.mjs
export default [
  // Domain Layer - 完全分離
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["**/application/**"], message: "❌ Domain layer cannot import from Application layer" },
          { group: ["**/port/**"], message: "❌ Domain layer cannot import from Port layer" },
          { group: ["**/adapters/**"], message: "❌ Domain layer cannot import from Adapters" }
        ]
      }]
    }
  },
  // Port Layer - インターフェース純化
  // Application Layer - 依存性逆転強制
  // Adapter Layer - ベストプラクティス推奨
]
```

### 検証されるルール
1. **ドメイン→他層**: 完全禁止
2. **ポート→アプリケーション/アダプター**: 完全禁止
3. **アプリケーション→アダプター**: 完全禁止
4. **アダプター→ドメイン**: 非推奨警告

## 実装ガイドライン

### 新機能追加の手順

#### 1. ドメイン層から開始
```typescript
// 1. エンティティ定義
export interface OrderEntity {
  id: string
  customerId: string
  totalAmount: number
}

// 2. ドメインサービス
export class OrderDomainService {
  calculateTotalWithTax(order: Order): number {
    return order.totalAmount * 1.1 // ビジネスルール
  }
}
```

#### 2. ポート層でインターフェース定義
```typescript
// Inbound Port
export interface CreateOrderUseCase {
  execute(orderData: CreateOrderRequest): Promise<Order>
}

// Outbound Port
export interface OrderRepositoryPort {
  save(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
}
```

#### 3. アプリケーション層で調整
```typescript
@injectable()
export class CreateOrderApplicationService implements CreateOrderUseCase {
  constructor(
    @inject('OrderRepositoryPort') private orderRepo: OrderRepositoryPort
  ) {}

  async execute(orderData: CreateOrderRequest): Promise<Order> {
    // バリデーション・調整・永続化
  }
}
```

#### 4. アダプター層で技術実装
```typescript
export class DatabaseOrderAdapter implements OrderRepositoryPort {
  async save(order: Order): Promise<void> {
    // データベース実装
  }
}
```

#### 5. DI設定更新
```typescript
container.register<OrderRepositoryPort>('OrderRepositoryPort', {
  useClass: DatabaseOrderAdapter
})
```

### テスト戦略

#### Unit Testing - 各層独立
```typescript
// Domain Service Test
describe('OrderDomainService', () => {
  it('should calculate tax correctly', () => {
    const service = new OrderDomainService()
    const result = service.calculateTotalWithTax({ totalAmount: 100 })
    expect(result).toBe(110)
  })
})

// Application Service Test (Mock使用)
describe('CreateOrderApplicationService', () => {
  it('should create order', async () => {
    const mockRepo = jest.fn()
    const service = new CreateOrderApplicationService(mockRepo)
    // テスト実装
  })
})
```

#### Integration Testing - Port実装
```typescript
describe('DatabaseOrderAdapter', () => {
  it('should save and retrieve order', async () => {
    const adapter = new DatabaseOrderAdapter(testDb)
    const order = { id: '1', customerId: 'customer1', totalAmount: 100 }

    await adapter.save(order)
    const retrieved = await adapter.findById('1')

    expect(retrieved).toEqual(order)
  })
})
```

### Performance Considerations

#### 1. レイヤー間通信の最適化
- 必要最小限のデータ転送
- 適切なデータ変換の配置

#### 2. 依存性注入のオーバーヘッド
- シングルトンパターンの活用
- 遅延初期化の検討

#### 3. ポート抽象化のコスト
- インターフェース設計の慎重な検討
- 過度な抽象化の回避

## トラブルシューティング

### よくある問題

#### 1. 循環依存
**症状**: ImportError や undefined references
**解決**: 依存関係の見直し、インターフェース分離

#### 2. ESLint違反
**症状**: no-restricted-imports エラー
**解決**: アーキテクチャルールに従った修正

#### 3. DI設定ミス
**症状**: 実行時の依存解決エラー
**解決**: container.register の設定確認

### デバッグ手順

1. **依存関係の確認**: import文の検証
2. **ポート実装の確認**: インターフェース適合性
3. **DI設定の確認**: 登録済み依存関係の確認
4. **ESLint実行**: `pnpm lint` でルール違反検出

## ベストプラクティス

### DO - 推奨事項
✅ **ドメインロジックの純粋性**: 外部依存なしの関数・クラス
✅ **インターフェース優先設計**: 実装前にポート定義
✅ **単一責任の原則**: 各層の責務を明確に分離
✅ **依存性注入の活用**: テスタブルな設計
✅ **型安全性の確保**: TypeScript + Zodによるバリデーション

### DON'T - 避けるべき事項
❌ **レイヤー違反**: ESLintルールに従う
❌ **神クラス**: 単一クラスへの責務集中
❌ **具象依存**: インターフェースを介さない直接依存
❌ **ビジネスロジックの漏洩**: アダプター層でのビジネスルール実装
❌ **過度な抽象化**: 不要なインターフェース作成

## まとめ

ヘキサゴナルアーキテクチャにより以下を実現：

1. **保守性**: 技術変更の影響局所化
2. **テスタビリティ**: モック・スタブによる独立テスト
3. **拡張性**: 新しいアダプター追加の容易さ
4. **可読性**: 責務分離による理解しやすさ
5. **再利用性**: ドメインロジックの他システム流用

このアーキテクチャにより、長期的な保守性と品質を確保したシステム開発が可能になります。