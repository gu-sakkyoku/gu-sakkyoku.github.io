"use client";

import { useState } from "react";
import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { VStack } from "@astryxdesign/core/VStack";
import type { WorldSlug } from "../data/worlds";
import AppIcon from "./ui/AppIcon";
import Artwork from "./ui/Artwork";

/**
 * 2024・2025年の作品ページのジャケットです。枠はテーマの Card variant="jacket"
 * （Horoscopeは月明かりの細い線、虹色memoryは版ずれの紙）で、部品はすべてAstryxです。
 * Horoscopeは元からある2枚の絵を入れ替えられます。入れ替えは「押されている／いない」が
 * 読み上げでも伝わる切り替えボタンで行い、動きを減らす設定の人には即座に入れ替えます（作品のCSS）。
 * 軌道の輪・虹のアーチなどの飾りは、作品のCSSが疑似要素や読み上げ対象外の絵として描きます。
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
    <VStack gap={4} hAlign="center" role="group" aria-label={`${title}のジャケット`} className="archive-art-stage" data-back={back} data-tilt>
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
      <Card variant="jacket" padding={cosmic ? 0 : 2} className="archive-cover album-jacket">
        <AspectRatio ratio={1} fit="cover">
          <Artwork src={artwork} alt={`${title}のアルバムジャケット`} sizes="(max-width: 767px) 80vw, 520px" priority />
        </AspectRatio>
      </Card>
      {cosmic && (
        <>
          <Card variant="jacket" padding={0} className="archive-cover-reverse">
            <AspectRatio ratio={1} fit="cover">
              <Artwork src="/cover2.png" alt="Horoscopeのもう一つのジャケット画像" sizes="(max-width: 767px) 45vw, 320px" />
            </AspectRatio>
          </Card>
          <HStack hAlign="center" className="archive-jacket-toggle">
            <ToggleButton
              label="もう一つのジャケットを見る"
              isPressed={back}
              onPressedChange={setBack}
              icon={<AppIcon name="arrowLeftRight" />}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}
