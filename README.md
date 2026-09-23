# 群馬大学作曲部公式サイト

群馬大学作曲部が管理する公式Webサイトのリポジトリです。

このリポジトリは、2026年以降の歌詞掲載と、将来のダウンロードカード機能を継続的に管理するために作成しました。初期コードは、従来の歌詞サイト
[`endo1192/gu-sakkyoku-album`](https://github.com/endo1192/gu-sakkyoku-album)
の現在の公開状態を土台にしています。

> [!IMPORTANT]
> 従来のリポジトリと旧サイトは、過去に配布したCDの印刷済みURLを維持するために残します。
> このリポジトリから旧サイトを置き換えたり、旧URLを削除したりしません。

## 技術構成

- Next.js 15（App Router）
- React 19
- TypeScript
- styled-components
- Framer Motion
- Tailwind CSS/PostCSS
- 静的エクスポート（`output: "export"`）

サイト本体は、できる限り静的なHTML・CSS・JavaScriptとして生成します。コード認証や音源配信など、秘密情報を必要とする処理はブラウザへ実装せず、作曲部専用Cloudflare AccountのWorkerと非公開R2へ分離します。

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

ブラウザから見える`NEXT_PUBLIC_*`変数にも秘密情報を入れません。将来の音源ZIPは非公開R2へ保存し、サーバー側で認証してから配信します。

## デプロイ方針

静的サイト本体はGitHub Pagesで公開します。コード認証と音源配信だけを作曲部専用Cloudflare AccountのWorkerと非公開R2へ分離します。

GitHub Pages用の本番デプロイは、リポジトリの公開範囲、新ドメイン、Organizationでのドメイン検証が確定してから有効化します。

ダウンロード機能を追加する場合も、次の役割分担を維持します。

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
