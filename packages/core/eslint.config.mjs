// import js from "@eslint/js"
// import typescriptEslint from '@typescript-eslint/eslint-plugin'
// import typescriptParser from '@typescript-eslint/parser'

// /**
//  * Minimal ESLint configuration for @ecommerce/core package
//  * Focused on essential code quality and TypeScript library best practices
//  */
// export default [
//   js.configs.recommended,
//   {
//     files: ['**/*.ts'],
//     languageOptions: {
//       parser: typescriptParser,
//       parserOptions: {
//         ecmaVersion: 2020,
//         sourceType: 'module',
//         project: './tsconfig.json',
//       },
//       globals: {
//         console: 'readonly',
//       },
//     },
//     plugins: {
//       '@typescript-eslint': typescriptEslint,
//     },
//     rules: {
//       // Basic quality rules
//       'no-unused-vars': 'off',
//       '@typescript-eslint/no-unused-vars': 'error',
//       '@typescript-eslint/no-explicit-any': 'warn',

//       // Clean Architecture support
//       '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

//       // Library quality essentials
//       '@typescript-eslint/no-floating-promises': 'error',
//     },
//   },
//   {
//     ignores: ['dist/', 'node_modules/', '*.d.ts'],
//   },
// ]
