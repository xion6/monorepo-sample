import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import preferArrowPlugin from 'eslint-plugin-prefer-arrow'

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
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },

    /**
     * 使用するプラグイン一覧
     */
    plugins: {
      import: importPlugin, // import/export 構文の検証
      '@typescript-eslint': tseslint, // TypeScript 専用ルール
      'prefer-arrow': preferArrowPlugin, // コールバックをアロー関数で書くことを強制
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
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
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
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.warn/errorは許可

      /**
       * コールバック関数をアロー関数で書くことを強制
       */
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          // オプション: falseにすると、名前のない関数式(function() {})は許可される
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      // (補足) ESLintコアのルールも併用するとより良い
      'prefer-arrow-callback': 'error', // コールバック関数にアロー関数を強制
      'func-style': ['error', 'expression'], // 関数宣言(function foo() {})を禁止

      /**
       * Promise の完了を待たない場合はエラーにする
       * @see https://typescript-eslint.io/rules/no-floating-promises
       */
      '@typescript-eslint/no-floating-promises': 'error',

      /**
       * 非同期関数のコールバックで Promise を返す場合はエラーにする
       * @see https://typescript-eslint.io/rules/no-misused-promises
       *
       * MEMO: async/await を正しく使用しないと、Promise が解決される前に次の処理が実行される可能性があるため、このルールを有効化してミスを防止する
       */
      '@typescript-eslint/no-misused-promises': 'error',

      /**
       * == や != の代わりに === や !== を使用することを強制
       * @see https://eslint.org/docs/latest/rules/eqeqeq
       *
       * MEMO: 型の自動変換による予期せぬ動作を防止するため、常に厳密な比較を使用することを推奨
       */
      eqeqeq: ['error', 'always'],

      /**
       * const 宣言を可能な限り使用することを強制
       * @see https://eslint.org/docs/latest/rules/prefer-const
       *
       * MEMO: 変数の再代入がない場合は const を使用することで、コードの意図を明確にし、予期せぬ再代入によるバグを防止できるため
       */
      'prefer-const': 'error',

      /**
       * オブジェクトのプロパティアクセスにおいて、可能な場合はオプショナルチェイニングを使用することを推奨
       * @see https://typescript-eslint.io/rules/prefer-optional-chain
       *
       * MEMO: ネストされたオブジェクトのプロパティにアクセスする際に、オプショナルチェイニングを使用することで、コードが簡潔になり、nullチェックを手動で行う必要がなくなるため
       */
      '@typescript-eslint/prefer-optional-chain': 'warn',

      /**
       * nullish coalescing 演算子 (??) の使用を推奨
       * @see https://typescript-eslint.io/rules/prefer-nullish-coalescing
       *
       * MEMO: nullish coalescing 演算子を使用することで、null または undefined の場合にのみデフォルト値を提供でき、意図しない falsy 値 (例えば、0 や空文字列) に対して誤ってデフォルト値が適用されるのを防止できるため
       */
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',

      /**
       * 命名規則の強制
       * @see https://typescript-eslint.io/rules/naming-convention
       *
       * MEMO: 一貫した命名規則を使用することで、コードの可読性と保守性が向上するため
       */
      '@typescript-eslint/naming-convention': [
        'error',
        // { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has'],
        },
      ],
    },
  },
]
