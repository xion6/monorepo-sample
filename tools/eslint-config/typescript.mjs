import baseConfig from "./index.mjs";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

/**
 * TypeScript-specific ESLint configuration
 * Extends base config with TypeScript and import rules
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
