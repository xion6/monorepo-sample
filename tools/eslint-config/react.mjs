import typescriptConfig from "./typescript.mjs";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

/**
 * React ESLint configuration for E-commerce Platform Monorepo
 *
 * typescript.mjs を継承し、React/JSX固有のルールを追加
 *
 * React 19 対応:
 * - 'react-in-jsx-scope'不要（自動JSX変換）
 * - Hooks exhaustive-deps の厳格チェック
 * - JSXフラグメントの最適化
 * - Context値の再生成防止
 *
 * 主な機能:
 * - JSXスタイルの統一（インデント、括弧位置、命名規則）
 * - Hooks使用ルールの強制
 * - パフォーマンス最適化（bind禁止、無駄なフラグメント検出）
 * - アクセシビリティ基礎（key属性、dangerouslySetInnerHTML警告）
 *
 * Prettierとの統合:
 * - JSXスタイルルール（indent, spacing等）はPrettierに委譲
 * - ESLintはロジック/品質ルールに専念
 *
 * @see https://react.dev/
 * @see https://github.com/jsx-eslint/eslint-plugin-react
 */
export default [
  ...typescriptConfig,
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // React rules
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/require-render-return": "error",
      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-key": [
        "error",
        {
          checkFragmentShorthand: true,
        },
      ],
      "react/jsx-no-bind": [
        "error",
        {
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      "react/jsx-no-constructed-context-values": "error",
      "react/jsx-no-leaked-render": "error",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import rules specific to React
      "import/no-anonymous-default-export": [
        "error",
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowCallExpression: true,
          allowLiteral: false,
          allowObject: false,
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
