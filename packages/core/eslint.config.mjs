import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

/**
 * ESLint 設定ファイル
 *
 * MEMO: 記述の簡略化のため、defineConfig() を使用せず配列を直接エクスポートしている
 */
export default [
  /**
   * チェック無視対象のグローバル設定
   * @see https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
   */
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  /**
   * Prettier と競合する ESLint ルールを無効化
   * @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#eslintconfigjs-flat-config-plugin-caveat
   */
  eslintConfigPrettier,

  /**
   * メインの ESLint 設定（TS/JS 共通）
   */
  {
    /**
     * チェック対象のファイルパターンのグローバル設定。TypeScript と JavaScript の両方を対象とする
     * @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores
     */
    files: ['**/*.ts', '**/*.js'], // 必要に応じて jsx や tsx を追加

    /**
     * ESLint のパーサーを typescript-eslint を使用して TypeScript 用に設定
     * @see https://eslint.org/docs/latest/extend/custom-parsers#packaging-a-custom-parser
     */
    languageOptions: {
      parser: tsParser,
    },

    /**
     * 使用するプラグイン一覧
     */
    plugins: {
      import: importPlugin, // import/export 構文の検証
      '@typescript-eslint': tseslint, // TypeScript 専用ルール
    },

    /**
     * 各ルールの設定
     */
    rules: {
      /**
       * import 文をアルファベット順にソート
       * @see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#alphabetize
       */
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
        },
      ],

      /**
       * 未使用の変数／引数をエラーに
       * @see https://typescript-eslint.io/rules/no-unused-vars/#how-to-use
       *
       * MEMO: ESLint のデフォルトルールは enum などの特定のケースで誤検出することがあるため、@typescript-eslint のルールを使用
       */
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off', // デフォルトルールは競合回避のため無効化

      /**
       * コールバックを必ずアロー関数で書く
       * @see https://eslint.org/docs/latest/rules/prefer-arrow-callback
       */
      'prefer-arrow-callback': 'error',
    },
  },
]
