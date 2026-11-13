import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import { Section } from "@astryxdesign/core/Section";
import { StackItem } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import type { ArchiveAlbum } from "../data/archiveAlbums";
import { albums } from "../data/albums";
import ArchiveArtworkStage from "./ArchiveArtworkStage";
import CrossfadeVideo from "./CrossfadeVideo";
import AlbumDownloadNote from "./ui/AlbumDownloadNote";
import AlbumShelf from "./ui/AlbumShelf";
import AppIcon from "./ui/AppIcon";
import SectionHeading from "./ui/SectionHeading";
import TrackList, { type TrackDisc } from "./ui/TrackList";

/**
 * 2024・2025年の作品ページ本体です。部品はすべてAstryxで、見た目は作品ごとのテーマ
 * （src/themes/<世界>/ の stage・band・panel・jacket・album-title・eyebrow・track-number）と、
 * 作品のCSS（src/app/worlds/）の飾りが受け持ちます。
 * 2作品は同じテンプレートにせず、ジャケットの絵から構図そのものを変えています。
 * - Horoscope：夜空の観測記録。左にジャケットと題字を留め（スクロールしても残ります）、右に動画と星図のような曲リストが流れます。
 * - 虹色memory：題字を大きく掲げ、その下でジャケットの隣に曲リストを虹の七色の順で並べます。
 * 曲名・曲順・クレジット・歌詞の有無は作品データのまま表示し、ここで文字を足したり変えたりしません。
 */
export default function ArchiveAlbumPage({ album }: { album: ArchiveAlbum }) {
  const totalTracks = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);
  // ダウンロードの配信状態は、年度データ（albums.ts）の同じ年度から読みます。
  const downloadAlbum = albums.find((item) => item.year === album.year);
  const discs: TrackDisc[] = album.discs.map((disc) => ({
    name: disc.name,
    tracks: disc.tracks.map((track) => ({
      title: track.title,
      credits: track.credits,
      lyricHref: track.lyricPath,
      artwork: track.artwork ? { src: track.artwork, alt: `${track.title}のイメージ` } : undefined,
    })),
  }));
  const ordinal = `${album.ordinal === 1 ? "1st" : "2nd"}アルバム`;
  const count = album.discs.length > 1 ? `${album.discs.length}枚組・全${totalTracks}曲` : `全${totalTracks}曲`;
  const actions = (
    <HStack as="nav" aria-label="アルバムの案内" gap={3} wrap="wrap" className="archive-hero-actions">
      <Button label="曲リスト・歌詞" href="#archive-tracks" variant="primary" size="lg" />
      <Button label="クロスフェード" href="#archive-crossfade" variant="secondary" size="lg" icon={<AppIcon name="circlePlay" />} />
      <Button label="ダウンロード" href={`/download/#album-${album.year}`} variant="secondary" size="lg" icon={<AppIcon name="download" />} />
    </HStack>
  );
  const trackSection = (
    <Section variant="transparent" padding={0} role="region" aria-labelledby="archive-tracks">
      <VStack gap={5}>
        <SectionHeading id="archive-tracks" note={count}>曲リスト・歌詞</SectionHeading>
        <Text as="p">歌詞のある曲は、リンクから歌詞ページへ進めます。</Text>
        {album.discs.length > 1 && (
          <HStack as="nav" aria-label="ディスクを選ぶ" gap={3} wrap="wrap">
            {album.discs.map((disc, index) => (
              <Button key={disc.name} label={disc.name} href={`#archive-disc-${index + 1}`} variant="secondary" />
            ))}
          </HStack>
        )}
        <TrackList idPrefix="archive-disc" discs={discs} stacked />
      </VStack>
    </Section>
  );
  const crossfadeSection = (
    <Section variant="transparent" padding={0} role="region" aria-labelledby="archive-crossfade">
      <VStack gap={5}>
        <SectionHeading id="archive-crossfade">クロスフェード</SectionHeading>
        <CrossfadeVideo videoId={album.crossfadeVideoId} albumTitle={album.title} />
      </VStack>
    </Section>
  );

  return (
    <>
      {album.theme === "cosmos" ? (
        // 夜空の観測記録：左の列（ジャケット・題字）を画面に留め、右の列を読み進めます。
        <Section variant="stage" padding={0} role="region" aria-labelledby="archive-album-title" className="cosmos-stage" data-depth>
          <Grid columns={{ minWidth: 340, max: 2 }} gap={10} align="start" className="site-container cosmos-layout">
            <StackItem className="cosmos-sleeve">
              <VStack gap={6}>
                <Text type="eyebrow">群馬大学作曲部 {ordinal}</Text>
                {/* data-textは、題字の後ろにシアンとマゼンタをずらして重ねる飾り（作品のCSS）が使います。 */}
                <Heading level={1} type="album-title" id="archive-album-title" className="cosmos-title" data-text={album.title}>
                  {album.title}
                </Heading>
                <ArchiveArtworkStage title={album.title} artwork={album.artwork} world="horoscope" />
                {/* 星の観測記録のように、作品の基本情報を項目と値で並べます。 */}
                <MetadataList label={{ position: "start", width: "4.5rem" }} className="cosmos-record">
                  <MetadataListItem label="年度">{album.year}年</MetadataListItem>
                  <MetadataListItem label="収録">{count}</MetadataListItem>
                </MetadataList>
                {actions}
              </VStack>
            </StackItem>
            <VStack gap={10} className="cosmos-log" data-word={album.title}>
              {crossfadeSection}
              {trackSection}
            </VStack>
          </Grid>
        </Section>
      ) : (
        <>
          {/* 題字を大きく掲げ、その下でジャケットの隣に曲リストを並べます。 */}
          <Section variant="stage" padding={0} role="region" aria-labelledby="archive-album-title" className="niji-stage" data-depth>
            <VStack gap={8} className="site-container niji-stage-inner">
              <VStack gap={4} hAlign="start">
                {/* ノートに貼ったラベルのように、作品の基本情報を1枚ずつ。 */}
                <HStack gap={3} wrap="wrap">
                  <Text type="eyebrow">群馬大学作曲部</Text>
                  <Text type="eyebrow">{album.year}年 {ordinal}</Text>
                  <Text type="eyebrow">{count}</Text>
                </HStack>
                <Heading level={1} type="album-title" id="archive-album-title" className="niji-title">
                  {album.title}
                </Heading>
                {actions}
              </VStack>
              <Grid columns={{ minWidth: 320, max: 2 }} gap={10} align="start" className="niji-spread">
                <StackItem className="niji-jacket">
                  <ArchiveArtworkStage title={album.title} artwork={album.artwork} world="nijiiro" />
                </StackItem>
                {trackSection}
              </Grid>
            </VStack>
          </Section>
          <Section variant="band" padding={0} paddingBlock={10} className="site-section niji-band">
            <VStack className="site-container">{crossfadeSection}</VStack>
          </Section>
        </>
      )}

      {downloadAlbum && <AlbumDownloadNote album={downloadAlbum} />}

      <Section variant="transparent" padding={0} role="region" aria-labelledby="other-albums" className="site-container site-section">
        <VStack gap={6}>
          <SectionHeading id="other-albums">作品一覧</SectionHeading>
          <AlbumShelf exceptYear={album.year} />
        </VStack>
      </Section>
    </>
  );
}
