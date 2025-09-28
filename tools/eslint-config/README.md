# @ecommerce/eslint-config

E-commerce Platform Monorepo用の共有ESLint設定パッケージ。

## 概要

このパッケージは、モノレポ全体で一貫したコード品質基準を提供するESLint設定集です。JavaScript、TypeScript、Reactプロジェクト向けの設定を含みます。

## 提供される設定

### 基本設定 (`index.js`)

- JavaScript基本ルール
- コードスタイル統一
- ベストプラクティス

### TypeScript設定 (`typescript.js`)

- TypeScript固有ルール
- Import/Export最適化
- 型安全性強化

### React設定 (`react.js`)

- React/JSXルール
- Hooks検証
- コンポーネントベストプラクティス

## 使用方法

### インストール

```bash
# ワークスペースに追加
pnpm --filter your-package add @ecommerce/eslint-config@workspace:*

# 必要な peer dependencies のインストール
pnpm --filter your-package add -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks
```

### 設定例

#### JavaScript プロジェクト

```javascript
// eslint.config.mjs
import baseConfig from "@ecommerce/eslint-config";

export default [
  ...baseConfig,
  {
    // プロジェクト固有の設定
  },
];
```

#### TypeScript プロジェクト

```javascript
// eslint.config.mjs
import typescriptConfig from "@ecommerce/eslint-config/typescript.js";

export default [
  ...typescriptConfig,
  {
    // プロジェクト固有の設定
  },
];
```

#### React プロジェクト

```javascript
// eslint.config.mjs
import reactConfig from "@ecommerce/eslint-config/react.js";

export default [
  ...reactConfig,
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
