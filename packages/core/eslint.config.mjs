import typescriptConfig from '@ecommerce/eslint-config/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import preferArrowPlugin from 'eslint-plugin-prefer-arrow'

/**
 * ESLint configuration for @ecommerce/core (TypeScript Library)
 *
 * 共有設定 @ecommerce/eslint-config/typescript を使用し、
 * coreパッケージ固有のルール（アロー関数強制、関数スタイル）を追加
 */
export default [
  ...typescriptConfig,

  // Prettierとの競合回避
  eslintConfigPrettier,

  // coreパッケージ固有のルール
  {
    files: ['**/*.ts'],
    plugins: {
      'prefer-arrow': preferArrowPlugin,
    },
    rules: {
      // アロー関数の強制（coreパッケージの規約）
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
    },
  },

  // ビルド成果物・カバレッジの除外
  {
    ignores: ['dist/**', 'build/**', 'coverage/**'],
  },
]
