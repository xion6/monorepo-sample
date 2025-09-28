# Pre-commit Hooks セットアップガイド

## 概要

HuskyとLint-stagedを使用してコミット時の自動リント・フォーマットを実装。

## 実装済み構成

### 依存関係

```json
{
  "devDependencies": {
    "husky": "^9.1.7",
    "lint-staged": "^16.2.1",
    "prettier": "^3.x"
  }
}
```

### Huskyセットアップ

```bash
# 初期化
npx husky init

# pre-commitフック設定
# .husky/pre-commit
npx lint-staged
```

### Lint-staged設定

```json
{
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

## 動作フロー

1. **ファイルステージング**: `git add` でファイルをステージング
2. **コミット実行**: `git commit` でコミット開始
3. **Pre-commitフック起動**: Huskyがlint-stagedを実行
4. **段階的処理**:
   - ESLintによる自動修正（TypeScript/JSファイル）
   - Prettierによるフォーマット（全対象ファイル）
5. **変更の自動ステージング**: 修正されたファイルを自動的にステージングエリアに追加
6. **コミット完了**: 全ての処理が成功した場合のみコミット実行

## メリット

- **一貫性**: チーム全体でコード品質の統一
- **自動化**: 手動でのlint実行を不要に
- **効率**: ステージングされたファイルのみを対象
- **品質保証**: 問題のあるコードのコミットを防止

## 運用上の注意点

- Pre-commitフックは `git commit --no-verify` で回避可能（非推奨）
- 大量のファイル変更時は処理時間が増加
- ESLintルール違反で自動修正できない場合はコミットが失敗
- フォーマット変更により意図しないdiffが発生する可能性

## トラブルシューティング

### よくある問題

#### 1. フックが実行されない

```bash
# 実行権限の確認・付与
chmod +x .husky/pre-commit

# Huskyの再初期化
npx husky init
```

#### 2. ESLintエラーでコミットが失敗

```bash
# 手動でESLintを実行して問題を確認
npx eslint src/ --fix

# どうしてもコミットしたい場合（非推奨）
git commit --no-verify -m "message"
```

#### 3. Prettierの設定競合

`.prettierrc.json` が存在し、ESLintとの設定が競合していないか確認。

### 設定確認コマンド

```bash
# 現在のフック設定確認
cat .husky/pre-commit

# lint-staged設定確認
npm run lint-staged --help

# 手動でlint-staged実行
npx lint-staged
```

## 今後の拡張予定

- **TypeScript型チェック**: `tsc --noEmit` の追加
- **テスト実行**: 関連テストの自動実行
- **コミットメッセージ検証**: conventional commitsの強制
- **ファイルサイズチェック**: 大容量ファイルの検出
