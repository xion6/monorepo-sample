# Claude Documentation Repository

プロジェクトのアーキテクチャ、開発プロセス、ツール設定に関する包括的なドキュメントです。

## 📁 ドキュメント構造

### 🏗️ Architecture - アーキテクチャ

システム設計、アーキテクチャパターン、設計決定に関するドキュメント

#### 📋 Guides - 設計ガイド

- **[ヘキサゴナルアーキテクチャ設計ガイド](./architecture/guides/hexagonal-architecture-guide.md)**
  - レイヤー構成と責務
  - 実装ガイドライン
  - テスト戦略
  - ベストプラクティス

#### 🎯 Decisions - アーキテクチャ決定記録（ADR）

- **[ADR-001: ヘキサゴナルアーキテクチャの採用](./architecture/decisions/adr-001-hexagonal-architecture.md)**
  - 採用背景と理由
  - 技術選択の根拠
  - 期待効果と影響評価

### 🛠️ Development - 開発環境・ツール

開発効率、コード品質、チーム協業に関するツールとプロセス

#### 🔍 ESLint - コード品質管理

- **[ESLint設定アーキテクチャ・運用ガイド](./development/eslint/eslint-configuration.md)**
  - 設定構造と階層化
  - Monorepo対応
  - Clean Architecture制約
  - 運用プロセス

#### ⚙️ Tooling - その他ツール

_今後追加予定_

- TypeScript設定
- テストフレームワーク設定
- ビルドツール設定

### 📋 Processes - 開発プロセス

_今後追加予定_

- コードレビュープロセス
- リリースプロセス
- 品質保証プロセス

## 🎯 ドキュメント利用ガイド

### 新メンバー向け

1. **[ヘキサゴナルアーキテクチャ設計ガイド](./architecture/guides/hexagonal-architecture-guide.md)** でシステム設計を理解
2. **[ESLint設定ガイド](./development/eslint/eslint-configuration.md)** で開発環境を把握
3. ADRで設計決定の背景を理解

### 機能開発時

1. **アーキテクチャガイド** で設計パターンを確認
2. **ESLintルール** で依存関係制約を遵守
3. 必要に応じて新しいADRを作成

### 設定変更時

1. **該当ツールのドキュメント** で現在の構成を確認
2. 変更内容と影響範囲を文書化
3. チーム内での合意形成

## 📝 ドキュメント更新ルール

### 更新タイミング

- 新機能追加時: アーキテクチャガイドの更新
- 技術選択変更時: 新しいADRの作成
- ツール設定変更時: 設定ガイドの更新

### 更新手順

1. 既存ドキュメントの影響範囲確認
2. 関連ドキュメントの一括更新
3. チームレビューによる品質確保

### 文書品質基準

- **実用性**: 実際の開発で参照できる具体性
- **正確性**: 現在のコードベースとの一致
- **保守性**: 定期的な更新とメンテナンス

## 🔗 関連リソース

### プロジェクト内

- [プロジェクトルート README](../README.md)
- [ESLint設定ファイル](../tools/eslint-config/)
- [Core Package](../packages/core/)

### 外部参考資料

- [Hexagonal Architecture by Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [ESLint Documentation](https://eslint.org/docs/)

---

**最終更新**: 2025年1月
**管理者**: Claude Code AI
