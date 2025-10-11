# @ecommerce/eslint-config

E-commerce Platform Monorepo用の共有ESLint設定パッケージ。

## 概要

このパッケージは、モノレポ全体で一貫したコード品質基準を提供するESLint設定集です。
ESLint v9 Flat Config 準拠で、階層型の設定アーキテクチャにより柔軟な適用が可能です。

## 提供される設定

### 基本設定 (`base.mjs`)

**対象**: 全プロジェクト共通
**継承**: なし

- JavaScript基本ルール
- 変数管理（const/let優先、var禁止）
- コンソール出力管理
- Promise・非同期処理の基本ルール

### TypeScript設定 (`typescript.mjs`)

**対象**: TypeScriptプロジェクト
**継承**: `base.mjs`

- 型安全性の強化（any禁止、Promise処理の安全性）
- import/export管理（順序、循環参照検出、型import分離）
- 命名規則の統一（boolean変数、interface、type）
- 関数戻り値型の明示

### React設定 (`react.mjs`)

**対象**: Reactプロジェクト
**継承**: `typescript.mjs`

- React 19 対応
- JSXスタイルの統一
- Hooks exhaustive-deps の厳格チェック
- パフォーマンス最適化（bind禁止、無駄なフラグメント検出）
- アクセシビリティ基礎

### Next.js設定 (`nextjs.mjs`)

**対象**: Next.jsアプリケーション
**継承**: `react.mjs`

- Next.js 15 対応（App Router / Pages Router 両対応）
- next/core-web-vitals ルールの統合
- 動的import最適化
- 画像最適化の強制
- Next.js特有のimportパターン許可

## 使用方法

### インストール

```bash
# ワークスペースに追加
pnpm --filter your-package add -D @ecommerce/eslint-config@workspace:*

# 必要な peer dependencies のインストール（プロジェクトタイプに応じて）
# TypeScriptプロジェクトの場合
pnpm --filter your-package add -D \
  eslint@^9.0.0 \
  @typescript-eslint/eslint-plugin@^8.0.0 \
  @typescript-eslint/parser@^8.0.0 \
  eslint-import-resolver-typescript@^3.6.0 \
  eslint-plugin-import@^2.29.0

# Reactプロジェクトの場合（上記に加えて）
pnpm --filter your-package add -D \
  eslint-plugin-react@^7.34.0 \
  eslint-plugin-react-hooks@^5.0.0

# Next.jsプロジェクトの場合（上記に加えて）
pnpm --filter your-package add -D \
  @eslint/eslintrc@^3.0.0 \
  eslint-config-next@^15.0.0
```

### 設定例

#### JavaScript/基本プロジェクト

```javascript
// eslint.config.mjs
import baseConfig from "@ecommerce/eslint-config/base";

export default [
  ...baseConfig,
  {
    // プロジェクト固有の設定
  },
];
```

#### TypeScript ライブラリ

```javascript
// eslint.config.mjs
import typescriptConfig from "@ecommerce/eslint-config/typescript";

export default [
  ...typescriptConfig,
  {
    // プロジェクト固有の設定
    rules: {
      // 例: 特定のルールを調整
    },
  },
];
```

#### React コンポーネントライブラリ

```javascript
// eslint.config.mjs
import reactConfig from "@ecommerce/eslint-config/react";

export default [
  ...reactConfig,
  {
    // プロジェクト固有の設定
  },
  {
    ignores: ["dist/**", "build/**"],
  },
];
```

#### Next.js アプリケーション

```javascript
// eslint.config.mjs
import nextjsConfig from "@ecommerce/eslint-config/nextjs";

export default [
  ...nextjsConfig,
  {
    // プロジェクト固有の設定
  },
];
```

## Import ルール詳細

### Import 順序

```javascript
// 1. Node.js builtin modules
import fs from "fs";
import path from "path";

// 2. External packages
import React from "react";
import { z } from "zod";

// 3. Internal packages (@ecommerce/*)
import { Button } from "@ecommerce/ui";
import { ProductService } from "@ecommerce/core";

// 4. Relative imports
import { helper } from "../utils/helper";
import { Component } from "./Component";
```

### TypeScript Import Types

```typescript
// ✅ Correct - type-only imports
import type { User } from "./types";
import type { ComponentProps } from "react";

// ❌ Incorrect - mixed imports
import { User, createUser } from "./types";
```

### 禁止される Import パターン

```typescript
// ❌ Circular imports
import { A } from "./a"; // if ./a imports from this file

// ❌ Unresolved imports
import { Missing } from "./non-existent-file";

// ❌ Absolute paths
import { Component } from "/src/components/Component";

// ❌ Useless path segments
import { utils } from "../utils/index";
```

## 設定可能なルール

### severity levels

- `error`: CIで失敗、マージブロック
- `warn`: 警告表示、マージ可能
- `off`: ルール無効

### 主要なImportルール

| ルール                                       | 説明                     | Severity |
| -------------------------------------------- | ------------------------ | -------- |
| `import/order`                               | Import文の順序統一       | error    |
| `import/no-unresolved`                       | 解決できないimportの検出 | error    |
| `import/no-cycle`                            | 循環依存の検出           | error    |
| `import/no-unused-modules`                   | 未使用moduleの検出       | error    |
| `@typescript-eslint/consistent-type-imports` | 型importの統一           | error    |

## カスタマイズ

プロジェクト固有のルールが必要な場合：

```javascript
// eslint.config.mjs
import reactConfig from "@ecommerce/eslint-config/react.js";

export default [
  ...reactConfig,
  {
    rules: {
      // プロジェクト固有のルール
      "import/no-unused-modules": "warn", // severity変更
      "react/jsx-max-props-per-line": "off", // ルール無効化
    },
  },
];
```

## トラブルシューティング

### Import解決エラー

```bash
# TypeScript設定の確認
pnpm tsc --noEmit

# ESLint import resolver設定確認
pnpm eslint --debug your-file.ts
```

### パフォーマンス問題

```javascript
// 大きなプロジェクトでは対象ファイルを制限
{
  files: ['src/**/*.{ts,tsx}'],
  ignores: ['node_modules/**', 'dist/**'],
}
```

## 関連リンク

- [ESLint Documentation](https://eslint.org/docs/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
