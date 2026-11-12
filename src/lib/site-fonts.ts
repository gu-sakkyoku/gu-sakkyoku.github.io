import { Dela_Gothic_One, Fugaz_One, Mochiy_Pop_One, Orbitron, Oswald, Zen_Kaku_Gothic_New } from "next/font/google";
import { albumMincho, albumRounded } from "./album2026-font";

// 見出し・題字用の書体です。next/fontがビルド時に取得し、公開後はこのサイトから配信します。
// 閲覧時に外部のフォントAPIへ問い合わせません。ライセンスはpublic/licenses/に同梱しています。
// どの書体をどこで使うかは、作品ごとのテーマ（src/themes/）で決めます。

/** 炭酸予報の題字と同じ、丸くて太い見出し用書体（日本語対応）。 */
export const displayPop = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-pop",
});

/** Horoscopeの題字と同じ、幾何学的な英数字用書体。 */
export const displayOrbit = Orbitron({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-orbit",
});

/** 虹色memoryの「memory」と同じ、斜体の英数字用書体。 */
export const displaySlant = Fugaz_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-slant",
});

/** 荒牧祭のポスターの、太く角ばった見出しに近い書体（日本語対応）。 */
export const displayBlock = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-block",
});

/** 荒牧祭のポスターのタイムテーブルのような、縦長の数字・英字用書体。 */
export const displayCondensed = Oswald({
  weight: ["500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-display-condensed",
});

/** 荒牧祭の本文用の角ゴシック。ポスターのすっきりした文字に合わせます。 */
export const bodyKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-body-kaku",
});

/** bodyへまとめて付けるCSS変数のクラス名。書体のファイルは、実際に使われたときだけ読み込まれます。 */
export const siteFontVariables = [
  albumMincho.variable,
  albumRounded.variable,
  displayPop.variable,
  displayOrbit.variable,
  displaySlant.variable,
  displayBlock.variable,
  displayCondensed.variable,
  bodyKaku.variable,
].join(" ");
