# アーキテクチャドキュメント

E-commerce Platform Monorepoのシステム設計、アーキテクチャパターン、技術決定記録を文書化します。

## 🏗️ システムアーキテクチャ概要

### レイヤードアーキテクチャ

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│            (apps/web - Next.js)             │
├─────────────────────────────────────────────┤
│             Application Layer                │
│        (apps/web/src/lib - Services)        │
├─────────────────────────────────────────────┤
│               Domain Layer                   │
│           (packages/core - DDD)             │
├─────────────────────────────────────────────┤
│           Infrastructure Layer               │
│         (packages/core/infrastructure)      │
└─────────────────────────────────────────────┘
```

### モノレポ構造

```
monorepo-sample/
├── apps/                    # アプリケーション層
│   └── web/                # Next.js フロントエンド
│       ├── src/app/        # App Router（Next.js 13+）
│       ├── src/components/ # アプリ固有コンポーネント
│       └── src/lib/        # アプリケーションサービス
├── packages/               # 共有ライブラリ
│   ├── core/              # ドメイン・ビジネスロジック
│   │   ├── domain/        # ドメインモデル
│   │   ├── application/   # アプリケーションサービス
│   │   └── infrastructure/# インフラストラクチャ
│   └── ui/                # UIコンポーネントライブラリ
│       ├── atoms/         # 基本コンポーネント
│       ├── molecules/     # 複合コンポーネント
│       └── organisms/     # 複雑なコンポーネント
└── tools/                  # 開発ツール設定
    ├── eslint-config/     # 共有ESLint設定
    └── typescript-config/ # 共有TypeScript設定
```

## 🎯 設計原則

### 1. ドメイン駆動設計（DDD）

```typescript
// Entity: 一意性を持つビジネスオブジェクト
export class Product {
  private constructor(
    private readonly id: ProductId,
    private readonly name: ProductName,
    private readonly price: Money,
  ) {}

  public changePrice(newPrice: Money): Product {
    // ビジネスルール: 価格は正の値である必要がある
    if (newPrice.isNegative()) {
      throw new DomainError("価格は正の値である必要があります");
    }
    return new Product(this.id, this.name, newPrice);
  }
}

// Value Object: 値の等価性で比較されるオブジェクト
export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency,
  ) {
    if (amount < 0) {
      throw new Error("金額は負の値にできません");
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }
}
```

### 2. 依存性の逆転原則

```typescript
// Domain Layer - インターフェース定義
export interface ProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  save(product: Product): Promise<void>;
}

// Application Layer - ドメインサービス
export class ProductApplicationService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: ProductRepository,
  ) {}
}

// Infrastructure Layer - 実装
@injectable()
export class InMemoryProductRepository implements ProductRepository {
  async findById(id: ProductId): Promise<Product | null> {
    // 実装詳細
  }
}
```

### 3. CQRS（Command Query Responsibility Segregation）

```typescript
// Command（状態変更）
export interface CreateProductCommand {
  name: string;
  price: number;
  currency: string;
  categoryId: string;
}

export class CreateProductCommandHandler {
  async handle(command: CreateProductCommand): Promise<ProductId> {
    // コマンド処理ロジック
  }
}

// Query（データ取得）
export interface GetProductQuery {
  id: string;
}

export class GetProductQueryHandler {
  async handle(query: GetProductQuery): Promise<ProductDto> {
    // クエリ処理ロジック
  }
}
```

## 📦 パッケージ設計

### apps/web - プレゼンテーション層

```typescript
// Next.js App Router構造
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx               # ホームページ
├── products/              # 商品関連ページ
│   ├── page.tsx          # 商品一覧
│   ├── [id]/             # 動的ルート
│   │   └── page.tsx      # 商品詳細
│   └── loading.tsx       # ローディングUI
└── api/                   # API Routes（将来実装）
    └── products/
        └── route.ts
```

#### コンポーネント設計パターン

```typescript
// Server Component（デフォルト）
export default async function ProductListPage() {
  const products = await getProducts(); // サーバーサイドでデータ取得

  return (
    <div>
      <ProductGrid products={products} />
    </div>
  );
}

// Client Component（インタラクティブ）
'use client';
export function ProductCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(prev => [...prev, { product, quantity: 1 }]);
  };

  return <Cart items={items} onAdd={addToCart} />;
}
```

### packages/core - ドメイン層

```typescript
// ドメインモデル構造
domain/
├── entities/              # エンティティ
│   ├── Product.ts
│   ├── Order.ts
│   └── Customer.ts
├── value-objects/         # 値オブジェクト
│   ├── Money.ts
│   ├── ProductId.ts
│   └── Email.ts
├── repositories/          # リポジトリインターフェース
│   ├── ProductRepository.ts
│   └── OrderRepository.ts
├── services/             # ドメインサービス
│   ├── PricingService.ts
│   └── InventoryService.ts
└── events/               # ドメインイベント
    ├── ProductCreated.ts
    └── OrderPlaced.ts
```

#### アグリゲート設計

```typescript
// 注文アグリゲート
export class Order {
  private constructor(
    private readonly id: OrderId,
    private readonly customerId: CustomerId,
    private readonly items: OrderItem[],
    private readonly status: OrderStatus,
  ) {}

  public static create(customerId: CustomerId, items: OrderItem[]): Order {
    // ビジネスルール検証
    if (items.length === 0) {
      throw new DomainError("注文には最低1つの商品が必要です");
    }

    const orderId = OrderId.generate();
    return new Order(orderId, customerId, items, OrderStatus.PENDING);
  }

  public addItem(item: OrderItem): Order {
    const updatedItems = [...this.items, item];
    return new Order(this.id, this.customerId, updatedItems, this.status);
  }

  // ドメインイベント発行
  public confirm(): Order {
    const confirmedOrder = new Order(
      this.id,
      this.customerId,
      this.items,
      OrderStatus.CONFIRMED,
    );

    // ドメインイベント発行
    DomainEvents.raise(new OrderConfirmed(this.id, this.customerId));

    return confirmedOrder;
  }
}
```

### packages/ui - コンポーネント層

```typescript
// Atomic Design構造
components/
├── atoms/                 # 基本コンポーネント
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   └── Avatar/
├── molecules/             # 複合コンポーネント
│   ├── SearchBox/
│   ├── ProductCard/
│   ├── PriceDisplay/
│   └── CartItem/
└── organisms/            # 複雑なコンポーネント
    ├── ProductGrid/
    ├── ShoppingCart/
    ├── Navigation/
    └── Footer/
```

#### デザインシステム統合

```typescript
// テーマシステム
export const theme = {
  colors: {
    primary: {
      50: "#eff6ff",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
    semantic: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
} as const;

// コンポーネントでの使用
export const Button = styled.button<{ variant: "primary" | "secondary" }>`
  padding: ${(props) => props.theme.spacing.md};
  background-color: ${(props) =>
    props.variant === "primary"
      ? props.theme.colors.primary[500]
      : props.theme.colors.gray[200]};
`;
```

## 🔄 データフロー

### 1. フロントエンド → バックエンド

```typescript
// 1. UI Component (Presentation)
function ProductForm() {
  const handleSubmit = async (data: ProductFormData) => {
    await createProduct(data); // Application Service呼び出し
  };
}

// 2. Application Service
export async function createProduct(data: ProductFormData) {
  const command = CreateProductCommand.from(data);
  const productId = await container
    .resolve(CreateProductCommandHandler)
    .handle(command);
  return productId;
}

// 3. Command Handler
export class CreateProductCommandHandler {
  async handle(command: CreateProductCommand): Promise<ProductId> {
    const product = Product.create(
      ProductId.generate(),
      ProductName.create(command.name),
      Money.create(command.price, command.currency),
    );

    await this.productRepository.save(product);
    return product.getId();
  }
}
```

### 2. バックエンド → フロントエンド

```typescript
// 1. Query Handler
export class GetProductsQueryHandler {
  async handle(): Promise<ProductDto[]> {
    const products = await this.productRepository.findAll();
    return products.map(product => ProductDto.from(product));
  }
}

// 2. Application Service
export async function getProducts(): Promise<ProductDto[]> {
  return container
    .resolve(GetProductsQueryHandler)
    .handle();
}

// 3. Server Component
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

## 🛡️ セキュリティアーキテクチャ

### 1. 入力検証（多層防御）

```typescript
// 1層目: フロントエンド（UX向上）
const ProductFormSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
});

// 2層目: アプリケーション層（ビジネスルール）
export class CreateProductCommandHandler {
  async handle(command: CreateProductCommand): Promise<ProductId> {
    // バリデーション
    const result = CreateProductSchema.parse(command);
    // ...
  }
}

// 3層目: ドメイン層（不変条件）
export class Product {
  constructor(name: ProductName, price: Money) {
    if (price.isNegative()) {
      throw new DomainError("価格は正の値である必要があります");
    }
  }
}
```

### 2. 認証・認可パターン

```typescript
// 認証ミドルウェア
export async function withAuth<T>(
  handler: (user: User) => Promise<T>,
): Promise<T> {
  const token = getTokenFromRequest();
  const user = await verifyToken(token);

  if (!user) {
    throw new UnauthorizedError();
  }

  return handler(user);
}

// 認可チェック
export class OrderService {
  async getOrder(orderId: OrderId, user: User): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order.belongsTo(user.getId())) {
      throw new ForbiddenError();
    }

    return order;
  }
}
```

## 📊 パフォーマンス設計

### 1. フロントエンドパフォーマンス

```typescript
// Server Components活用
export default async function ProductPage({ params }: { params: { id: string } }) {
  // サーバーサイドでデータ取得
  const product = await getProduct(params.id);

  return (
    <div>
      <ProductDetail product={product} />
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />
      </Suspense>
    </div>
  );
}

// 動的インポート
const LazyProductEditor = dynamic(
  () => import('./ProductEditor'),
  { loading: () => <EditorSkeleton /> }
);
```

### 2. キャッシング戦略

```typescript
// React Cache（Server Components）
import { cache } from "react";

export const getProduct = cache(async (id: string) => {
  return await productRepository.findById(ProductId.create(id));
});

// SWR（Client Components）
export function useProducts() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  return { products: data, loading: isLoading, error };
}
```

## 🧪 テストアーキテクチャ

### テストピラミッド

```
    /\
   /  \    E2E Tests (少数)
  /____\   - ユーザーシナリオ
 /      \
/________\  Integration Tests (中程度)
            - API・DB連携
           Unit Tests (多数)
           - ドメインロジック
           - コンポーネント
```

### テスト戦略

```typescript
// Unit Test - ドメインロジック
describe('Product', () => {
  it('should calculate discounted price correctly', () => {
    const product = Product.create(
      ProductId.generate(),
      ProductName.create('Test Product'),
      Money.create(1000, Currency.JPY)
    );

    const discounted = product.applyDiscount(Percentage.create(10));

    expect(discounted.getPrice().getAmount()).toBe(900);
  });
});

// Integration Test - Repository
describe('ProductRepository', () => {
  it('should save and retrieve product', async () => {
    const product = createTestProduct();

    await repository.save(product);
    const retrieved = await repository.findById(product.getId());

    expect(retrieved).toEqual(product);
  });
});

// Component Test - UI
describe('ProductCard', () => {
  it('should display product information', () => {
    const product = createMockProduct();

    render(<ProductCard product={product} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
  });
});
```

## 🔗 関連ドキュメント

### 設計決定記録（ADR）

- **[ADR-001: ヘキサゴナルアーキテクチャの採用](./decisions/adr-001-hexagonal-architecture.md)**
- **[ADR-002: TypeScript Project Referencesの採用](./decisions/adr-002-typescript-project-references.md)**
- **[ADR-003: Atomic Designの採用](./decisions/adr-003-atomic-design.md)**

### 設計ガイド

- **[ヘキサゴナルアーキテクチャ設計ガイド](./guides/hexagonal-architecture-guide.md)**
- **[ドメインモデリングガイド](./guides/domain-modeling-guide.md)**
- **[コンポーネント設計ガイド](./guides/component-design-guide.md)**

---

このアーキテクチャは継続的に進化します。設計変更時は適切なADRを作成し、関連ドキュメントを更新してください。
