import js from "@eslint/js";

/**
 * Root ESLint configuration for lint-staged
 *
 * モノレポのルートディレクトリ用の最小限の設定
 * lint-stagedから実行されるESLintがこの設定を使用します
 */
export default [
  js.configs.recommended,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
    },
  },
];
