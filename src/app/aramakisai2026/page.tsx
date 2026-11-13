import type { Metadata } from "next";
import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { List, ListItem } from "@astryxdesign/core/List";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { MediaTheme } from "@astryxdesign/core/theme";
import { VStack } from "@astryxdesign/core/VStack";
import AlbumMotion from "../../component/AlbumMotion";
import ClientWrapper from "../../component/ClientWrapper";
import CautionLabel from "../../component/aramaki/CautionLabel";
import DjTimeline from "../../component/aramaki/DjTimeline";
import FestivalSummary from "../../component/aramaki/FestivalSummary";
import LiveMark from "../../component/aramaki/LiveMark";
import PosterFigure from "../../component/aramaki/PosterFigure";
import Artwork from "../../component/ui/Artwork";
import { albums } from "../../data/albums";
import { aramaki2026 } from "../../data/aramaki2026";

const { outdoorStage, djStage, merch, campus } = aramaki2026;
const title = `${aramaki2026.name}${aramaki2026.year} | 群馬大学作曲部`;
const description = `群馬大学作曲部の${aramaki2026.name}${aramaki2026.year}（${aramaki2026.dateRangeLabel}）の出演・物販情報。${outdoorStage.name}と、${djStage.room}の${djStage.name}のタイムテーブル、アルバムCD・ダウンロードカードの販売のご案内です。`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: aramaki2026.path },
  openGraph: { title, description, url: aramaki2026.path },
  twitter: { title, description },
};

const merchAlbums = merch.albumYears.map((year) => albums.find((album) => album.year === year)!).filter(Boolean);
// 地図は住所で検索するリンクにします（地図の埋め込みや外部の読み込みはしません）。
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${campus.name} ${campus.address}`)}`;

/**
 * 荒牧祭（群馬大学の学園祭）の特設ページです。内容はすべて src/data/aramaki2026.ts から表示します。
 * 部品はすべてAstryxで、見た目は荒牧祭のテーマ（src/themes/aramaki/ の stage・band・panel・sky・festival-title など）と、
 * 作品のCSS（src/app/worlds/aramaki.css）が受け持ちます。どの飾りも作曲部のポスターの実物から取っています。
 *
 * 主役はDJステージです。タイムテーブルを作曲ソフト（DAW）の編集画面のように描き、ポスターの音圧警告ラベル・
 * 警告の三角・音量メーターを画面いっぱいに使います。野外ステージは水彩の空、物販はポスターのカードの作りです。
 */
export default function AramakiPage() {
  return (
    <ClientWrapper world="aramaki" className="aramaki-main">
      <AlbumMotion>
        {/* 冒頭：左に題字、右の群青の列に「いつ・どこで」の一覧。下を音圧警告ラベルの帯が走ります。 */}
        <Section variant="stage" padding={0} role="region" aria-labelledby="aramaki-title" className="fest-hero" data-depth>
          <Grid columns={{ minWidth: 320, max: 2 }} gap={0} align="stretch" className="fest-hero-grid">
            <VStack gap={5} hAlign="start" className="fest-hero-copy">
              <Text type="eyebrow">群馬大学作曲部</Text>
              <Heading level={1} type="festival-title" id="aramaki-title" className="fest-title" data-text={aramaki2026.name}>
                {aramaki2026.name}
                <Text type="time" className="fest-title-year">{aramaki2026.year}</Text>
              </Heading>
              <Text type="time" className="fest-dates">{aramaki2026.dateRangeLabel}</Text>
              <Text weight="bold" className="fest-campus">{campus.name}</Text>
              <HStack as="nav" aria-label="このページの案内" gap={3} wrap="wrap">
                <Button label={djStage.name} href="#dj-stage" variant="primary" size="lg" />
                <Button label={outdoorStage.name} href="#outdoor-stage" variant="secondary" size="lg" />
                <Button label="物販" href="#merch" variant="secondary" size="lg" />
              </HStack>
            </VStack>
            <VStack gap={4} className="fest-hero-side">
              <Heading level={2} id="aramaki-summary" className="fest-side-heading">日程と場所</Heading>
              <Section variant="panel" padding={5} className="fest-summary-panel">
                <FestivalSummary />
              </Section>
            </VStack>
          </Grid>
          <CautionLabel className="fest-hero-label" />
        </Section>

        {/* DJステージ：画面いっぱいの「DJ STAGE」の文字の上に、DAWのタイムラインを置きます。 */}
        <Section variant="transparent" padding={0} role="region" aria-labelledby="dj-stage" className="fest-dj">
          <VStack gap={8} className="site-container fest-dj-inner">
            {/* 見出しの帯：ポスターの上部と同じ群青。背景に輪郭だけの「DJ STAGE」、右端に警告の三角。 */}
            <MediaTheme mode="dark">
              <HStack gap={6} vAlign="end" hAlign="between" wrap="wrap" className="fest-dj-head" data-word="DJ STAGE">
                <VStack gap={3} hAlign="start">
                  <Heading level={2} type="poster-heading" id="dj-stage" className="fest-dj-title">
                    {djStage.name}
                  </Heading>
                  <Text weight="bold" size="lg">{campus.name} {djStage.room}</Text>
                  <Text>会場では、作曲部のアルバムも販売しています。</Text>
                </VStack>
                <Text type="time" className="fest-dj-room" aria-hidden="true">{djStage.room}</Text>
              </HStack>
            </MediaTheme>

            <DjTimeline days={djStage.days} />

            <Grid columns={{ minWidth: 300, max: 2 }} gap={8} align="start" className="fest-dj-notes">
              <Section variant="band" padding={6} role="region" aria-label="DJステージのご注意" className="fest-cautions">
                <MediaTheme mode="dark">
                  <VStack gap={6}>
                    {djStage.cautions.map((caution) => (
                      <VStack key={caution.title} gap={2} hAlign="start">
                        <Heading level={3} className="fest-caution-title">{caution.title}</Heading>
                        <Text>{caution.text}</Text>
                      </VStack>
                    ))}
                  </VStack>
                </MediaTheme>
              </Section>
              <PosterFigure poster={djStage.poster} />
            </Grid>
          </VStack>
        </Section>

        {/* 野外ステージ：ポスターと同じ水彩の空に、出演順のセットリスト。 */}
        <Section variant="sky" padding={0} paddingBlock={10} role="region" aria-labelledby="outdoor-stage" className="fest-outdoor">
          <Grid columns={{ minWidth: 300, max: 2 }} gap={10} align="start" className="site-container fest-outdoor-grid">
            <VStack gap={6}>
              <VStack gap={2} hAlign="start">
                <Heading level={2} type="poster-heading" id="outdoor-stage">{outdoorStage.name}</Heading>
                <HStack gap={3} vAlign="center" wrap="wrap">
                  <Text type="time" size="xl" className="fest-outdoor-time">
                    {outdoorStage.dateLabel} {outdoorStage.start}-{outdoorStage.end}
                  </Text>
                  <LiveMark date={outdoorStage.date} start={outdoorStage.start} end={outdoorStage.end} />
                </HStack>
                <Text color="secondary">タイムテーブル（出演順）</Text>
              </VStack>
              <List hasDividers edge="flush" density="spacious" className="fest-setlist">
                {outdoorStage.acts.map((act, index) => (
                  <ListItem
                    key={act.name}
                    align="start"
                    startContent={<Text type="track-number">{index + 1}</Text>}
                    label={<Text weight="bold" size="lg">{act.name}</Text>}
                    description={
                      <VStack gap={1} hAlign="start">
                        <Text>『{act.song}』</Text>
                        {act.lyricPath && (
                          <Link href={act.lyricPath} hasUnderline weight="bold">「{act.song}」の歌詞はこちら</Link>
                        )}
                      </VStack>
                    }
                  />
                ))}
              </List>
            </VStack>
            <PosterFigure poster={outdoorStage.poster} />
          </Grid>
        </Section>

        {/* 物販：ポスターのカードと同じ、濃い線と群青のずれた影。値段は縦長の大きな数字で。 */}
        <Section variant="transparent" padding={0} role="region" aria-labelledby="merch" className="site-container site-section fest-merch">
          <VStack gap={6}>
            <VStack gap={2} hAlign="start">
              <Heading level={2} type="poster-heading" id="merch">物販</Heading>
              <Text>{djStage.name}の会場（{djStage.room}）で販売しています。</Text>
            </VStack>
            <Grid columns={{ minWidth: 300, max: 2 }} gap={10} align="start" className="fest-merch-grid">
              <Section variant="panel" padding={6}>
                <VStack gap={6}>
                  <Grid columns={3} gap={3}>
                    {merchAlbums.map((album) => (
                      <VStack key={album.year} gap={1} hAlign="center">
                        {album.artwork && (
                          <Artwork src={album.artwork} alt={`${album.title}のアルバムジャケット`} sizes="(max-width: 640px) 28vw, 180px" className="fest-merch-art" />
                        )}
                        <Text type="supporting">{album.year}年度</Text>
                        {album.detailPath ? (
                          <Link href={album.detailPath} hasUnderline weight="bold">{album.title}</Link>
                        ) : (
                          <Text weight="bold">{album.title}</Text>
                        )}
                      </VStack>
                    ))}
                  </Grid>
                  <VStack gap={2}>
                    {merch.prices.map((price) => (
                      <HStack key={price.item} gap={3} hAlign="between" vAlign="end" className="fest-price">
                        <Text size="lg">{price.item}</Text>
                        <Text type="time" className="fest-price-value">{price.price}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <VStack gap={3} className="fest-deals">
                    <Text type="eyebrow">お得情報</Text>
                    {merch.deals.map((deal) => (
                      <HStack key={deal.item} gap={3} hAlign="between" vAlign="end" className="fest-price">
                        <Text>{deal.item}</Text>
                        <Text type="time" className="fest-price-value fest-price-value--deal">{deal.price}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Text type="supporting">
                    ダウンロードカードは、カードに印刷されたコードで
                    <Link href="/download/" hasUnderline>ダウンロードページ</Link>
                    から音源を受け取れます。
                  </Text>
                </VStack>
              </Section>
              <PosterFigure poster={merch.poster} />
            </Grid>
          </VStack>
        </Section>

        <Section variant="band" padding={0} paddingBlock={10} role="region" aria-labelledby="access" className="site-section fest-access">
          <MediaTheme mode="dark">
            <VStack gap={3} hAlign="start" className="site-container">
              <Heading level={2} id="access">会場</Heading>
              <Text weight="bold" size="lg">{campus.name}</Text>
              <Text>{campus.address}</Text>
              <Text>{djStage.name}・物販：{djStage.room}</Text>
              <Link href={mapUrl} isExternalLink isStandalone hasUnderline>地図で場所を見る</Link>
            </VStack>
          </MediaTheme>
        </Section>
      </AlbumMotion>
    </ClientWrapper>
  );
}
