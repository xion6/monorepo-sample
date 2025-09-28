# @ecommerce/web

Next.js 15をベースとしたモダンなE-commerceフロントエンドアプリケーション。React 19とTailwindCSS 4を採用し、Turbopackによる高速開発環境を提供します。

## 🎯 概要

この`@ecommerce/web`パッケージは、E-commerceプラットフォームのメインフロントエンドアプリケーションです。最新のNext.js機能とReact Server Componentsを活用し、高性能なユーザー体験を実現します。

## 🛠️ 技術スタック

### コア技術

- **Next.js 15.5.3**: React Server Components、App Router、Turbopack
- **React 19.1.0**: 最新のHooksとSuspense機能
- **TypeScript 5**: 型安全な開発体験

### スタイリング・UI

- **TailwindCSS 4**: Zero-runtime CSS-in-JS
- **@ecommerce/ui**: 社内React コンポーネントライブラリ

### 開発・品質管理

- **ESLint 9**: @ecommerce/eslint-config による統一されたコード品質
- **Prettier**: 一貫したコードフォーマット
- **Turbopack**: 高速バンドラーによる開発効率向上

### アーキテクチャ

- **TSyringe**: 依存性注入によるテスタブルな設計
- **Zod**: 実行時型検証とAPIバリデーション
- **@ecommerce/core**: ビジネスロジック層との連携

## 🚀 開発コマンド

### 基本操作

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# 本番ビルド（Turbopack使用）
pnpm build

# 本番サーバー起動
pnpm start

# 型チェック（tsc --noEmit）
pnpm typecheck
```

### 品質管理

```bash
# ESLint実行
pnpm lint

# ESLint自動修正
pnpm lint:fix

# Prettier実行
pnpm format

# ビルド成果物削除
pnpm clean
```

### ルートレベルからの操作

```bash
# Web アプリのみ開発サーバー起動
pnpm --filter @ecommerce/web dev

# Web アプリのみビルド
pnpm --filter @ecommerce/web build

# Web アプリのみLint
pnpm --filter @ecommerce/web lint
```

## 📁 ディレクトリ構造

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # ルートレイアウト
│   │   ├── page.tsx      # ホームページ
│   │   └── globals.css   # グローバルスタイル
│   ├── components/       # アプリケーション固有コンポーネント
│   ├── lib/             # ユーティリティ・設定
│   └── types/           # 型定義
├── public/              # 静的アセット
├── next.config.js       # Next.js設定
├── tailwind.config.js   # TailwindCSS設定
└── tsconfig.json        # TypeScript設定
```

## 🔧 設定詳細

### Next.js設定

- **Turbopack**: 開発・本番両方で使用
- **TypeScript**: 厳密な型チェック
- **ESLint**: next/core-web-vitals + 社内設定

### TailwindCSS設定

- **v4設定**: Zero-runtime CSS-in-JS
- **カスタムテーマ**: ブランドカラー・フォント設定
- **レスポンシブ**: モバイルファースト設計

### TypeScript設定

- **Project References**: @ecommerce/typescript-config/nextjs.json継承
- **厳密モード**: strict、noImplicitAny、noImplicitReturns有効
- **Path Mapping**: `@/`でsrcディレクトリへのエイリアス

## 🏗️ アーキテクチャパターン

### コンポーネント設計

```typescript
// Server Components（デフォルト）
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// Client Components（'use client'必要）
'use client';
export function ProductCart() {
  const [items, setItems] = useState([]);
  // インタラクティブロジック
}
```

### 依存性注入パターン

```typescript
import { container } from 'tsyringe'
import { ProductService } from '@ecommerce/core'

// サービス注入
const productService = container.resolve(ProductService)
```

### 型安全なAPI呼び出し

```typescript
import { z } from 'zod'

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
})

type Product = z.infer<typeof ProductSchema>
```

## 🎨 UIコンポーネント活用

### 社内UIライブラリの使用

```typescript
import { Button, Card, Input } from '@ecommerce/ui';

export function ProductForm() {
  return (
    <Card>
      <Input placeholder="商品名" />
      <Button variant="primary">追加</Button>
    </Card>
  );
}
```

## 🔗 関連パッケージ

- **[@ecommerce/core](../packages/core/README.md)**: ビジネスロジック・ドメイン層
- **[@ecommerce/ui](../packages/ui/README.md)**: Reactコンポーネントライブラリ
- **[@ecommerce/typescript-config](../tools/typescript-config/README.md)**: 共有TypeScript設定

## 📋 パフォーマンス最適化

### ビルド最適化

- **Turbopack**: 従来webpack比10倍高速なバンドリング
- **Tree Shaking**: 未使用コード自動削除
- **Code Splitting**: 自動的なチャンク分割

### ランタイム最適化

- **Server Components**: サーバーサイドレンダリング
- **Image Optimization**: Next.js Imageコンポーネント
- **Font Optimization**: システムフォント優先読み込み

---

**Note**: このアプリケーションはモノレポの一部であり、`@ecommerce/core`パッケージと密に連携します。開発時は必ずルートディレクトリから`pnpm dev`でアプリケーション全体を起動してください。
