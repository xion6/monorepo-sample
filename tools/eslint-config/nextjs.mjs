import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import reactConfig from "./react.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Next.js ESLint configuration for E-commerce Platform Monorepo
 *
 * react.mjs を継承し、Next.js固有の最適化ルールを追加
 *
 * Next.js 15 対応:
 * - App Router / Pages Router 両対応
 * - Turbopack サポート
 * - 動的import最適化
 * - 画像最適化の強制
 *
 * 主な機能:
 * - next/core-web-vitals ルールの統合
 * - Next.js特有のimportパターン許可
 * - 設定ファイル・middleware の特別扱い
 * - ビルド成果物のignore設定
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint
 */
export default [
  ...reactConfig,

  // Next.js公式設定の統合
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // === Next.js特有のルール ===
      "@next/next/no-img-element": "error", // <img>の代わりにnext/imageを使用
      "@next/next/no-page-custom-font": "warn", // カスタムフォントの最適化推奨

      // === import/exportルールのNext.js向け調整 ===
      "import/no-anonymous-default-export": [
        "error",
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowLiteral: false,
          allowObject: true, // Next.js設定オブジェクトを許可
        },
      ],

      // 動的importの許可（Next.jsのコード分割最適化）
      "import/no-dynamic-require": "off",

      // import順序のNext.js向けカスタマイズ
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js組み込みモジュール
            "external", // 外部パッケージ
            "internal", // ワークスペースパッケージ
            "parent", // 親ディレクトリ
            "sibling", // 同階層ディレクトリ
            "index", // indexファイル
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "react**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "next**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@ecommerce/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
        },
      ],
    },
  },

  // 設定ファイル・middleware向けのルール緩和
  {
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/middleware.ts",
      "**/instrumentation.ts",
    ],
    rules: {
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // チェック除外設定
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      ".turbo/**",
    ],
  },
];
