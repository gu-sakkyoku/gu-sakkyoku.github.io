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
    -> gu-sakkyoku/gu-sakkyoku.github.io
    -> トップページ、歌詞、/download、アルバム情報

【認証と音源だけ】
/downloadのコード入力
    -> HTTPS POST
    -> Cloudflare Worker
        -> 年度コードをSecretで検証
        -> Turnstileを検証
        -> 対応年度のR2オブジェクトを取得
    -> 15分有効なWorker配信用URLを返す
    -> 対応年度の非公開R2オブジェクトをストリーミング
```

GitHub Pagesの代わりにCloudflare PagesやWorkers Static Assetsでサイト本体を公開しません。Cloudflareは認証、音源保存、必要に応じたDNS管理に限定します。

## 所有関係

- GitHub Organization：`gu-sakkyoku`
- GitHub Repository：`gu-sakkyoku/gu-sakkyoku.github.io`
- 静的サイト：GitHub Pages
- Cloudflare Account：`群馬大学作曲部`
- Cloudflareの役割：Worker、R2、Turnstile、必要に応じたDNS

個人名のCloudflare AccountへWorker、ドメイン、R2を作成しないでください。Cloudflare Dashboard左上のAccount名が`群馬大学作曲部`であることを、操作前に毎回確認します。

`worker/wrangler.jsonc`の`account_id`も作曲部アカウントに固定しています。引き継ぎ時に別アカウントを使う場合だけ、管理者が対象を確認して変更してください。

担当交代の手順と費用・権限に関する未決事項は[次の部員への引き継ぎ・運用の記録](HANDOVER.md)にまとめています。支払い責任者は部内で暫定的に決まり、R2は有効化済みです。ただし、**請求・支払い方法の引き継ぎは今後も必要**です。公開文書に氏名や支払い情報を載せないでください。

## GitHubとの連携

静的サイトはGitHub ActionsからGitHub Pagesへ公開するため、CloudflareとGitHub Organizationをサイト本体用に連携する必要はありません。

将来Workerの自動デプロイを設定する場合だけ、次のどちらかを選びます。

1. GitHub Actionsから、権限を限定したCloudflare API TokenでWorkerをデプロイする
2. CloudflareのGit連携を、Worker用コードとこのリポジトリだけに限定する

どちらを使う場合も、Organization内の全リポジトリへのアクセスを許可しません。Workerの本番デプロイを始めるまではGit連携を作成しません。

## ダウンロード機能の本番設定

2026-10-09時点で、作曲部Cloudflare Accountの非公開・Standardの`gu-sakkyoku-albums`バケットには`albums/2024.zip`・`albums/2025.zip`・`albums/2026.zip`があります。2024・2025を新ZIPへ差し替え、2026を追加し、3本とも一時保存先・配信先から全量を読み戻して元ZIPとのSHA-256一致を確認しました。旧版と一時コピーは削除済みです。無料枠超過時の請求があり得るため、担当者が利用量と請求先を継続して確認してください。

作曲部アカウントへ`gu-sakkyoku-download` Workerを配置しています。R2 Bindingは`ALBUMS`、Worker URLは`https://gu-sakkyoku-download.super-butterfly-1ee0.workers.dev`です。本番Turnstile Widgetは`gu-sakkyoku-download-production`で、許可hostnameは`gu-sakkyoku.github.io`のみです。Workerには3年度のコードハッシュ・短期ダウンロードURL署名鍵・Turnstile Secretを、Cloudflare Secretとして登録済みです。2026追加時も既存年度のコードは変えず、署名鍵・Turnstile Secretも変更していません。**Secretの実値をGitHubへ書かないでください。** GitHubリポジトリはPublic、Pagesの公開元はGitHub Actionsに設定済みです。各更新後には購入者画面からの正規ダウンロード確認も行います。

以下の順番で、本番での配信を有効にします。

1. 共同管理者とURL・費用の承認方法・運用責任者を確認する。支払い責任者は暫定決定済みでR2は有効化済みですが、費用の確認・引き継ぎは続きます。Budget Alertは料金上限として利用を自動停止しません。リポジトリはPublic、Pages標準URLは`https://gu-sakkyoku.github.io/`です。印刷するQRは公開後に実機で確認する。
2. **済：** 作曲部アカウントでR2を有効化し、Standard Storageの非公開バケット`gu-sakkyoku-albums`を作成した。`r2.dev`の公開URLは有効化しないまま維持する。
3. **済：** 2024・2025・2026のZIPをS3互換APIのマルチパートでアップロードし、全量のSHA-256一致を確認した。大容量ZIPはS3互換APIで転送する。
4. **済：** 部内だけで本番コードを年度別に発行した。**コードそのものは印刷原稿などアクセスを絞った場所にのみ置く**。Worker Secret`DOWNLOAD_CODE_HASHES`には年度ごとのSHA-256ハッシュをJSONで保存する。例：`{"2024":"<64文字のハッシュ>","2025":"<64文字のハッシュ>","2026":"<64文字のハッシュ>"}`。既存年度を残して追加し、ローカルのテストコードを本番に使わない。
5. **済：** Worker Secret`DOWNLOAD_TOKEN_SECRET`には32バイト以上のランダム値をbase64url形式で設定し、`TURNSTILE_SECRET_KEY`には本番Turnstile Secretを設定した。Turnstile Widgetは作曲部アカウントで作成し、許可hostnameは`gu-sakkyoku.github.io`だけ。Managedモード、事前クリアランス無効。公開テスト用sitekey/secretを本番に使わない。`RUNTIME_MODE`は本番で`production`のままにする。
6. **済：** `worker/wrangler.jsonc`の`ALLOWED_ORIGIN`をサイトのOriginへ合わせ、Workerをデプロイした。
7. **済：** GitHubのRepository Settings > Secrets and variables > Actions > **Variables**に`NEXT_PUBLIC_DOWNLOAD_WORKER_URL`（本番WorkerのHTTPS Origin）と`NEXT_PUBLIC_TURNSTILE_SITE_KEY`（本番用の公開sitekey）を設定した。Secretそのものではないので、Secrets欄ではなくVariables欄です。未設定だとデプロイWorkflowはスキップされます。テスト用sitekeyやHTTPのWorker URLはWorkflowで拒否します。
8. **設定済み：** リポジトリはPublic、GitHub Pagesの公開元は**GitHub Actions**。`main`へ反映すると`.github/workflows/deploy-pages.yml`が`out/`をアップロードします。Pull Requestからはデプロイしません。
9. 本番公開前に、誤コード、正コード、公開年度のZIP取得、次年度の準備中表示、スマホ表示、R2が非公開であることを別の管理者と確認する。最後に共通QRを読み取り、印刷URLを確定する。

2027以降は`src/data/albums.ts`に1件追加し、R2の`albums/2027.zip`とハッシュ・ジャケットを用意します。年度データはWorkerのビルドにも含まれるため、公開時には`npx wrangler deploy --config worker/wrangler.jsonc`でWorkerも再デプロイします。Cloudflare Workerの認証ロジックを年度ごとにコピーしません。

### 大きなZIPのアップロード例（技術担当向け）

AWS CLIのS3互換APIなら大容量ファイルをマルチパートで転送できます。R2で**対象バケットだけ**にObject Read & Writeを許した短期・限定権限の資格情報を作り、手元のAWS CLIプロファイルに登録してください。資格情報をシェル履歴・GitHub・チャットへ貼らないでください。

```bash
aws s3 cp /path/to/2024.zip s3://gu-sakkyoku-albums/albums/2024.zip --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com --profile <R2専用プロファイル>
aws s3 cp /path/to/2025.zip s3://gu-sakkyoku-albums/albums/2025.zip --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com --profile <R2専用プロファイル>
aws s3 cp /path/to/2026.zip s3://gu-sakkyoku-albums/albums/2026.zip --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com --profile <R2専用プロファイル>
```

アップロード後はサイズと内容を確認します。ダウンロード試験を1回行い、元ZIPとのSHA-256を照合してから販売してください。2026年10月の更新用ZIPは、2024年が約622MB、2025年が約191MB、2026年が約446MBで、合計約1.26GBです（10進数）。Standard Storageの無料枠は月10GBですが、他の保存物・操作やプラン条件で料金が変わるため、無料枠を超えない保証とは考えないでください。

### ZIPだけを修正版へ差し替えるとき

カードのQR・年度コード・Worker Secretは**そのまま**です。差し替えるのは同じ`albums/<年度>.zip`の中身だけです。コードの再発行コマンドは実行しません。

1. 新ZIPを開けることを確認し、サイズとSHA-256を記録します。
2. 非公開R2の一時キーへ新ZIPをアップロードし、**ファイル全体を読み戻して**照合します。マルチパートのETagは単純なファイルハッシュではないので、ETagだけで内容一致を判断しません。
3. 完成した一時オブジェクトを本来の`albums/<年度>.zip`へコピーします。先に旧ZIPを削除して配信を止めないでください。
4. 本来のキーも全量照合し、既存のコードで画面から保存できることを確認します。署名付きURLやコードを確認記録へ載せません。
5. 旧版を残さない方針の場合、照合成功後に一時コピーを削除し、作業用R2トークンも無効化します。旧版へ戻すには部内で保管した元ZIPが必要です。PCの元ZIPまで一緒に消しません。

新年度を追加するときだけ、既存年度のハッシュを残して新年度分をSecretへ追加し、公開フラグを変更してWorkerとGitHub Pagesを両方更新します。署名鍵・Turnstile Secret・許可Originの変更は不要です。

### ローカル試験（Cloudflareへの請求なし）

`npm ci`と`npm run cards:generate`を済ませてから、別々のターミナルでサイトとWorkerを起動します。生成された`.env.local`と`worker/.dev.vars`はGitで無視されます。`.dev.vars`を変更したときはWorkerを一度終了して再起動してください。

```bash
npm run dev
npm run worker:dev
```

ローカルR2へZIPを追加します。必ず`--local`を付けてください。`/path/to/`は自分のPCにあるZIPの場所に直します。

```bash
npx wrangler r2 object put gu-sakkyoku-albums/albums/2024.zip --file=/path/to/2024.zip --local --config worker/wrangler.jsonc
npx wrangler r2 object put gu-sakkyoku-albums/albums/2025.zip --file=/path/to/2025.zip --local --config worker/wrangler.jsonc
node scripts/verify-local-downloads.mjs /path/to/ZIPのあるフォルダ
```

最後のコマンドは、ローカルWorkerから2024・2025の2本を最後まで取得して元ファイルのSHA-256と比較します。この確認用スクリプトとテストカードの自動生成対象は2年度です。本番の2026確認は2026の既存コードを使い、公開ページから別途行います。元ZIPのサイズに応じて時間と空き容量に注意してください。ローカルR2のデータは`.wrangler/`に保存され、Gitには含まれません。

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
- R2は有効化済み。Standard Storageを維持し、Budget Alertの通知先と額を部内で決めて設定する
- 料金が発生する操作は、共同管理者と確認してから行う
