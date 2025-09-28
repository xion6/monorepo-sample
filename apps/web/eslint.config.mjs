import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignores: ['node_modules', 'dist', '.next', 'out', 'build'],
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'eslint:recommended',
      'plugin:@next/next/recommended',
      'turbo',
      'prettier',
    ],
    plugins: ['@typescript-eslint', 'unused-imports'],
    rules: {
      // ここにプロジェクト固有のルールを追加できます
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'parent',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'never',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'unused-imports/no-unused-imports': 'error',
    },
    // Next.jsのルートディレクトリを指定
    settings: {
      next: {
        rootDir: '.',
      },
    },
  }),
]

export default eslintConfig
