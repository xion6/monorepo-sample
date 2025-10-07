# Development Tool Configurations

このディレクトリには、モノレポ全体で共有される開発ツールの設定パッケージが含まれています。

## 📦 パッケージ一覧

### `eslint-config/`

**共有ESLint設定**

モノレポ全体で統一されたコード品質とスタイルルールを提供します。

- **パッケージ名**: `@ecommerce/eslint-config`
- **提供する設定**:
  - `index.mjs` - ベース設定
  - `react.mjs` - React専用ルール
  - `typescript.mjs` - TypeScript専用ルール
- **使用例**:
  ```js
  import baseConfig from "@ecommerce/eslint-config";
  import reactConfig from "@ecommerce/eslint-config/react";
  ```

### `typescript-config/`

**共有TypeScript設定**

プロジェクトタイプ別のTypeScriptコンパイラオプションを提供します。

- **パッケージ名**: `@ecommerce/typescript-config`
- **提供する設定**:
  - `base.json` - 共通ベース設定
  - `nextjs.json` - Next.js専用設定
  - `node.json` - Node.js専用設定
  - `react-library.json` - Reactライブラリ専用設定
- **使用例**:
  ```json
  {
    "extends": "@ecommerce/typescript-config/nextjs.json"
  }
  ```

## 🔧 使用方法

各パッケージは、対応するアプリケーションやパッケージの設定ファイルから参照されます。

### ESLint設定の適用

```js
// apps/web/eslint.config.mjs
import baseConfig from "@ecommerce/eslint-config";

export default [...baseConfig];
```

### TypeScript設定の適用

```json
// packages/core/tsconfig.json
{
  "extends": "@ecommerce/typescript-config/base.json",
  "compilerOptions": {
    // プロジェクト固有のオーバーライド
  }
}
```

## 📝 設定の追加・変更

1. 該当するパッケージディレクトリで設定を編集
2. 変更をコミット
3. 依存するパッケージで自動的に反映される（再インストール不要）

## 🎯 設計思想

- **DRY原則**: 設定の重複を排除
- **段階的採用**: プロジェクトごとに必要な設定のみを選択
- **拡張性**: ベース設定を継承し、プロジェクト固有のルールを追加可能
