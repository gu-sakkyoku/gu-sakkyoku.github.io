# アルバムの文字と動きの調整

題字・曲名・作者名・歌詞は、それぞれ別の役割の文字として扱っています。

| 作品 | 題字 | 曲名・作者名 | 歌詞本文 |
| --- | --- | --- | --- |
| Horoscope | Orbitron 600：ジャケットの幾何学的な英字に合わせる | 既存のZen Maru GothicとGeist | 既存のZen Old Mincho |
| 虹色memory | 「虹色」はMochiy Pop One、「memory」はFugaz One：太さと斜体、色の重なりを合わせる | 既存のZen Maru GothicとGeist | 既存のZen Old Mincho |
| 炭酸予報 | Mochiy Pop One：丸い題字と一文字ずつ現れる演出 | 曲名は太い丸ゴシック、作者名は小さめに | 既存のZen Old Mincho |

## どこを編集するか

- `src/app/album-type.css`：追加した書体の宣言と2026年の文字の使い分け。
- `src/app/album-worlds.css`：2024・2025の文字サイズ、字間、作品ごとの見た目。
- `src/component/AlbumMotion.tsx` と `src/app/album-motion.css`：スクロールで現れる動き、絵の奥行き。
- `src/component/NewAlbumAnnouncement.tsx`：2026年の題字とジャケットの登場タイミング。

## フォントを管理する際の注意

追加した3ファイルはGoogle Fontsから取得した、題字で使う文字だけを含む配布データです。合計3,964バイトで、音源のような大容量ファイルではありません。公開後はGitHub Pagesが配信するので、閲覧者のブラウザーからGoogle Fonts APIへ問い合わせる必要はありません。

必要文字は `Horoscope`、`虹色炭酸予報`、`memory` に限定しています。別の題字へ使い回す場合は、必要文字版を更新するか、通常版フォントを用意してください。含まれていない文字は既存の代替書体で表示されます。歌詞や新しい年度のタイトルに限定版を無理に適用する必要はありません。

取得元とSHA-256は `public/fonts/album-display-sources.json` にあります。再配布する際は、`public/licenses/` に同梱した各書体の著作権表示とOFLライセンスを一緒に残してください。

動きは表示の補助です。JavaScriptを無効にしても本文は見え、OSで「動きを減らす」を有効にすればスクロール演出と視差移動を停止します。歌詞の原稿やダウンロード認証には動きのための処理を加えていません。
