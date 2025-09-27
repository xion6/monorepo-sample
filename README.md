# 初期セットアップ
pnpm install

# 全アプリケーションの開発サーバー起動
pnpm dev

# 特定のアプリケーションのみ起動
pnpm --filter @ecommerce/web dev

# 全体のビルド
pnpm build

# 特定パッケージのビルド
pnpm --filter @ecommerce/core build

# 依存関係の追加（特定のワークスペースに）
pnpm --filter @ecommerce/web add lodash
pnpm --filter @ecommerce/ui add -D @types/react

# ワークスペース間の依存関係追加
pnpm --filter @ecommerce/web add @ecommerce/core@workspace:*