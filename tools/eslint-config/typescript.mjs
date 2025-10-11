import baseConfig from "./base.mjs";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

/**
 * TypeScript ESLint configuration for E-commerce Platform Monorepo
 *
 * base.mjs を継承し、TypeScript固有のルールを追加
 *
 * 主な機能:
 * - 型安全性の強化（any禁止、Promise処理の安全性）
 * - import/export管理（順序、循環参照検出、型import分離）
 * - 命名規則の統一（boolean変数、interface、type）
 * - 関数戻り値型の明示
 *
 * @see https://typescript-eslint.io/
 */
export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    rules: {
      // Disable base rules that are covered by TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // === Promise・非同期処理の型安全性 ===
      "@typescript-eslint/no-floating-promises": "error",  // 未処理のPromiseを禁止
      "@typescript-eslint/no-misused-promises": "error",   // Promiseの誤用を防止
      "@typescript-eslint/await-thenable": "error",        // awaitは必ずPromiseに対してのみ使用

      // === 関数の戻り値型の明示 ===
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,              // 式として使用される関数は型推論を許可
          allowTypedFunctionExpressions: true, // 型注釈のある関数式は省略可
          allowHigherOrderFunctions: true,     // 高階関数は型推論を許可
        },
      ],

      // === 命名規則 ===
      "@typescript-eslint/naming-convention": [
        "error",
        // boolean変数はis/has/shouldで始まる
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "has", "should", "can", "will", "did"],
        },
        // インターフェース名はPascalCase（接頭辞Iは不要）
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        // 型エイリアス名はPascalCase
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
      ],

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js builtin modules
            "external", // External packages
            "internal", // Internal packages (workspace packages)
            "parent", // Parent directory imports
            "sibling", // Sibling directory imports
            "index", // Index file imports
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "@ecommerce/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/no-unresolved": "error",
      // Note: import/no-unused-modules disabled due to flat config compatibility issues
      // 'import/no-unused-modules': [
      //   'error',
      //   {
      //     unusedExports: true,
      //     ignoreExports: [
      //       '**/*.config.{js,ts,mjs}',
      //       '**/*.d.ts',
      //       '**/index.{js,ts}',
      //     ],
      //   },
      // ],
      "import/no-cycle": "error",
      "import/no-self-import": "error",
      "import/no-duplicate-imports": "off", // Handled by @typescript-eslint
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-absolute-path": "error",
      "import/no-useless-path-segments": [
        "error",
        {
          noUselessIndex: true,
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json", "*/tsconfig.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
  },
];
