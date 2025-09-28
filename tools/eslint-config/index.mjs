import js from "@eslint/js";

/**
 * Base ESLint configuration for E-commerce Platform Monorepo
 * Provides common rules for JavaScript/TypeScript projects
 */
export default [
  js.configs.recommended,
  {
    rules: {
      // General JavaScript rules
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Import/Export rules (basic)
      "no-duplicate-imports": "error",

      // Code style
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-trailing-spaces": "error",
      "comma-dangle": ["error", "always-multiline"],
      semi: ["error", "always"],

      // Best practices
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",
      "no-return-await": "error",
    },
  },
];
