import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
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
      "import/no-unresolved": "off", // TypeScriptでは不要なためオフにすることが多い
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettierConfig, // 最後にPrettierを適用してフォーマットの競合を防ぐ
];
