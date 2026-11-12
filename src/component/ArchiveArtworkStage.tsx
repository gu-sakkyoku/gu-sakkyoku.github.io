"use client";

import { useState } from "react";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import type { WorldSlug } from "../data/worlds";
import AppIcon from "./ui/AppIcon";
import Artwork from "./ui/Artwork";

/**
 * 作品ページ上部のジャケットです。Horoscopeは元からある2枚の絵を入れ替えられます。
 * 入れ替えは「押されている／いない」が読み上げでも伝わる切り替えボタンで行い、
 * 動きを減らす設定の人には、移動のアニメーションなしで即座に入れ替えます（CSS側）。
 * 曲目や歌詞はこの部品へ渡さず、表示に必要な項目だけ受け取ります。
 */
export default function ArchiveArtworkStage({
  title,
  artwork,
  world,
}: {
  title: string;
  artwork: string;
  world: WorldSlug;
}) {
  const cosmic = world === "horoscope";
  const [back, setBack] = useState(false);
  return (
    <figure className="archive-art-stage" aria-label={`${title}のジャケット`} data-back={back} data-tilt>
      {cosmic && <span className="archive-art-orbit" aria-hidden="true" />}
      {!cosmic && (
        <svg className="archive-rainbow-arch" viewBox="0 0 600 360" aria-hidden="true" focusable="false">
          {["red", "orange", "yellow", "green", "blue", "indigo", "violet"].map((color, index) => {
            const inset = 20 + index * 17;
            const radius = 300 - inset;
            return (
              <path
                key={color}
                d={`M${inset} 350 A${radius} ${radius} 0 0 1 ${600 - inset} 350`}
                style={{ stroke: `var(--rainbow-${color})` }}
              />
            );
          })}
        </svg>
      )}
      <div className="archive-cover">
        <Artwork
          src={artwork}
          alt={`${title}のアルバムジャケット`}
          sizes="(max-width: 767px) 80vw, 520px"
          priority
        />
      </div>
      {cosmic && (
        <>
          <div className="archive-cover-reverse">
            <Artwork src="/cover2.png" alt="Horoscopeのもう一つのジャケット画像" sizes="(max-width: 767px) 45vw, 320px" />
          </div>
          <div className="archive-jacket-toggle">
            <ToggleButton
              label="もう一つのジャケットを見る"
              isPressed={back}
              onPressedChange={setBack}
              icon={<AppIcon name="arrowLeftRight" />}
            />
          </div>
        </>
      )}
    </figure>
  );
}
