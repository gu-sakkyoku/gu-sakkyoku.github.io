"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArchiveAlbum } from "../data/archiveAlbums";

/**
 * 正式なジャケットを表示し、Horoscopeは元からある2枚の絵を入れ替えられます。
 * 操作はtype=buttonとaria-pressedで表し、動きを減らす設定はCSS側で尊重します。
 * 曲目や歌詞はこのClient Componentへ渡さず、表示に必要な3項目だけ受け取ります。
 */
export default function ArchiveArtworkStage({
  album,
}: {
  album: Pick<ArchiveAlbum, "title" | "theme" | "artwork">;
}) {
  const cosmic = album.theme === "cosmos";
  const [back, setBack] = useState(false);
  return (
    <figure
      className="archive-art-stage"
      aria-label={album.title + "のジャケット"}
      data-back={back}
    >
      {cosmic && <span className="archive-art-orbit" aria-hidden="true" />}
      {!cosmic && (
        <svg
          className="archive-rainbow-arch"
          viewBox="0 0 600 600"
          aria-hidden="true"
          focusable="false"
        >
          {["red", "orange", "yellow", "green", "blue", "indigo", "violet"].map(
            (color, index) => {
              const inset = 20 + index * 17;
              const radius = 300 - inset;
              return (
                <path
                  key={color}
                  d={`M${inset} 350 A${radius} ${radius} 0 0 1 ${600 - inset} 350`}
                  style={{ stroke: `var(--rainbow-${color})` }}
                />
              );
            },
          )}
        </svg>
      )}
      <Image
        className="archive-cover"
        src={album.artwork}
        alt={album.title + "のアルバムジャケット"}
        width={cosmic ? 1500 : 2160}
        height={cosmic ? 1500 : 2160}
        sizes="(max-width: 767px) 90vw, 680px"
        priority
      />
      {cosmic && (
        <>
          <Image
            className="archive-cover-reverse"
            src="/cover2.png"
            alt="Horoscopeのもう一つのジャケット画像"
            width={1944}
            height={1944}
            sizes="(max-width: 767px) 45vw, 420px"
          />
          <button
            className="archive-jacket-toggle"
            type="button"
            aria-pressed={back}
            onClick={() => setBack((value) => !value)}
          >
            {back ? "最初のジャケットへ戻す" : "もう一つのジャケットを見る"}
            <span aria-hidden="true">↔</span>
          </button>
        </>
      )}
    </figure>
  );
}
