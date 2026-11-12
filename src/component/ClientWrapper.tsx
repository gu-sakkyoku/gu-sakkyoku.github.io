import type { ReactNode } from "react";
import Cheader from "./header";
import Cfooter from "./footer";
import World, { type WorldName } from "./World";

/**
 * 全ページ共通の外枠です（名前は既存の歌詞ページとの連続性のために残しています）。
 * worldで作品ごとのテーマ（色・書体・角の丸さ）を選び、ヘッダー・本文・フッターをまとめて包みます。
 * 本文の先頭余白はglobals.cssのsite-mainが決めるので、新しいページもこれで囲めばタイトルが隠れません。
 */
export default function ClientWrapper({
  children,
  className = "",
  world = "tansan",
}: {
  children: ReactNode;
  className?: string;
  world?: WorldName;
}) {
  return (
    <World name={world}>
      <div className={`site-world site-world--${world}`}>
        {/* キーボード利用者が、毎回メニューを通らずに本文へ進めるためのリンクです。 */}
        <a href="#main" className="site-skip-link">本文へ移動</a>
        <Cheader world={world} />
        <main id="main" className={`site-main ${className}`}>{children}</main>
        <Cfooter />
      </div>
    </World>
  );
}
