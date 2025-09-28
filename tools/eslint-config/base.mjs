import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */
export default [
  // 1. 全てのファイルに適用されるグローバルな設定
  {
    // デフォルトでLintの対象外とするディレクトリやファイル
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/.next/**",
      "**/*.d.ts", // 型定義ファイルはLintの対象外
    ],
  },

  // 2. JavaScriptの基本的な推奨ルールを適用
  js.configs.recommended,

  // 3. TypeScriptの推奨ルールを適用（型チェックと連携する、より強力なルールセット）
  // これにより、例えば「string型の変数にnumberを代入しようとしている」といったエラーを検知できる
  ...tseslint.configs.recommendedTypeChecked,

  // 4. Reactの推奨ルールを適用
  {
    ...pluginReact.configs.flat.recommended,
    // .jsx, .tsx ファイルにのみReactのルールを適用
    files: ["**/*.{jsx,tsx}"],
    settings: {
      react: {
        // インストールされているReactのバージョンを自動検出
        version: "detect",
      },
    },
  },

  // 5. すべてのJS/TSファイルに適用される、より詳細なルール設定
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // プラグインの登録
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: pluginImport,
      react: pluginReact,
    },

    // 言語オプション
    languageOptions: {
      // パーサーとしてtypescript-eslintを指定
      parser: tseslint.parser,
      // 型情報を使ったLintを実行するために、tsconfig.jsonの場所をESLintに教える
      parserOptions: {
        project: true,
      },
      // 利用可能なグローバル変数を定義（ブラウザとNode.jsの両方を想定）
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    // 個別のルール設定
    rules: {
      // --- React --- //
      // React 17以降の新しいJSX Transformでは不要なためOFFにする
      "react/react-in-jsx-scope": "off",

      // --- TypeScript --- //
      // `type`のインポートを強制する。`import type { Hoge } from ...`
      "@typescript-eslint/consistent-type-imports": "error",

      // --- Import --- //
      // import文の順序をルール化し、自動でソートさせる (autofix対応)
      "import/order": [
        "error",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },

    // インポート解決の設定
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./tsconfig.json",
            "packages/*/tsconfig.json",
            "apps/*/tsconfig.json",
          ],
        },
      },
    },
  },

  // 6. Prettierとの競合ルールを無効化
  // 必ず最後に配置すること
  prettierConfig,
];
