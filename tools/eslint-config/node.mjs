import baseConfig from "./base.mjs";
import globals from "globals";

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const nodeConfig = baseConfig
  // 1. React用の設定を除外する
  //    `settings.react` を持つ設定オブジェクトを除外することで、
  //    `pluginReact.configs.flat.recommended` の設定を削除する
  .filter((config) => !config.settings?.react)
  // 2. メインの設定オブジェクトをNode.js用に調整する
  .map((config) => {
    // `plugins.react` を持つオブジェクトがメインの設定と判断
    if (config.plugins?.react) {
      // 元の設定を破壊しないように新しいオブジェクトを作成
      const newConfig = { ...config };

      // Reactプラグインを削除
      const { react, ...otherPlugins } = newConfig.plugins;
      newConfig.plugins = otherPlugins;

      // ブラウザ用のグローバル変数を削除し、Node.js用のみにする
      newConfig.languageOptions = {
        ...newConfig.languageOptions,
        globals: {
          ...globals.node,
        },
      };

      // React用のルールを削除
      const { "react/react-in-jsx-scope": reactRule, ...otherRules } =
        newConfig.rules;
      newConfig.rules = otherRules;

      return newConfig;
    }
    return config;
  });

/**
 * Node.jsプロジェクト向けのESLint設定
 *
 * `base.mjs` の設定をベースに、Reactやブラウザ関連の項目を除外しています。
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default nodeConfig;
