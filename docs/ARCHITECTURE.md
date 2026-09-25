# サイト構成と責任範囲

## このリポジトリの役割

`gu-sakkyoku/gu-sakkyoku.github.io`は、群馬大学作曲部の新しい公式サイトを管理するリポジトリです。2026年以降のコンテンツを追加し、今後の管理者へ引き継げる構成を目指します。

従来の`endo1192/gu-sakkyoku-album`と旧ホスティングは、過去のCDに印刷済みのURLを維持するためのレガシー環境です。このリポジトリから削除・移管・上書きしません。

```text
過去の印刷済みURL
    -> 旧ドメイン / 旧Cloudflare Pages
    -> endo1192/gu-sakkyoku-album

2026年以降の公式URL
    -> 新ドメイン / GitHub Pages
    -> gu-sakkyoku/gu-sakkyoku.github.io
```

## 静的サイトを優先する理由

歌詞、ジャケット、トラック情報、案内文は更新頻度が低いため、ビルド時にHTMLへ変換します。通常の閲覧時にサーバー処理を必要としないことで、運用箇所・障害点・費用を減らします。

`next.config.ts`では`output: "export"`を使用し、`npm run build`の成果物を`out/`へ生成します。

静的サイトで扱うもの：

- トップページ
- 歌詞ページ
- アルバム一覧
- ジャケット画像
- `/download`の画面
- SEO用metadata、robots.txt、sitemap

静的サイトで扱わないもの：

- 秘密コードの検証
- R2の秘密鍵
- ZIPの認可
- サーバーセッション
- 利用者へ公開してはいけないURL

## ダウンロード構成

ダウンロード機能では、表示・認証・保存を分離します。

```text
GitHub Pagesの/download
    -> 年度、コード、TurnstileトークンをPOST
    -> Cloudflare Worker
        -> Turnstileを検証
        -> Cloudflare Secretに保存した年度コードのSHA-256と照合
        -> 固定allowlistからR2オブジェクトを選択
        -> 15分有効な署名付きWorker URLを発行
    -> ブラウザがWorker URLへGET
        -> 署名と年度を再検証し、非公開R2のZIPをストリーミング
```

次のサービスは、必要性が出るまで追加しません。

- データベース
- KV
- Durable Objects
- Queue
- Cron Trigger
- 有料Workersプラン
- 利用者ごとのアカウント・セッション

## 年度追加の目標

将来は、年度を追加するときの作業を次に限定します。

1. 一箇所のアルバムmetadataへ年度を追加する
2. ジャケット画像を追加する
3. 歌詞ページを追加する
4. R2へ年度ZIPを追加する
5. 必要なら年度コードをCloudflare Secretへ追加する
6. 年度データを取り込むWorkerを再デプロイする

コンポーネントや認証処理を年度ごとに複製しません。

## 現在の移行状態

- 新GitHub Organization：作成済み
- 新リポジトリ：作成済み
- 旧サイトの静的コード：初期コピー済み（旧サイト自体は維持）
- GitHub Actions CI：この初期設定で追加
- 作曲部専用Cloudflare Account：参加・アクセス確認済み。無料プランのWorker`gu-sakkyoku-download`を配置済み
- リポジトリ名：`gu-sakkyoku.github.io`。Pagesの標準URLは`https://gu-sakkyoku.github.io/`
- GitHub Pages：リポジトリはPublic、公開元はGitHub Actionsに設定済み。`main`への反映で公開する
- 独自ドメイン：未設定。まずはOrganizationの標準URLを使用する
- `/download/`、Worker、Turnstile連携：ローカル実装・検証済み。Workerと本番Turnstileは作曲部アカウントへ配置済み。購入者画面からの総合試験は公開後に行う
- R2：作曲部アカウントで有効化済み。非公開・Standardの`gu-sakkyoku-albums`に2024・2025の本番ZIPを登録し、元ZIPとのSHA-256一致を確認済み。無料枠超過時の請求に注意する
- ダウンロードコード：2024・2025の本番用をGit管理外で発行済み。Workerにはハッシュのみ登録済み。実値の部内保管・印刷原稿への反映は別途行う

この一覧は構成が変わったときに更新してください。
