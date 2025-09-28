# コントリビューションガイド

E-commerce Platform Monorepoへの貢献を歓迎します！このガイドでは、プロジェクトへの効果的な貢献方法を説明します。

## 🚀 開発環境のセットアップ

### 必要な環境

- **Node.js**: 20.x以上
- **pnpm**: 8.6.0以上（推奨）
- **Git**: 最新版

### 初期セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd monorepo-sample

# 依存関係のインストール
pnpm install

# 開発サーバー起動（全アプリケーション）
pnpm dev

# ビルドテスト
pnpm build

# Lintチェック
pnpm lint
```

## 📋 開発ワークフロー

### 1. ブランチ戦略

```bash
# 機能開発
git checkout -b feature/商品検索機能
git checkout -b feature/user-authentication

# バグ修正
git checkout -b fix/商品価格表示バグ
git checkout -b fix/responsive-layout

# パフォーマンス改善
git checkout -b perf/画像読み込み最適化
git checkout -b perf/bundle-size-reduction

# ドキュメント更新
git checkout -b docs/api-documentation
git checkout -b docs/setup-guide
```

### 2. 開発フロー

```bash
# 1. 最新のmainブランチから分岐
git checkout main
git pull origin main
git checkout -b feature/your-feature

# 2. 開発作業
# ファイル編集・コミット

# 3. テスト・品質チェック
pnpm lint          # ESLint実行
pnpm typecheck     # TypeScript型チェック
pnpm test          # テスト実行（実装時）
pnpm build         # ビルド確認

# 4. コミット（Conventionalスタイル）
git add .
git commit -m "feat(web): 商品検索機能を実装"

# 5. プッシュとプルリクエスト
git push origin feature/your-feature
```

## 📝 コミットメッセージ規約

### Conventional Commits形式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### タイプ一覧

- **feat**: 新機能追加
- **fix**: バグ修正
- **docs**: ドキュメント変更
- **style**: コードフォーマット変更（機能に影響なし）
- **refactor**: リファクタリング
- **perf**: パフォーマンス改善
- **test**: テスト追加・修正
- **chore**: ビルドプロセス・補助ツール変更

### スコープ例

- **web**: @ecommerce/web パッケージ
- **core**: @ecommerce/core パッケージ
- **ui**: @ecommerce/ui パッケージ
- **config**: 設定ファイル（eslint、typescript等）
- **ci**: CI/CD関連

### コミット例

```bash
feat(web): 商品詳細ページにレビュー機能を追加

ユーザーが商品にレビューを投稿できる機能を実装
- レビューフォームコンポーネント作成
- 評価（5段階）とコメント入力対応
- レビュー一覧表示機能

Closes #123

fix(core): 商品価格計算での税込み処理を修正

税率計算で小数点以下の処理が不正確だった問題を修正
- Math.round()による四捨五入処理を追加
- 単体テストでエッジケースを検証

perf(ui): Buttonコンポーネントの再レンダリング最適化

React.memoとuseMemoによる最適化を実装
- 不要な再レンダリングを削減
- props変更時のみ再描画されるよう改善

docs(README): セットアップ手順を更新

Node.js 20.x要件の追記とpnpm使用手順を明確化
```

## 🏗️ アーキテクチャガイドライン

### パッケージ構成ルール

```
apps/           # アプリケーション層
├── web/        # Next.jsフロントエンド
└── api/        # バックエンドAPI（将来実装）

packages/       # 共有ライブラリ
├── core/       # ビジネスロジック（ドメイン層）
├── ui/         # UIコンポーネント
└── shared/     # 共通ユーティリティ

tools/          # 開発ツール設定
├── eslint-config/     # ESLint共有設定
└── typescript-config/ # TypeScript共有設定
```

### 依存関係ルール

```
✅ 許可される依存関係
apps/web → packages/core
apps/web → packages/ui
packages/ui → packages/core
packages/* → tools/*

❌ 禁止される依存関係
packages/core → apps/*
packages/core → packages/ui
tools/* → packages/*
tools/* → apps/*
```

### コード品質基準

#### TypeScript

```typescript
// ✅ 良い例: 明確な型定義
interface ProductProps {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
}

// ❌ 悪い例: any型の使用
function processProduct(product: any) {
  return product.name;
}

// ✅ 良い例: Union型
type Status = "pending" | "approved" | "rejected";

// ✅ 良い例: 型ガード
function isProduct(item: unknown): item is Product {
  return typeof item === "object" && item !== null && "id" in item;
}
```

#### React コンポーネント

```typescript
// ✅ 良い例: Props型定義とフォワードRef
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', ...props }, ref) => {
    return <button ref={ref} className={getButtonClasses(variant, size)} {...props} />;
  }
);

Button.displayName = 'Button';

// ✅ 良い例: カスタムHook
function useProductSearch(query: string) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 検索ロジック
  }, [query]);

  return { results, loading };
}
```

#### ドメインモデル（core）

```typescript
// ✅ 良い例: 不変性を保つエンティティ
export class Product {
  private constructor(
    private readonly id: ProductId,
    private readonly name: string,
    private readonly price: Money,
  ) {}

  public static create(id: ProductId, name: string, price: Money): Product {
    return new Product(id, name, price);
  }

  public changePrice(newPrice: Money): Product {
    return new Product(this.id, this.name, newPrice);
  }
}

// ✅ 良い例: Zodバリデーション
const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  categoryId: z.string().uuid(),
});

export type CreateProductCommand = z.infer<typeof CreateProductSchema>;
```

## 🧪 テストガイドライン

### テスト戦略

```
Unit Tests       # 関数・コンポーネント単体
├── Domain       # ビジネスロジック（core）
├── Components   # UIコンポーネント（ui）
└── Utils        # ユーティリティ関数

Integration Tests # モジュール間連携
└── API          # APIエンドポイント

E2E Tests        # エンドツーエンド
└── User Flows   # ユーザーシナリオ
```

### テスト例

```typescript
// Domain層のテスト
describe('Product', () => {
  it('should calculate discounted price correctly', () => {
    const product = Product.create(
      ProductId.generate(),
      'Test Product',
      Money.create(1000, 'JPY')
    );

    const discountedProduct = product.applyDiscount(0.1);

    expect(discountedProduct.getPrice().amount).toBe(900);
  });
});

// React コンポーネントのテスト
describe('ProductCard', () => {
  it('should display product information', () => {
    const product = createMockProduct();

    render(<ProductCard product={product} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`¥${product.price}`)).toBeInTheDocument();
  });

  it('should handle add to cart action', async () => {
    const handleAddToCart = jest.fn();
    const product = createMockProduct();

    render(<ProductCard product={product} onAddToCart={handleAddToCart} />);

    await user.click(screen.getByRole('button', { name: 'カートに追加' }));

    expect(handleAddToCart).toHaveBeenCalledWith(product);
  });
});
```

## 📋 プルリクエストガイドライン

### PRテンプレート

```markdown
## 概要

この変更の目的と背景を説明

## 変更内容

- [ ] 新機能追加
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新
- [ ] パフォーマンス改善

## 影響範囲

変更が影響するパッケージ・機能

## テスト

- [ ] 既存テストが通ることを確認
- [ ] 新しいテストを追加（該当する場合）
- [ ] 手動テストを実施

## チェックリスト

- [ ] `pnpm lint` が通る
- [ ] `pnpm typecheck` が通る
- [ ] `pnpm build` が成功する
- [ ] Conventional Commits形式でコミット
- [ ] 関連Issue番号を記載（該当する場合）

## スクリーンショット（UI変更の場合）

変更前後の画面キャプチャ

## 注意事項・備考

レビュアーが知っておくべき情報
```

### レビュー観点

- **機能性**: 要件を満たしているか
- **品質**: コード品質基準に準拠しているか
- **性能**: パフォーマンスへの影響はないか
- **保守性**: 将来の変更に耐えうる設計か
- **テスト**: 適切なテストが書かれているか
- **ドキュメント**: 必要な箇所が更新されているか

## 🐛 バグレポート

### Issue テンプレート

```markdown
## バグの概要

何が期待され、何が実際に起こるか

## 再現手順

1.
2.
3.

## 期待される動作

## 実際の動作

## 環境

- OS:
- ブラウザ:
- Node.js:
- pnpm:

## 追加情報

エラーログ、スクリーンショット等
```

## 💡 機能提案

### Feature Request テンプレート

```markdown
## 機能の概要

提案する機能の説明

## 動機・背景

なぜこの機能が必要か

## 提案する解決策

具体的な実装アイデア

## 代替案

他に考えられるアプローチ

## 影響範囲

この機能が与える影響

## 実装の複雑さ

- [ ] 小（1-2日）
- [ ] 中（3-5日）
- [ ] 大（1週間以上）
```

## 🔗 参考資料

### ドキュメント

- [プロジェクトREADME](./README.md)
- [アーキテクチャドキュメント](./docs/architecture/README.md)
- [開発ガイド](./docs/development/README.md)

### 外部リソース

- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

質問や不明点がある場合は、Issueを作成するか、チームメンバーにお気軽にお尋ねください。皆様のコントリビューションをお待ちしています！
