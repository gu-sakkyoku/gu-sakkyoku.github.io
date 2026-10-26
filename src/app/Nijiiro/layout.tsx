import type { ReactNode } from "react";
import { albumMincho, albumRounded } from "../../lib/album2026-font";
import "../album-worlds.css";

/** 虹色memory配下だけの虹テーマ。炭酸予報やダウンロード一覧の空色は維持します。 */
export default function NijiiroLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`album-world album-world--rainbow ${albumMincho.variable} ${albumRounded.variable}`}
    >
      {children}
    </div>
  );
}
