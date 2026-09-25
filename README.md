# 群馬大学作曲部公式サイト

群馬大学作曲部が管理する公式Webサイトのリポジトリです。

このリポジトリは、2026年以降の歌詞掲載とダウンロードカード機能を継続的に管理するために作成しました。初期コードは、従来の歌詞サイト
[`endo1192/gu-sakkyoku-album`](https://github.com/endo1192/gu-sakkyoku-album)
の現在の公開状態を土台にしています。

> [!IMPORTANT]
> 従来のリポジトリと旧サイトは、過去に配布したCDの印刷済みURLを維持するために残します。
> このリポジトリから旧サイトを置き換えたり、旧URLを削除したりしません。

## はじめて管理する部員へ

まず、次の3点だけ覚えてください。

1. **古いサイトは消しません。** 以前のCDに印刷された歌詞ページのURLがあるためです。
2. **新しいサイトのダウンロード入口は毎年同じです。** カードのQRは `https://gu-sakkyoku.github.io/download/` を指します。2024・2025のアルバムを選べて、2026は現在「準備中」です。
3. **音源ZIPとカードのコードはGitHubへ載せません。** ZIPは部の非公開Cloudflare R2、コードはCloudflareのSecretに入れます。

「GitHub」はサイトの文章・見た目を管理する場所、「GitHub Pages」はそれを公開する場所、「Cloudflare Worker」はコードを確認する場所、「R2」はZIPを保管する場所です。全部を一人で設定する必要はありません。技術担当と共同管理者で分担してください。

> [!WARNING]
> `npm run cards:generate`で作るカードとコードは**ローカル試験用**です。本番カードには使わないでください。2024・2025の配布用ZIPは作曲部の非公開R2へ登録し、元ファイルとのSHA-256一致を確認済みです。本番カードの印刷前には、公開URL・正しいコードと誤ったコード・実際のZIP取得・スマホ表示を、別の部員と一緒に再確認してください。

リポジトリ名は`gu-sakkyoku.github.io`で、公開範囲はPublic、GitHub Pagesの公開元はGitHub Actionsです。標準URLは`https://gu-sakkyoku.github.io/`です。共同管理者がPull Requestを確認し、`main`へ反映すると静的サイトが公開されます。**カード印刷前にQRの最終URLをスマートフォンで実機確認してください。**

## 次の部員への引き継ぎ

このサイトは、今の担当者が卒業しても続けられることが大切です。**支払い責任者は部内で暫定的に決まり、R2も有効化済みです。ただし、請求・支払い方法の引き継ぎや本番配信まで完了したわけではありません。** 担当者の実名、カード番号、ログイン情報は、この公開予定のリポジトリに書かず、部内の非公開の引き継ぎ先で管理してください。

役割は次のように分けて考えます。会計・支払い担当は料金と請求を確認し、サイト担当はページ・ZIP・認証の動作を確認し、共同管理者は変更内容をレビューします。同じ人が複数の役割を兼ねても構いませんが、**費用の承認と技術的な操作を一人だけの判断にしない**ことを勧めます。

卒業・交代前には、後任をGitHub Organizationと作曲部Cloudflare Accountに**本人のアカウントで招待**し、後任が公開ページ、請求情報、非公開ZIPの設定へ必要な範囲でアクセスできることを一緒に確かめます。パスワードを渡すだけの引き継ぎはしません。請求先・通知先・二段階認証の復旧方法を確認し、後任が実際に試せてから、旧担当者の権限を整理します。支払い方法を変える権限とサービス契約を変える権限は同じではないため、担当する作業に合う権限も確認してください。

引き継ぎ時に見落としやすいのは、旧CDの印刷済みURL、全カード共通の新しいQR、無料枠を超えたときの請求、年度共通コードの流出です。**料金通知は利用を自動停止する上限ではありません。** 旧URLや前年までのコードを、後任が事情を知らずに変更しないようにしてください。

手順のチェックリスト、問題点、次の部員に議論してほしい事項は[引き継ぎ・運用の記録](docs/HANDOVER.md)にまとめました。Cloudflareの具体的な初期設定は[Cloudflareバックエンド設定方針](docs/CLOUDFLARE_SETUP.md)を参照してください。

## Download Card（ダウンロードカード）

購入者はカードのQRを読み取り、`/download/`で購入した年度を選び、カードに書かれたコードを入力します。画面の「ダウンロードはこちらから」を押すと入力欄が開きます。正しいコードと認証チェックを通過したときだけ、ZIPのダウンロードが始まります。2024・2025の曲紹介・歌詞ページへも同じ画面から移動できます。2026はZIPと作品情報の準備ができるまで押せません。

カードのQRは**年度が違っても同じURL**です。年度ごとに変わるのは印刷するコードと作品名だけです。QRは[`public/download-qr.svg`](public/download-qr.svg)にあります。カードの印刷前には、実際のスマートフォンで読み取り、表示URLが部の確定した公開URLか確認してください。独自ドメインへ移るなら、印刷前にQR・公開設定・サイト内のURLをまとめて更新します。

### 2027年など、新しいアルバムを追加するとき

1. 部内で作品名、曲順、ジャケット、配布許可、完成ZIPを確認します。ZIPを一度開いて壊れていないか確認してください。
2. `src/data/albums.ts`に新しい年度を1件追加します。前年の書き方をコピーし、最初は`downloadEnabled: false`、`r2Key: "albums/2027.zip"`にします。曲名をここに並べると一覧に表示されます。
3. ジャケット画像を`public/`へ追加し、`artwork`にそのファイル名を書きます。歌詞ページがある場合は`detailPath`も設定します。
4. 技術担当がZIPを**非公開R2**の`albums/2027.zip`へアップロードし、その年のコードのハッシュをCloudflare Secretに追加します。`src/data/albums.ts`はWorkerにも取り込まれるため、`npx wrangler deploy --config worker/wrangler.jsonc`でWorkerも再デプロイします。ZIPとコードをPull Requestやチャットの公開欄に貼らないでください。
5. プレビューでスマホ・PCの見た目、曲順、歌詞リンク、コード誤入力時の表示、正しいコードでのZIP取得を確認します。ZIPが揃ってから`downloadEnabled: true`にします。
6. Pull Requestで別の管理者に見てもらい、公開後にスマホでQRを再確認します。**前年までのコードや旧歌詞URLを勝手に変更しない**でください。

分からない作業は「ZIPをGitHubに入れる」で代用せず、共同管理者に相談してください。年度ごとのコードは同じ年度の全カードで共通です。誰かにコードを転送される可能性はあるため、この機能は厳密な購入者識別やDRMではありません。

本番コードを発行する技術担当は、`r2Key`を決めた後で`npm run codes:generate -- 2027`を実行します。コードの実値はGit管理外の`local-output/production-codes-2027.txt`、Workerへ登録するハッシュは`local-output/production-code-hashes.json`に保存されます。**コマンドはコードを画面に表示せず、同じ年度の再発行も拒否します。** コードは部が承認した非公開の保管先と印刷原稿へ移し、ハッシュJSONは既存年度を残したままWorker Secret`DOWNLOAD_CODE_HASHES`へ反映してください。発行ファイルを失った場合、ハッシュから元のコードは復元できません。印刷済みカードへ影響するので、勝手に再発行せず共同管理者と相談します。

### ローカルでテストカードを作る

技術担当と一緒に行ってください。初回だけ`npm ci`の後に`npm run cards:generate`を実行します。共通QR、2024・2025のテストカード、テストコード、ローカル動作用の設定が作られます。

| 出力 | 用途 |
| --- | --- |
| `public/download-qr.svg` | 毎年同じURLを指すQR（コードは入っていません） |
| `local-output/cards/` | 「TEST CARD」と大きく書かれた確認用カード |
| `local-output/test-codes.txt` | ローカルテストだけで使うコード |
| `.env.local`、`worker/.dev.vars` | 自分のPCで動かすための設定 |

`local-output/`と設定ファイルはGitに追加されません。`cards:generate`は誤ってコードを上書きしないよう2回目には停止します。本番のカードはテストカードからそのまま印刷せず、URL確定・Cloudflare設定・本番コード発行後に作り直してください。

ZIPを含むローカル総合試験の手順と本番Cloudflare設定は[`docs/CLOUDFLARE_SETUP.md`](docs/CLOUDFLARE_SETUP.md)にあります。

## 技術構成

- Next.js 15（App Router）
- React 19
- TypeScript
- styled-components
- Framer Motion
- Tailwind CSS/PostCSS
- 静的エクスポート（`output: "export"`）

サイト本体は、できる限り静的なHTML・CSS・JavaScriptとして生成します。コード認証や音源配信など、秘密情報を必要とする処理はブラウザへ実装せず、作曲部専用Cloudflare AccountのWorkerと非公開R2へ分離しています。

詳しい設計方針は[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)を参照してください。

## ローカル開発

### 必要なもの

- Node.js 24
- npm

Node.jsの基準バージョンは[`.nvmrc`](.nvmrc)で管理しています。

### 初回セットアップ

```bash
npm ci
npm run dev
```

ブラウザで`http://localhost:3000`を開きます。

### 変更前の確認

```bash
npm run lint
npm test
npm run build
```

まとめて確認する場合は、次を実行します。

```bash
npm run check
```

Pull Requestでも同じ検証をGitHub Actionsが自動実行します。

## 主なディレクトリ

```text
src/app/        App Routerのページと共通レイアウト
src/component/  再利用するUIコンポーネント
src/data/       ダウンロード一覧の年度データ
worker/         コード検証と非公開R2配信（Cloudflare Worker）
scripts/        テストカード作成とローカル配信確認
public/         ジャケット、ロゴ、robots.txtなどの静的ファイル
docs/           構成・運用上の判断を残す文書
.github/        CI、CODEOWNERS、Pull Requestテンプレート
```

## 開発フロー

1. `main`を最新にする
2. 作業内容ごとにブランチを作る
3. ローカルで実装・確認する
4. Pull Requestを作る
5. CIと画面表示を確認する
6. レビュー後にマージする

ブランチ名の例：

```text
feat/download-page
feat/2027-album
fix/mobile-header
docs/update-operations
chore/github-pages
```

共同開発時の詳しい約束は[`CONTRIBUTING.md`](CONTRIBUTING.md)を参照してください。

## 秘密情報と大容量ファイル

次のものは、このリポジトリへcommitしません。

- 年度ごとのダウンロードコード
- Cloudflare API Token
- Turnstile Secret Key
- R2アクセスキー
- `.env`ファイル
- ZIP、WAV、FLACなどの音源データ

ブラウザから見える`NEXT_PUBLIC_*`変数にも秘密情報を入れません。音源ZIPは非公開R2へ保存し、サーバー側で認証してから配信します。テスト用コードも本番コードの代わりに使わないでください。

## デプロイ方針

静的サイト本体はGitHub Pagesで公開します。コード認証と音源配信だけを作曲部専用Cloudflare AccountのWorkerと非公開R2へ分離します。

リポジトリはPublic、Pagesの公開元は`GitHub Actions`です。`.github/workflows/deploy-pages.yml`は`main`への反映時に静的サイトを公開します。公開設定が未入力ならデプロイをスキップし、HTTPSではないWorker URLやテスト用Turnstile sitekeyも拒否します。詳細は[`docs/CLOUDFLARE_SETUP.md`](docs/CLOUDFLARE_SETUP.md)を参照してください。

ダウンロード機能も、次の役割分担を維持します。

```text
GitHub Organization  コード、Issue、Pull Request、レビュー
GitHub Pages         HTML、CSS、JavaScript、画像、歌詞ページ
Cloudflare Worker    コード検証とダウンロード認可
Cloudflare R2        非公開の音源ZIP
```

手動設定の手順は[`docs/CLOUDFLARE_SETUP.md`](docs/CLOUDFLARE_SETUP.md)に記載しています。

## 管理上の注意

- 既存URLを変更する場合は、利用中の印刷物への影響を確認してください。
- UI変更を含むPull Requestには、PCとスマートフォンの確認結果を記載してください。
- 依存関係のメジャーバージョン更新は、通常の機能追加と分けてください。
- `main`へのforce pushや、レビュー前の大規模変更を避けてください。
- 年度ごとの情報は一箇所で管理し、複数ページへ重複させない方針です。
