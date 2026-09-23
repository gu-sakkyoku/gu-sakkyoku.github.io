# 開発・レビューガイド

この文書は、現役部員と将来の管理者が同じ手順で安全にサイトを更新するためのものです。

## 基本方針

- `main`は常にlintとbuildが成功する状態に保ちます。
- 通常の変更は作業ブランチからPull Requestにします。
- 一つのPull Requestには、一つの目的だけを含めます。
- 既存ページ、既存URL、既存デザインを理由なく変更しません。
- コードのコメントには「処理を読めば分かること」よりも「なぜこの実装が必要か」を書きます。
- 秘密情報と音源ファイルはGitHubへ置きません。

## ブランチ名

| 接頭辞 | 用途 | 例 |
| --- | --- | --- |
| `feat/` | 新機能 | `feat/download-page` |
| `fix/` | 不具合修正 | `fix/mobile-navigation` |
| `docs/` | 文書のみ | `docs/add-2027-guide` |
| `chore/` | 設定・保守 | `chore/github-pages` |
| `refactor/` | 動作を変えない整理 | `refactor/album-data` |

## Commitメッセージ

変更理由が履歴から分かるよう、短い英語の接頭辞と説明を使います。

```text
feat: add 2027 album metadata
fix: improve lyric link contrast
docs: explain annual release workflow
chore: add GitHub Pages workflow
```

秘密情報、ダウンロードコード、個人情報をCommitメッセージへ書かないでください。

## Pull Requestを作る前

次をローカルで実行します。

```bash
npm ci
npm run lint
npm run build
```

UIを変更した場合は、最低限次を確認します。

- スマートフォン幅
- PC幅
- キーボード操作
- focus表示
- 画像の代替テキスト
- 十分な文字コントラスト
- 既存歌詞ページへの移動

## Pull Requestのレビュー

レビューでは、主に次を確認します。

1. 変更目的と実装が一致しているか
2. 既存URLや既存ページを壊していないか
3. 同じデータが複数箇所へ重複していないか
4. Client Componentへ秘密情報を置いていないか
5. ZIPや音源がGitへ追加されていないか
6. エラー時に内部情報を利用者へ表示していないか
7. 共同管理者が後から理解できる説明があるか

## セキュリティに関する禁止事項

次のようなコードをcommitしてはいけません。

```ts
const DOWNLOAD_CODE = "実際の年度コード";
```

年度コードはCloudflare WorkerのSecretとして保管し、ブラウザから送られた値をサーバー側で検証します。また、R2の直接URLや書き込み権限を持つTokenをクライアントへ渡しません。

## 緊急修正

公開中の重大な不具合を直す場合も、可能な限り`fix/`ブランチとPull Requestを使います。やむを得ず通常手順を省略した場合は、後からIssueまたはPull Requestへ理由・確認内容・影響範囲を記録してください。
