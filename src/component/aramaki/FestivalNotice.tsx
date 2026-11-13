import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { MediaTheme } from "@astryxdesign/core/theme";
import { VStack } from "@astryxdesign/core/VStack";
import { aramaki2026 } from "../../data/aramaki2026";
import World from "../World";
import Artwork from "../ui/Artwork";
import FestivalSummary from "./FestivalSummary";

const { outdoorStage, djStage, merch, campus } = aramaki2026;
// ポスターは特設ページの該当する場所へのリンクにします（拡大表示は特設ページ側で行えます）。
const posters = [
  { poster: outdoorStage.poster, hash: "#outdoor-stage", label: outdoorStage.name },
  { poster: djStage.poster, hash: "#dj-stage", label: djStage.name },
  { poster: merch.poster, hash: "#merch", label: "物販" },
];

/**
 * トップページの最上部に出す、荒牧祭のまとめです（題字・日程・場所・物販と、3枚のポスター）。
 * トップ自体は炭酸予報のテーマですが、この部分だけ荒牧祭のテーマ（World name="aramaki"）で包み、
 * 特設ページと同じ群青の帯・題字・白い面で表示します。新作アルバムの紹介はこの下に続きます。
 * 学園祭が終わったら src/data/aramaki2026.ts の showOnHome を false にすると消え、新作がトップの先頭に戻ります。
 */
export default function FestivalNotice() {
  if (!aramaki2026.showOnHome) return null;
  return (
    <World name="aramaki">
      <Section variant="band" padding={0} role="region" aria-labelledby="home-festival-title" className="home-festival">
        <Grid columns={{ minWidth: 320, max: 2 }} gap={8} align="center" className="site-container home-festival-inner">
          <MediaTheme mode="dark">
            <VStack gap={4} hAlign="start" className="home-festival-head">
              <Text type="eyebrow">群馬大学作曲部</Text>
              <Heading level={2} type="festival-title" id="home-festival-title" className="home-festival-title">
                {aramaki2026.name}
                <Text type="time" className="home-festival-year">{aramaki2026.year}</Text>
              </Heading>
              <Text type="time" className="home-festival-dates">{aramaki2026.dateRangeLabel}</Text>
              <Text weight="bold">{campus.name}</Text>
              <Button label="特設ページを見る" href={aramaki2026.path} variant="primary" size="lg" />
            </VStack>
          </MediaTheme>
          <VStack gap={6}>
            <ul className="home-festival-posters" aria-label="ポスター">
              {posters.map(({ poster, hash, label }) => (
                <li key={poster.src}>
                  <a href={`${aramaki2026.path}${hash}`} aria-label={`${label}の詳細（特設ページ）`}>
                    <Artwork src={poster.src} alt="" sizes="(max-width: 767px) 30vw, 200px" priority />
                  </a>
                </li>
              ))}
            </ul>
            <Section variant="panel" padding={5}>
              <FestivalSummary linkBase={aramaki2026.path} />
            </Section>
          </VStack>
        </Grid>
      </Section>
    </World>
  );
}
