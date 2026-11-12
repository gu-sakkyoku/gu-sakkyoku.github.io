import type { Metadata } from "next";
import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import AlbumEventNotice from "../../component/AlbumEventNotice";
import AlbumMotion from "../../component/AlbumMotion";
import ClientWrapper from "../../component/ClientWrapper";
import CrossfadeVideo from "../../component/CrossfadeVideo";
import NewAlbumAnnouncement from "../../component/NewAlbumAnnouncement";
import AlbumDownloadNote from "../../component/ui/AlbumDownloadNote";
import AlbumShelf from "../../component/ui/AlbumShelf";
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

/** 静的に出力する作品ページです。曲名・曲順・作者・歌詞の有無は作品データのとおりに表示します。 */
export default function TansanYohouPage() {
  return (
    <ClientWrapper world="tansan" className="tansan-album-main">
      <AlbumMotion>
        {/* ホームと同じ紹介を使用し、タイトルはこのページのh1になります。 */}
        <NewAlbumAnnouncement album={album} context="album" />

        <section aria-labelledby="crossfade" className="site-container site-section">
          <SectionHeading id="crossfade">Crossfade / クロスフェード</SectionHeading>
          <CrossfadeVideo videoId={album2026.crossfadeVideoId} albumTitle={album2026.title} />
        </section>

        <section aria-labelledby="track-list" className="site-container site-section">
          <SectionHeading id="track-list" note={`${album2026.discs.length}枚組 / 全${trackCount}曲`}>曲リスト</SectionHeading>
          <Text as="p">歌詞を掲載している曲には「歌詞はこちら」のリンクがあります。</Text>
          <HStack as="nav" aria-label="ディスクを選ぶ" gap={3} wrap="wrap" className="disc-nav">
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
        </section>

        <section aria-labelledby="album-facts" className="site-container site-section">
          {/* 2列に並べ、画面が狭いときは自動で1列になります。 */}
          <Grid columns={{ minWidth: 280, max: 2 }} gap={8}>
            <VStack gap={4} hAlign="start" data-reveal>
              <Heading level={2} id="album-facts">クレジット</Heading>
              <MetadataList label={{ position: "start", width: "5.5rem" }}>
                {album2026.credits.map((credit) => (
                  <MetadataListItem key={credit.role} label={credit.role}>{credit.name}</MetadataListItem>
                ))}
              </MetadataList>
            </VStack>
            <VStack data-reveal>
              <AlbumEventNotice event={album2026.event} />
            </VStack>
          </Grid>
        </section>

        <div className="site-container site-section">
          <AlbumDownloadNote album={album} />
        </div>

        <section aria-labelledby="other-albums" className="site-container site-section">
          <SectionHeading id="other-albums">作品一覧</SectionHeading>
          <AlbumShelf exceptYear={album2026.year} />
        </section>
      </AlbumMotion>
    </ClientWrapper>
  );
}
