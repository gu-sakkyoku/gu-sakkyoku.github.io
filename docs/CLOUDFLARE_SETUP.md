# Cloudflareバックエンド設定方針

この文書は、GitHub Pagesで公開するサイトから、作曲部専用Cloudflare Accountの認証バックエンドと非公開R2を利用するための方針です。

## 変更しない全体構成

```text
【以前のCD購入者】
印刷済みの旧URL
    -> 旧Cloudflare Pages
    -> endo1192/gu-sakkyoku-album
    -> 2024・2025年など旧歌詞ページを維持

【2026年以降】
新ドメイン
    -> GitHub Pages
    -> gu-sakkyoku/gu-sakkyoku-home
    -> トップページ、歌詞、/download、アルバム情報

【認証と音源だけ】
/downloadのコード入力
    -> HTTPS POST
    -> Cloudflare Worker
        -> 年度コードをSecretで検証
        -> Turnstileを検証
        -> 対応年度のR2オブジェクトを取得
    -> 非公開R2バケットのalbums/2026.zip
```

GitHub Pagesの代わりにCloudflare PagesやWorkers Static Assetsでサイト本体を公開しません。Cloudflareは認証、音源保存、必要に応じたDNS管理に限定します。

## 所有関係

- GitHub Organization：`gu-sakkyoku`
- GitHub Repository：`gu-sakkyoku/gu-sakkyoku-home`
- 静的サイト：GitHub Pages
- Cloudflare Account：`群馬大学作曲部`
- Cloudflareの役割：Worker、R2、Turnstile、必要に応じたDNS

個人名のCloudflare AccountへWorker、ドメイン、R2を作成しないでください。Cloudflare Dashboard左上のAccount名が`群馬大学作曲部`であることを、操作前に毎回確認します。

## GitHubとの連携

静的サイトはGitHub ActionsからGitHub Pagesへ公開するため、CloudflareとGitHub Organizationをサイト本体用に連携する必要はありません。

将来Workerの自動デプロイを設定する場合だけ、次のどちらかを選びます。

1. GitHub Actionsから、権限を限定したCloudflare API TokenでWorkerをデプロイする
2. CloudflareのGit連携を、Worker用コードとこのリポジトリだけに限定する

どちらを使う場合も、Organization内の全リポジトリへのアクセスを許可しません。Workerの実装が存在しない現在は、Git連携を作成しません。

## 将来のダウンロード機能

R2やSecretは、実際のZIPと年度コードが決まってから追加します。

- R2バケットは非公開にする
- `r2.dev`公開URLを有効にしない
- 年度コードはCloudflare Secretに保存する
- Turnstile SecretもCloudflare Secretに保存する
- GitHub Secretsやソースコードへ実値を書かない
- R2 Binding名とオブジェクト名は文書化する
- Worker Freeの上限時は認証を迂回させず、失敗として扱う
- 許可するWeb Originを新ドメインへ限定する
- 利用者へ内部エラーやstack traceを表示しない

## 新ドメイン

新ドメインはGitHub Pagesへ接続します。CloudflareでDNSを管理する場合も、サイト本体の配信元はGitHub Pagesのままです。

本番URLが確定したら、すべてのダウンロードカードで次の固定URLを使用します。

```text
https://<new-domain>/download
```

WorkerのURLはQRコードへ印刷しません。Workerの配置や内部構成を変更しても、`/download`のURLを維持します。

## 有料機能を避ける

- Workers Paidへ変更しない
- 不要なKV、D1、Durable Objects、Queue、Cronを作らない
- R2は必要になるまでSubscriptionを開始しない
- R2を開始したらStandard Storageを使用し、Budget Alertを設定する
- 料金が発生する操作は、共同管理者と確認してから行う
