import prettierConfig from 'eslint-config-prettier'

import nextjsConfig from '@ecommerce/eslint-config/nextjs'

/**
 * ESLint configuration for @ecommerce/web (Next.js App)
 *
 * 共有設定 @ecommerce/eslint-config/nextjs を使用
 * プロジェクト固有のオーバーライドが必要な場合はここに追加
 */
export default [
  ...nextjsConfig,

  // プロジェクト固有のカスタマイズ（必要な場合のみ）
  {
    rules: {
      // 例: 特定のルールを緩和・強化したい場合
      // '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  prettierConfig,
]
