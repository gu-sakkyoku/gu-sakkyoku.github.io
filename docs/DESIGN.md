# サイトのデザインのしくみ

このサイトは、作品ごとに見た目の「世界」を持っています。ボタン・メニュー・入力欄・曲リストなどの部品は全ページ共通（[Astryx Design System](https://github.com/meta/astryx)）で、色・書体・角の丸さ・飾りだけが作品によって変わります。新しい年度を追加するときも、部品やページの作りを複製する必要はありません。

## 3つの世界

| 世界 | 使うページ | ジャケットから取ったもの |
| --- | --- | --- |
| `tansan`（炭酸予報） | トップ、2026年の作品・歌詞、ダウンロード | 夏空の青、白い雲と白いふち、光の玉、白いしぶき、題字の淡いグラデーションと薄紫の影 |
| `horoscope` | 2025年の作品・歌詞 | 群青の宇宙、月の白い光、細かな星、題字の上下にずれるシアン・マゼンタ・黄、走査線の横縞 |
| `nijiiro`（虹色memory） | 2024年の作品・歌詞 | 青紫の枠、薄い緑と桃色の色面、虹色の題字と白いふち、ずらして重ねる影（版ずれ印刷） |
| `aramaki`（荒牧祭） | 学園祭の特設ページ（`/aramakisai2026/`） | 作曲部のポスター：白い紙に群青、注意ラベルの黄色、群青の帯に白い縁取りの太字、方眼、四方に伸びる星。野外ステージだけ水彩の空色 |

各世界は、OSのライト／ダーク設定に関係なく固定です（`horoscope`だけ暗い背景）。

## どこを直すか

| 直したいもの | ファイル |
| --- | --- |
| 色・書体・角の丸さ・ボタンの形 | `src/themes/<世界>/<世界>Theme.ts` → `npx astryx theme build src/themes/<世界>/<世界>Theme.ts` |
| 絵・題字・動きの飾り | `src/app/worlds/<世界>.css` |
| 全ページ共通の並べ方（曲リスト、歌詞、ダウンロードなど） | `src/app/worlds/shared.css` |
| ヘッダーの高さ・本文の幅・フッター | `src/app/globals.css` |
| メニューの行き先・連絡先 | `src/data/navigation.ts` |
| 年度と世界の対応 | `src/data/worlds.ts` |
| 書体の読み込み | `src/lib/site-fonts.ts`、`src/lib/album2026-font.ts` |

テーマのファイル（`*Theme.ts`）を直したら、必ず`npx astryx theme build`で`.css`と`.js`を作り直してください。生成されたファイルは手で編集しません。CSSを先に読み込むので、JavaScriptが動く前から色が付きます。

## 書体

| 役割 | 炭酸予報 | Horoscope | 虹色memory |
| --- | --- | --- | --- |
| 題字・見出し | Mochiy Pop One | Orbitron | Mochiy Pop One（和文）＋ Fugaz One（欧文） |
| 本文・ボタン | Zen Maru Gothic | Geist（和文はZen Maru Gothic） | Zen Maru Gothic |
| 歌詞本文 | Zen Old Mincho | Zen Old Mincho | Zen Old Mincho |

すべてGoogle Fontsで配布されているOFLライセンスの書体です。`next/font`がビルド時に取得して、このサイトから配信します（閲覧時に外部のフォントAPIへ問い合わせません）。ライセンス文は`public/licenses/`にあります。

## 動き

- 題字・ジャケット・泡の動きは、画面に入ったときに**一度だけ**。繰り返し動き続ける飾りは置きません。
- スクロールに合わせて飾りがわずかに動きますが、スクロールの速さや位置は変えません。
- 歌詞本文、ヘッダー、ダウンロードの入力欄は動かしません。
- OSで「視差効果を減らす」「アニメーションを減らす」を選んだ人には、最初から止まった状態で表示します。
- 動きの共通処理は`src/component/AlbumMotion.tsx`です。要素に`data-reveal`を付けると画面に入ったときに現れ、`data-depth`・`data-tilt`で奥行きと傾きの基準を指定します。

## ジャケット画像

元のPNG（1枚あたり0.8〜5.9MB）は残したまま、`scripts/generate-artwork.mjs`で画面幅に合った軽いWebP（`public/art/`）を作って表示しています。ジャケットを差し替えたら、次を実行して生成物も一緒にコミットしてください。

```bash
node scripts/generate-artwork.mjs
```

## 守っていること

- 歌詞本文・改行・曲順・作者表記・URLは変更しない（`tests/album-2026.test.mjs`、`tests/archive-albums.test.mjs`で確認）。
- 頼まれていない宣伝文句や、飾りの番号は足さない。
- 歌詞へのリンクは、色だけでなく下線と矢印でもリンクだと分かるようにする。
- 押せるところは指で押しやすい大きさ（44px以上）にし、キーボードでも操作でき、選択中の場所が見えるようにする。
- 作品ごとの飾りのCSSは、その作品の世界の中だけに効くようにする（`tests/worlds.test.mjs`で確認）。

## 学園祭などの特設ページ

2026年の荒牧祭のページは`src/app/aramakisai2026/page.tsx`、内容（出演者・時刻・価格・注意書き）は`src/data/aramaki2026.ts`にまとめています。ポスターの表記をそのまま写しているので、ポスターが変わったらデータとテスト（`tests/aramaki-2026.test.mjs`）を一緒に直します。

- 学園祭が終わったら`showOnHome`を`false`にすると、トップの案内とメニューの項目が消えます（ページ自体は記録として残ります）。
- タイムテーブルの「いま」の印は、日本時間で現在出演中の枠に付きます。JavaScriptが動かない環境では表示されず、時刻表はそのまま読めます。
- 来年も作る場合は、データファイルとページをコピーして年を変え、`worlds/aramaki.css`の飾りを使い回せます。

## 新しい年度を追加するとき（デザイン面）

1. `src/themes/`に新しい世界のフォルダを作ります。既存の世界を参考に`<名前>Theme.ts`と`<名前>Theme.doc.mjs`を書き、`npx astryx theme build`と`npx astryx theme add <名前>`を実行します。
2. `src/data/worlds.ts`に年度と世界の対応を1行足し、`src/component/World.tsx`の`worldMode`に明るさ（light / dark）を足します。
3. 飾りが必要なら`src/app/worlds/<名前>.css`を作り、`globals.css`で読み込みます。
4. ジャケットの軽量版を作ります（上の「ジャケット画像」）。

ページの組み立て（曲リスト、歌詞ページ、ダウンロード）は共通部品なので、作り直す必要はありません。
