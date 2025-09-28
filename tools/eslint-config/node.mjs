import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: ["**/dist/**", "**/node_modules/**", "**/build/**"],
    plugins: {
      import: pluginImport,
    },
    rules: {
      // ✅ おすすめの基本ルールを適用
      ...pluginImport.configs.recommended.rules,

      // 🔧 好みに応じてルールをカスタマイズ
      "import/order": [
        // import文の順序をルール化
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
      // === Import Resolution ===
      "import/no-unresolved": [
        "error",
        {
          // TypeScript設定に基づく解決を有効化
          commonjs: true,
          caseSensitive: true,
          ignore: [
            // 外部ライブラリで解決できない場合の例外
            "^@?\\w",
          ],
        },
      ],
      "import/named": "error", // 名前付きimportの存在確認
      "import/default": "error", // デフォルトexportの存在確認
      "import/namespace": "error", // namespaceimportの確認
      "import/no-absolute-path": "error", // 絶対パスimportの禁止
      "import/no-self-import": "error", // 自分自身のimportの禁止
      "import/no-cycle": [
        // 循環importの検出
        "error",
        {
          maxDepth: 10,
          ignoreExternal: true,
        },
      ],
      "import/no-useless-path-segments": "error", // 無駄なパスセグメントの検出
    },
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      // Import resolution settings
      "import/resolver": {
        typescript: {
          // TypeScript設定ファイルのパス
          project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".ts"],
          moduleDirectory: ["node_modules", "src/"],
        },
      },
      "import/extensions": [".js", ".ts"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
    },
  },
  prettierConfig, // 最後にPrettierを適用してフォーマットの競合を防ぐ
];
