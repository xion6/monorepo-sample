import js from "@eslint/js";

/**
 * Base ESLint configuration for E-commerce Platform Monorepo
 *
 * ESLint v9 Flat Config 準拠
 * 全プロジェクトの共通基盤となる最小限のルールセット
 *
 * Prettierとの統合:
 * - スタイルルール(semi, comma-dangle等)はPrettierに委譲
 * - ESLintはロジック/品質ルールに専念
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */
export default [
  // ESLint推奨ルールを基盤として使用
  js.configs.recommended,

  {
    rules: {
      // === 変数管理 ===
      "no-unused-vars": "error", // 未使用変数の禁止
      "no-undef": "error", // 未定義変数の使用禁止
      "prefer-const": "error", // 再代入のない変数にはconstを強制
      "no-var": "error", // varの使用禁止（let/constを使用）

      // === コンソール出力 ===
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"], // warn/error/infoは許可
        },
      ],
      "no-debugger": "error", // debugger文の禁止（本番環境）

      // === import/export ===
      "no-duplicate-imports": "error", // 重複importの禁止

      // === 型安全性・比較演算 ===
      eqeqeq: ["error", "always"], // 厳密等価演算子（===, !==）の強制

      // === コードスタイル（Prettierと競合しないもののみ） ===
      curly: ["error", "all"], // if/for等のブロックに{}を強制

      // === Promise・非同期処理 ===
      "no-throw-literal": "error", // throw文でリテラルを投げることを禁止
      "prefer-promise-reject-errors": "error", // Promise.rejectはErrorオブジェクトを使用
      "no-return-await": "error", // 不要なreturn awaitの禁止
    },
  },
];
