# E-commerce Platform Monorepo

TypeScriptベースのモダンなE-commerceプラットフォーム。Turborepo + pnpm + Next.jsを採用したマルチパッケージアーキテクチャです。

## 🏗️ アーキテクチャ概要

```
monorepo-sample/
├── apps/
│   ├── web/          # Next.js (React 19 + TypeScript) ✅ ESLint設定済み
│   └── docs/         # Storybook（設定なし）
├── packages/
│   ├── core/         # ビジネスロジックライブラリ ✅ ESLint設定済み
│   ├── ui/           # Reactコンポーネントライブラリ（設定なし）
│   ├── utils/        # ユーティリティ関数（設定なし）
│   └── design-tokens/ # デザイントークン（設定なし）
└── tools/
    ├── eslint-config/    # 共有ESLint設定 ✅ 存在
    └── typescript-config/ # 共有TS設定 ✅ 存在
```

## 🚀 クイックスタート

### 初期セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動（全アプリケーション）
pnpm dev

# 本番ビルド
pnpm build
```

## 📦 パッケージ構成

| パッケージ                       | 説明                          | 技術スタック                                   |
| -------------------------------- | ----------------------------- | ---------------------------------------------- |
| **@ecommerce/web**               | Next.jsフロントエンドアプリ   | Next.js 15, React 19, TailwindCSS 4, Turbopack |
| **@ecommerce/core**              | ビジネスロジック・ドメイン層  | TypeScript, Zod, TSyringe (DI)                 |
| **@ecommerce/ui**                | Reactコンポーネントライブラリ | React 19, TypeScript                           |
| **@ecommerce/eslint-config**     | 共有ESLint設定                | ESLint 9                                       |
| **@ecommerce/typescript-config** | 共有TypeScript設定            | TypeScript 5                                   |

## 🛠️ 開発コマンド

### 全体操作

```bash
pnpm dev          # 全アプリの開発サーバー起動
pnpm build        # 全パッケージビルド
pnpm lint         # 全パッケージのLint実行
pnpm lint:fix     # Lint自動修正
pnpm test         # テスト実行
pnpm clean        # ビルド成果物削除
pnpm format       # Prettier実行
```

### 特定パッケージ操作

```bash
# Webアプリケーション
pnpm --filter @ecommerce/web dev
pnpm --filter @ecommerce/web build

# Core パッケージ
pnpm --filter @ecommerce/core build
pnpm --filter @ecommerce/core lint

# UI コンポーネント
pnpm --filter @ecommerce/ui build
pnpm --filter @ecommerce/ui dev
```

### 依存関係管理

```bash
# 特定ワークスペースに外部依存追加
pnpm --filter @ecommerce/web add lodash
pnpm --filter @ecommerce/ui add -D @types/react

# ワークスペース間依存追加
pnpm --filter @ecommerce/web add @ecommerce/core@workspace:*
```

## 🎯 主要機能

- **🏎️ 高速ビルド**: Turborepo + Turbopack での最適化されたビルドパイプライン
- **📚 モノレポ管理**: pnpm workspaces による効率的な依存関係管理
- **🔧 型安全性**: TypeScript Project References による段階的型チェック
- **🎨 モダンUI**: React 19 + TailwindCSS 4 による最新フロントエンド体験
- **🏛️ クリーンアーキテクチャ**: ドメイン駆動設計によるビジネスロジック分離

## 📋 品質管理

- **ESLint**: 統一されたコード品質基準
- **Prettier**: 一貫したコードフォーマット
- **Husky + lint-staged**: Git コミット時の自動品質チェック
- **TypeScript**: 静的型チェックによる堅牢性確保

## 🔗 関連ドキュメント

- **[開発ガイド](./docs/development/README.md)**: 開発環境設定・ツール詳細
- **[アーキテクチャドキュメント](./docs/architecture/README.md)**: システム設計・技術決定記録
- **[プロセスガイド](./docs/processes/README.md)**: 開発プロセス・ワークフロー

## 💡 技術選定理由

- **Turborepo**: モノレポの依存関係管理とキャッシュ最適化
- **pnpm**: 効率的なディスク使用量とworkspace機能
- **Next.js 15**: React Server Components、Turbopack対応
- **TypeScript 5**: 最新型システムによる開発者体験向上
- **TailwindCSS 4**: Zero-runtime CSS-in-JS とパフォーマンス最適化

---

**Node.js**: 20.x+ | **pnpm**: 8.6.0+ | **TypeScript**: 5.x
