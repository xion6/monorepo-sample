import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Next.js specific rules
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    // Project-specific overrides
    rules: {
      // Next.js specific import rules
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'warn',

      // Adjust import rules for Next.js patterns
      'import/no-anonymous-default-export': [
        'error',
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowLiteral: false,
          allowObject: true, // Allow for Next.js config objects
        },
      ],

      // Allow dynamic imports for Next.js lazy loading
      'import/no-dynamic-require': 'off',

      // Customize import order to fit Next.js conventions
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: 'react**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@material-ui/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],

      // === Import Resolution ===
      'import/no-unresolved': [
        'error',
        {
          commonjs: true,
          caseSensitive: true,
        },
      ],
      'import/named': 'error', // 名前付きimportの存在確認
      'import/default': 'error', // デフォルトexportの存在確認
      'import/namespace': 'error', // namespaceimportの確認
      'import/no-absolute-path': 'error', // 絶対パスimportの禁止
      'import/no-self-import': 'error', // 自分自身のimportの禁止
      'import/no-cycle': [
        // 循環importの検出
        'error',
        {
          maxDepth: 10,
          ignoreExternal: true,
        },
      ],

      'import/no-useless-path-segments': 'error', // 無駄なパスセグメントの検出
    },
  },

  {
    // File-specific rules
    files: ['**/*.config.{js,mjs,ts}', '**/middleware.ts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'import/no-unused-modules': 'off',
    },
  },

  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '*.config.{js,mjs,ts}',
    ],
  },
]

export default eslintConfig
