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
    ignores: ['dist/**', 'build/**', 'coverage/**'],
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
     * チェック対象のファイルパターンのグローバル設定。TypeScript を対象とする
     * @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores
     */
    files: ['**/*.ts'], // 必要に応じて jsx や tsx を追加

    /**
     * ESLint のパーサーを typescript-eslint を使用して TypeScript 用に設定
     * @see https://eslint.org/docs/latest/extend/custom-parsers#packaging-a-custom-parser
     */
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
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
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'object',
            'type',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
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

      /**
       * import 文で型のみをインポートする場合は type-imports を使用する
       * @see https://typescript-eslint.io/rules/consistent-type-imports
       */
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      /**
       * any 型の使用を禁止
       * @see https://typescript-eslint.io/rules/no-explicit-any
       */
      '@typescript-eslint/no-explicit-any': 'error',

      /**
       * 関数の戻り値の型を必ず明示的に指定する
       * @see https://typescript-eslint.io/rules/explicit-function-return-type
       */
      '@typescript-eslint/explicit-function-return-type': 'error',

      /**
       * console.log の使用を警告
       * @see https://eslint.org/docs/latest/rules/no-console
       *
       * MEMO: 開発中のデバッグ用途で console.log を使うことがあるため、エラーではなく警告に設定
       */
      'no-console': 'warn',
    },
  },
]
