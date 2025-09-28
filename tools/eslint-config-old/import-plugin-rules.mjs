import pluginImport from "eslint-plugin-import";

/**
 * @type {import('eslint').Linter.RulesRecord}
 */
export const importPluginRules = {
  // ✅ おすすめの基本ルールを適用
  ...pluginImport.configs.recommended.rules,

  // 🔧 好みに応じてルールをカスタマイズ
  "import/order": [
    // import文の順序をルール化
    "error",
    {
      groups: [
        "type",
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index",
        "object",
      ],
      "newlines-between": "always",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],
  // === Import Resolution ===
  // 'ignore'オプションを削除し、TypeScript Resolverに解決を委ねることで、
  // モノレポ内のパッケージ解決をより厳密にチェックします。
  "import/no-unresolved": [
    "error",
    {
      commonjs: true,
      caseSensitive: true,
    },
  ],
  "import/named": "error", // 名前付きimportの存在確認
  "import/default": "error", // デフォルトexportの存在確認
  "import/namespace": "error", // namespaceimportの確認
  "import/no-absolute-path": "error", // 絶対パスimportの禁止
  "import/no-self-import": "error", // 自分自身のimportの禁止
  "import/no-cycle": [
    // 循環importの検出
    "error",
    {
      maxDepth: 10,
      ignoreExternal: true,
    },
  ],
  "import/no-useless-path-segments": "error", // 無駄なパスセグメントの検出
};
