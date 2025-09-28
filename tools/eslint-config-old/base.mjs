import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import { importPluginRules } from "./import-plugin-rules.mjs";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
    plugins: {
      import: pluginImport,
    },
    rules: {
      ...importPluginRules,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: [
            "./tsconfig.json",
            "packages/*/tsconfig.json",
            "apps/*/tsconfig.json",
          ],
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
  },
  prettierConfig,
];
