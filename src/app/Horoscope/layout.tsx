import type { ReactNode } from "react";
import { albumMincho, albumRounded } from "../../lib/album2026-font";
import "../album-worlds.css";

/** 作品と8曲の既存歌詞URLを、一つの宇宙テーマで囲みます。全サイトのbodyは変更しません。 */
export default function HoroscopeLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`album-world album-world--cosmos ${albumMincho.variable} ${albumRounded.variable}`}
    >
      {children}
    </div>
  );
}
