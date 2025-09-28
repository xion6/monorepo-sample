# ESLint設定アーキテクチャ・運用ガイド

## 設定アーキテクチャ

### 設計思想

Monorepo全体で一貫したESLint設定を提供しつつ、各プロジェクトの特性に応じた柔軟性を確保する階層化アーキテクチャを採用。

### 階層構造

```
tools/eslint-config/               # 共通設定パッケージ
├── base.mjs                      # 基本設定（TypeScript + React）
├── clean-architecture.mjs        # アーキテクチャ制約
└── next.mjs                      # Next.js専用設定

apps/web/eslint.config.mjs        # フロントエンド固有設定
packages/core/eslint.config.mjs   # ビジネスロジック固有設定
```

## 設定パッケージ構造

### @ecommerce/eslint-config パッケージ設計

#### Import Error Detection - Import エラー検出

ESLintでimportエラーを自動検出する設定を有効化：

```javascript
// tools/eslint-config/base.mjs
{
  rules: {
    // === Import Resolution ===
    "import/no-unresolved": ["error", {
      "commonjs": true,
      "caseSensitive": true,
      "ignore": ["^@?\\w"],  // 外部ライブラリの例外
    }],
    "import/named": "error",           // 名前付きimportの存在確認
    "import/default": "error",         // デフォルトexportの存在確認
    "import/namespace": "error",       // namespaceimportの確認
    "import/no-absolute-path": "error", // 絶対パスimportの禁止
    "import/no-self-import": "error",   // 自分自身のimportの禁止
    "import/no-cycle": ["error", {      // 循環importの検出
      "maxDepth": 10,
      "ignoreExternal": true,
    }],
    "import/no-useless-path-segments": "error", // 無駄なパスセグメント検出
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
        alwaysTryTypes: true,
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
}
```

**検出されるエラー例:**

- `Unable to resolve path to module './non-existent-file'` - 存在しないファイル
- `ProductEntity not found in './Product'` - 存在しないnamed export
- `import/no-cycle` - 循環import依存関係

**依存関係:**

```json
{
  "dependencies": {
    "eslint-import-resolver-typescript": "^3.6.1"
  }
}
```

#### package.json エクスポート戦略

```json
{
  "name": "@ecommerce/eslint-config",
  "type": "module",
  "exports": {
    "./base": "./base.mjs",
    "./clean-architecture": "./clean-architecture.mjs",
    "./next": "./next.mjs"
  }
}
```

**設計原則:**

- モジュラー設計：機能ごとに分離された設定
- 組み合わせ自由：必要な設定のみを選択して使用
- 拡張性：新しい設定の追加が容易

### 設定ファイル詳細

#### base.mjs - 基盤設定

```javascript
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { import: pluginImport },
    rules: {
      // TypeScript厳格設定
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",

      // React最適化
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Import順序の標準化
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
];
```

**適用対象:** すべてのTypeScript + Reactプロジェクト
**目的:** コード品質の基盤となるルールセット

#### clean-architecture.mjs - アーキテクチャ制約

```javascript
export default [
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/domain",
              from: ["./src/application", "./src/infrastructure", "./src/port"],
            },
          ],
        },
      ],
    },
  },
];
```

**適用対象:** packages/core（ビジネスロジック層）
**目的:** ドメイン層の独立性を保証し、依存関係の逆転を防止

#### next.mjs - フレームワーク固有設定

```javascript
import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [...compat.extends("next/core-web-vitals", "next/typescript")];
```

**適用対象:** apps/web（Next.jsアプリケーション）
**目的:** Next.js固有のルールとパフォーマンス最適化

## プロジェクト固有設定

### apps/web の設定戦略

```javascript
import nextConfig from "@ecommerce/eslint-config/next";

export default [
  ...nextConfig,
  {
    // プロジェクト固有のオーバーライド
    rules: {
      // 必要に応じてカスタマイズ
    },
  },
];
```

### packages/core の設定戦略

```javascript
import baseConfig from "@ecommerce/eslint-config/base";
import cleanArchitectureConfig from "@ecommerce/eslint-config/clean-architecture";

export default [
  ...baseConfig,
  ...cleanArchitectureConfig,
  {
    // ビジネスロジック固有のルール
    rules: {
      // 必要に応じてカスタマイズ
    },
  },
];
```

## 運用プロセス

### 日常的なメンテナンス

#### 1. ルール変更の影響範囲管理

```bash
# 変更前：影響範囲の確認
pnpm --filter @ecommerce/web lint
pnpm --filter @ecommerce/core lint

# 変更後：検証
pnpm --filter @ecommerce/web lint
pnpm --filter @ecommerce/core lint
```

#### 2. 段階的ルール導入プロセス

1. **Warning段階**: 新ルールを`"warn"`で導入
2. **監視期間**: 1-2週間のチーム適応期間
3. **Error昇格**: 問題がなければ`"error"`に変更

### 新プロジェクト追加時の手順

#### フロントエンドプロジェクト

```bash
# 1. ESLint設定ファイル作成
cat > eslint.config.mjs << 'EOF'
import nextConfig from '@ecommerce/eslint-config/next'
export default [...nextConfig]
EOF

# 2. package.json依存関係追加
pnpm add -D @ecommerce/eslint-config eslint
```

#### バックエンド/ライブラリプロジェクト

```bash
# 1. ESLint設定ファイル作成
cat > eslint.config.mjs << 'EOF'
import baseConfig from '@ecommerce/eslint-config/base'
export default [...baseConfig]
EOF

# 2. アーキテクチャ制約が必要な場合
import cleanArchitectureConfig from '@ecommerce/eslint-config/clean-architecture'
export default [...baseConfig, ...cleanArchitectureConfig]
```

### 設定更新の検証プロセス

#### 1. 共通設定更新時

```bash
# tools/eslint-configで変更後
cd tools/eslint-config
pnpm build  # 必要に応じて

# 全プロジェクトでの動作確認
cd ../../
pnpm lint  # 全プロジェクトのlint実行
```

#### 2. 新ルール追加時のチェックリスト

- [ ] 既存コードでのエラー発生確認
- [ ] 自動修正可能なルールかの確認
- [ ] チーム内での合意形成
- [ ] ドキュメント更新

### トラブルシューティング

#### よくある問題と対処法

**問題1: プラグイン競合エラー**

```
Error: Cannot redefine plugin "import"
```

**対処法**: 設定の組み合わせを見直し、プラグインの重複を避ける

**問題2: Flat Config互換性エラー**

```
Error: "extends" key not supported in flat config
```

**対処法**: FlatCompatを使用してlegacy設定を移行

**問題3: モジュール解決エラー**

```
Cannot find module '@ecommerce/eslint-config/base'
```

**対処法**: package.jsonのexports設定とファイルパスを確認

### パフォーマンス最適化

#### Linting速度向上のベストプラクティス

- 必要最小限のルールセットを使用
- ファイルパターンの最適化
- キャッシュの活用（`--cache`オプション）
- 並列実行の活用（pnpmのworkspace機能）

### 今後の拡張計画

#### 想定される追加設定

- `testing.mjs`: Jest/Vitest固有のテスト設定
- `accessibility.mjs`: アクセシビリティルール
- `performance.mjs`: パフォーマンス関連ルール
- `security.mjs`: セキュリティ関連ルール

#### 設定の進化戦略

1. **段階的拡張**: 必要に応じて新しい設定モジュールを追加
2. **後方互換性**: 既存の設定を破壊しない変更方針
3. **チーム合意**: 新ルール導入時の合意形成プロセス
