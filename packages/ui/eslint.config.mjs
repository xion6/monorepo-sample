import reactConfig from "@ecommerce/eslint-config/react";
import prettierConfig from "eslint-config-prettier";

/**
 * ESLint configuration for @ecommerce/ui (React Component Library)
 *
 * 共有設定 @ecommerce/eslint-config/react を使用
 * Reactコンポーネントライブラリ向けの設定
 */
export default [
  ...reactConfig,

  // プロジェクト固有のカスタマイズ（必要な場合のみ）
  {
    rules: {
      // 例: UIライブラリ特有のルール調整
    },
  },

  // ビルド成果物の除外
  {
    ignores: ["dist/**", "build/**"],
  },

  prettierConfig,
];
