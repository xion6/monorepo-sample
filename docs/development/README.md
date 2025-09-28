# 開発ガイド

E-commerce Platform Monorepoの開発環境設定とツール使用方法を説明します。

## 🚀 開発環境セットアップ

### システム要件

- **Node.js**: 20.x以上
- **pnpm**: 8.6.0以上（必須）
- **Git**: 最新版推奨
- **エディタ**: VSCode推奨（設定ファイル同梱）

### 初期セットアップ手順

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd monorepo-sample

# 2. 依存関係インストール
pnpm install

# 3. 開発サーバー起動
pnpm dev

# 4. 別ターミナルでビルド確認
pnpm build

# 5. コード品質チェック
pnpm lint
pnpm typecheck
```

## 🛠️ 開発ツール詳細

### Turborepo

モノレポ管理とタスク実行の最適化ツール

#### 設定ファイル: `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### 主要コマンド

```bash
# 全パッケージビルド（依存順序で実行）
pnpm build

# 特定パッケージのみビルド
pnpm --filter @ecommerce/core build

# 並列実行（依存関係を考慮）
turbo run build --parallel

# キャッシュクリア
turbo run clean
```

### pnpm Workspaces

効率的なパッケージ管理システム

#### 設定ファイル: `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tools/*"
```

#### ワークスペース操作

```bash
# 全ワークスペース情報表示
pnpm list --depth=0

# 特定ワークスペースでコマンド実行
pnpm --filter @ecommerce/web dev
pnpm --filter @ecommerce/core build

# 複数ワークスペース指定
pnpm --filter "@ecommerce/*" build

# ワークスペース間依存追加
pnpm --filter @ecommerce/web add @ecommerce/core@workspace:*

# 外部依存追加
pnpm --filter @ecommerce/web add lodash
pnpm --filter @ecommerce/ui add -D @types/react
```

### TypeScript Project References

段階的型チェックとビルド最適化

#### ルート`tsconfig.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  },
  "references": [
    { "path": "./apps/web" },
    { "path": "./packages/core" },
    { "path": "./packages/ui" }
  ]
}
```

#### パッケージ別設定

```json
// packages/core/tsconfig.json
{
  "extends": "@ecommerce/typescript-config/base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

## 🎨 コードスタイル・品質管理

### ESLint設定

統一されたコード品質基準

#### 共有設定: `tools/eslint-config/`

```javascript
// tools/eslint-config/index.js
module.exports = {
  extends: [
    "@eslint/js/recommended",
    "@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
  },
};
```

#### パッケージ別適用

```javascript
// apps/web/eslint.config.mjs
import baseConfig from "@ecommerce/eslint-config";
import nextConfig from "eslint-config-next";

export default [
  ...baseConfig,
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Next.js固有ルール
      "@next/next/no-img-element": "error",
    },
  },
];
```

#### Lint実行

```bash
# 全パッケージLint
pnpm lint

# 自動修正
pnpm lint:fix

# 特定パッケージのみ
pnpm --filter @ecommerce/web lint
```

### Prettier設定

一貫したコードフォーマット

#### 設定ファイル: `.prettierrc.json`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### フォーマット実行

```bash
# 全ファイルフォーマット
pnpm format

# チェックのみ（CI用）
pnpm format:check
```

### Husky + lint-staged

Git コミット時の自動品質チェック

#### 設定: `package.json`

```json
{
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
  }
}
```

#### pre-commitフック: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

## 📦 パッケージ開発詳細

### 新パッケージ作成手順

```bash
# 1. ディレクトリ作成
mkdir packages/new-package
cd packages/new-package

# 2. package.json作成
npm init -y

# 3. TypeScript設定
echo '{
  "extends": "@ecommerce/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}' > tsconfig.json

# 4. ソースディレクトリ作成
mkdir src
echo 'export * from "./main";' > src/index.ts

# 5. ルートのtsconfig.jsonに参照追加
```

### パッケージ間依存管理

```bash
# 内部パッケージ依存追加
pnpm --filter @ecommerce/web add @ecommerce/core@workspace:*

# package.jsonでの指定
{
  "dependencies": {
    "@ecommerce/core": "workspace:*"
  }
}

# 開発依存として追加
pnpm --filter @ecommerce/ui add -D @ecommerce/typescript-config@workspace:*
```

## 🔧 デバッグ・トラブルシューティング

### よくある問題と解決方法

#### 1. TypeScript型エラー

```bash
# 型チェック実行
pnpm typecheck

# 特定パッケージのみ
pnpm --filter @ecommerce/core typecheck

# ビルド実行で詳細確認
pnpm --filter @ecommerce/core build
```

#### 2. 依存関係の問題

```bash
# node_modules削除・再インストール
rm -rf node_modules
pnpm install

# lockファイル更新
rm pnpm-lock.yaml
pnpm install

# 特定パッケージの依存確認
pnpm list --filter @ecommerce/web
```

#### 3. Turboキャッシュ問題

```bash
# Turboキャッシュクリア
pnpm clean

# 完全リビルド
rm -rf .turbo
rm -rf apps/web/.next
rm -rf packages/*/dist
pnpm build
```

#### 4. ESLint/Prettier競合

```bash
# ESLint・Prettier設定チェック
pnpm lint --debug

# キャッシュクリア
rm -rf .eslintcache
pnpm lint
```

### デバッグ用コマンド

```bash
# 詳細ログ出力
DEBUG=* pnpm dev

# Turbo実行詳細
turbo run build --verbose

# pnpm詳細ログ
pnpm --loglevel=debug install

# TypeScript詳細診断
tsc --noEmit --listFiles
```

## 🚀 パフォーマンス最適化

### ビルド時間短縮

```bash
# 並列ビルド
turbo run build --parallel

# 増分ビルド（Project References活用）
tsc --build

# Turbopack使用（Next.js）
pnpm --filter @ecommerce/web dev
```

### 開発サーバー最適化

```bash
# 特定パッケージのみ起動
pnpm --filter @ecommerce/web dev

# watch modeを個別制御
pnpm --filter @ecommerce/core dev
pnpm --filter @ecommerce/ui dev
```

## 📋 VS Code設定

### 推奨拡張機能

- **TypeScript Importer**: 自動import補完
- **ESLint**: リアルタイムLint
- **Prettier**: 自動フォーマット
- **TypeScript Hero**: import整理
- **GitLens**: Git履歴表示

### ワークスペース設定: `.vscode/settings.json`

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.workspaceSymbols.scope": "allOpenProjects",
  "eslint.workingDirectories": ["apps/*", "packages/*"],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### タスク設定: `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "shell",
      "command": "pnpm dev",
      "group": "build",
      "isBackground": true
    },
    {
      "label": "build",
      "type": "shell",
      "command": "pnpm build",
      "group": "build"
    }
  ]
}
```

## 🔗 関連リソース

- **[Turborepo ドキュメント](https://turbo.build/repo/docs)**
- **[pnpm ワークスペース](https://pnpm.io/workspaces)**
- **[TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)**
- **[ESLint 設定ガイド](./eslint/eslint-configuration.md)**

---

開発中に問題が発生した場合は、まずこのガイドを参照し、解決しない場合はチームに相談してください。
