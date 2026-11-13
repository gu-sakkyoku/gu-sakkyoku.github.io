import type { Metadata } from "next";
import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { MediaTheme } from "@astryxdesign/core/theme";
import { VStack } from "@astryxdesign/core/VStack";
import AlbumEventNotice from "../../component/AlbumEventNotice";
import AlbumMotion from "../../component/AlbumMotion";
import ClientWrapper from "../../component/ClientWrapper";
import CrossfadeVideo from "../../component/CrossfadeVideo";
import AlbumDownloadNote from "../../component/ui/AlbumDownloadNote";
import AlbumShelf from "../../component/ui/AlbumShelf";
import AppIcon from "../../component/ui/AppIcon";
import Artwork from "../../component/ui/Artwork";
import SectionHeading from "../../component/ui/SectionHeading";
import TrackList from "../../component/ui/TrackList";
import { album2026 } from "../../data/album2026";
import { albums } from "../../data/albums";

const title = "炭酸予報 | 群馬大学作曲部 3rdアルバム";
const description = "群馬大学作曲部の2026年アルバム「炭酸予報」。クロスフェード、全18曲の曲目・歌詞、M3-2026秋の出展情報を掲載しています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: album2026.detailPath },
  openGraph: { title, description, url: album2026.detailPath, images: [album2026.artwork] },
  twitter: { title, description, images: [album2026.artwork] },
};

// ダウンロードの配信状態などは、年度データ（albums.ts）の同じ年度から読みます。
const album = albums.find((item) => item.year === album2026.year)!;
const trackCount = album2026.discs.reduce((total, disc) => total + disc.tracks.length, 0);

/**
 * 「炭酸予報」の作品ページです。部品はすべてAstryxで、見た目は炭酸予報のテーマ（src/themes/tansan/）の
 * variant（空の stage、濃い青の band、白い panel、写真の jacket）と、作品のCSS（雲・泡・しぶき）が受け持ちます。
 *
 * 構成：夏空の真ん中に題字とジャケット（空を見上げるジャケットの構図）→ 曲リスト → 濃い空の帯にクロスフェード
 * → クレジットと出展情報 → ダウンロード → ほかの作品。
 * 曲名・曲順・作者・歌詞の有無は作品データのとおりに表示し、ここで文字を足したり変えたりしません。
 */
export default function TansanYohouPage() {
  return (
    <ClientWrapper world="tansan" className="tansan-album-main">
      <AlbumMotion>
        <Section
          variant="stage"
          padding={0}
          role="region"
          aria-labelledby="album-title"
          className="tansan-stage"
          data-depth
        >
          {/* ジャケットと同じ2×2の題字「炭酸／予報」を空いっぱいに置き、写真をその右肩に重ねます。 */}
          <Grid columns={{ minWidth: 300, max: 2 }} gap={0} align="center" className="site-container tansan-stage-inner">
            <VStack gap={5} hAlign="start" className="tansan-stage-copy">
              <MediaTheme mode="dark">
                <Text type="eyebrow">群馬大学作曲部 3rdアルバム</Text>
              </MediaTheme>
              <Heading level={1} type="album-title" id="album-title" className="tansan-stage-title">
                {album2026.title}
              </Heading>
              <HStack as="nav" aria-label="アルバムの案内" gap={3} wrap="wrap" className="tansan-stage-nav">
                <Button label="曲リスト・歌詞" href="#track-list" variant="primary" size="lg" />
                <Button label="クロスフェード" href="#crossfade" variant="secondary" size="lg" icon={<AppIcon name="circlePlay" />} />
                <Button label="ダウンロード" href={`/download/#album-${album2026.year}`} variant="secondary" size="lg" icon={<AppIcon name="download" />} />
              </HStack>
            </VStack>
            <Card variant="jacket" padding={3} className="tansan-stage-jacket" data-tilt>
              <VStack gap={3}>
                <AspectRatio ratio={1} fit="cover">
                  <Artwork
                    src={album2026.artwork}
                    alt={`${album2026.title}のアルバムジャケット`}
                    sizes="(max-width: 767px) 86vw, 520px"
                    priority
                  />
                </AspectRatio>
                {/* 写真の下の余白に、年だけを書き込みます。 */}
                <Text type="eyebrow" color="secondary" className="tansan-stage-jacket-note">{album2026.year}</Text>
              </VStack>
            </Card>
          </Grid>
        </Section>

        <Section variant="transparent" padding={0} role="region" aria-labelledby="track-list" className="site-container site-section">
          <VStack gap={6}>
            <SectionHeading id="track-list" note={`${album2026.discs.length}枚組 / 全${trackCount}曲`}>曲リスト</SectionHeading>
            <Text as="p">歌詞を掲載している曲には「歌詞はこちら」のリンクがあります。</Text>
            <HStack as="nav" aria-label="ディスクを選ぶ" gap={3} wrap="wrap">
              {album2026.discs.map((disc, index) => (
                <Button key={disc.name} label={disc.name} href={`#disc-${index + 1}`} variant="secondary" />
              ))}
            </HStack>
            <TrackList
              idPrefix="disc"
              discs={album2026.discs.map((disc) => ({
                name: disc.name,
                tracks: disc.tracks.map((track) => ({
                  title: track.title,
                  credits: [track.artist],
                  lyricHref: track.lyricSlug ? `${album2026.detailPath}${track.lyricSlug}/` : undefined,
                })),
              }))}
            />
          </VStack>
        </Section>

        <Section variant="band" padding={0} paddingBlock={10} role="region" aria-labelledby="crossfade" className="site-section tansan-band">
          <MediaTheme mode="dark">
            <VStack gap={6} className="site-container tansan-band-inner">
              <SectionHeading id="crossfade">Crossfade / クロスフェード</SectionHeading>
              <CrossfadeVideo videoId={album2026.crossfadeVideoId} albumTitle={album2026.title} />
            </VStack>
          </MediaTheme>
        </Section>

        <Grid columns={{ minWidth: 300, max: 2 }} gap={10} align="start" className="site-container site-section">
          <Section variant="transparent" padding={0} role="region" aria-labelledby="album-credits">
            <VStack gap={4} hAlign="start">
              <Heading level={2} id="album-credits">クレジット</Heading>
              <MetadataList label={{ position: "start", width: "5.5rem" }}>
                {album2026.credits.map((credit) => (
                  <MetadataListItem key={credit.role} label={credit.role}>{credit.name}</MetadataListItem>
                ))}
              </MetadataList>
            </VStack>
          </Section>
          <AlbumEventNotice event={album2026.event} />
        </Grid>

        <AlbumDownloadNote album={album} />

        <Section variant="transparent" padding={0} role="region" aria-labelledby="other-albums" className="site-container site-section">
          <VStack gap={6}>
            <SectionHeading id="other-albums">作品一覧</SectionHeading>
            <AlbumShelf exceptYear={album2026.year} />
          </VStack>
        </Section>
      </AlbumMotion>
    </ClientWrapper>
  );
}
