import { Zen_Maru_Gothic, Zen_Old_Mincho } from "next/font/google";

// 2026年の告知・歌詞だけの明朝体。既存ページのフォントは変えません。
// next/fontがビルド時に取得し、公開後はGitHub Pagesから配信します。
// 外部フォントAPIへの閲覧時リクエストや有料サービスは追加しません。
// 配布ライセンスはpublic/licenses/zen-old-mincho-OFL.txtへ同梱しています。
export const albumMincho = Zen_Old_Mincho({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-album-mincho",
});

// 丸ゴシックは告知や入力案内に使用。歌詞本文は落ち着いた明朝体のままにします。
export const albumRounded = Zen_Maru_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-album-rounded",
});
