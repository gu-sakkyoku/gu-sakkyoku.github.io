# サイト構成と責任範囲

## このリポジトリの役割

`gu-sakkyoku/gu-sakkyoku-home`は、群馬大学作曲部の新しい公式サイトを管理するリポジトリです。2026年以降のコンテンツを追加し、今後の管理者へ引き継げる構成を目指します。

従来の`endo1192/gu-sakkyoku-album`と旧ホスティングは、過去のCDに印刷済みのURLを維持するためのレガシー環境です。このリポジトリから削除・移管・上書きしません。

```text
過去の印刷済みURL
    -> 旧ドメイン / 旧Cloudflare Pages
    -> endo1192/gu-sakkyoku-album

2026年以降の公式URL
    -> 新ドメイン / GitHub Pages
    -> gu-sakkyoku/gu-sakkyoku-home
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

## 将来のダウンロード構成

ダウンロード機能を実装する場合は、表示・認証・保存を分離します。

```text
GitHub Pagesの/download
    -> 年度とコードをPOST
    -> Cloudflare Worker
        -> Turnstileを検証
        -> Cloudflare Secretに保存した年度コードを検証
        -> 固定allowlistからR2オブジェクトを選択
        -> 非公開R2のZIPを返す
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

コンポーネントや認証処理を年度ごとに複製しません。

## 現在の移行状態

- 新GitHub Organization：作成済み
- 新リポジトリ：作成済み
- 旧サイトの静的コード：初期コピー対象
- GitHub Actions CI：この初期設定で追加
- 作曲部専用Cloudflare Account：参加・アクセス確認済み
- GitHub Pages公開：リポジトリの公開範囲と新ドメインを決めてから設定
- 新ドメイン：未設定
- Cloudflare Worker / R2 / Turnstile：未実装
- ダウンロードコード：未発行

この一覧は構成が変わったときに更新してください。
