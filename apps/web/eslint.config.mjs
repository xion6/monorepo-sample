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
