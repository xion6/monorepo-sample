export default [
  // Clean Architecture dependency rules
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**'],
              message:
                '❌ Domain layer cannot import from Application layer (Clean Architecture violation)',
            },
            {
              group: ['**/port/**'],
              message:
                '❌ Domain layer cannot import from Port layer (Clean Architecture violation)',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/port/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**'],
              message:
                '❌ Port layer cannot import from Application layer (Clean Architecture violation)',
            },
          ],
        },
      ],
    },
  },
]