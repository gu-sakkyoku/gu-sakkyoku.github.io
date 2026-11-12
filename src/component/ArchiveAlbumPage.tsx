import { Button } from "@astryxdesign/core/Button";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import type { ArchiveAlbum } from "../data/archiveAlbums";
import { albums } from "../data/albums";
import { worldOfYear } from "../data/worlds";
import ArchiveArtworkStage from "./ArchiveArtworkStage";
import CrossfadeVideo from "./CrossfadeVideo";
import AlbumDownloadNote from "./ui/AlbumDownloadNote";
import AlbumShelf from "./ui/AlbumShelf";
import AppIcon from "./ui/AppIcon";
import SectionHeading from "./ui/SectionHeading";
import TrackList from "./ui/TrackList";

/**
 * 2024・2025年の作品ページ本体です。並び順は2026年と同じ「紹介 → 試聴 → 曲リスト → ダウンロード → ほかの作品」。
 * 曲名・曲順・クレジット・歌詞の有無は作品データのまま表示し、ここで文字を足したり変えたりしません。
 * 絵の飾りと題字は作品ごとのCSS（src/app/worlds/）、色と書体は作品ごとのテーマが受け持ちます。
 */
export default function ArchiveAlbumPage({ album }: { album: ArchiveAlbum }) {
  const world = worldOfYear(album.year);
  const totalTracks = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);
  // ダウンロードの配信状態は、年度データ（albums.ts）の同じ年度から読みます。
  const downloadAlbum = albums.find((item) => item.year === album.year);
  return (
    <>
      <section className="archive-hero" aria-labelledby="archive-album-title" data-depth>
        <div className="archive-hero-scene" aria-hidden="true" />
        <div className="archive-hero-inner site-container">
          <div className="archive-hero-copy">
            <p className="archive-edition">
              <span>{album.year} / {album.ordinal === 1 ? "1st" : "2nd"} album</span>
              <span>{album.discs.length}枚組・全{totalTracks}曲</span>
            </p>
            <Text as="p" type="supporting" className="archive-artist">群馬大学作曲部</Text>
            {/* data-textは、題字の後ろに色をずらして重ねる飾り（CSS）が使います。読み上げには影響しません。 */}
            <h1 id="archive-album-title" className="archive-title" data-text={album.title}>
              {world === "nijiiro" ? (
                <>
                  <span>虹色</span>
                  <span className="archive-title-memory">memory</span>
                </>
              ) : (
                album.title
              )}
            </h1>
            <HStack as="nav" aria-label="アルバムの案内" gap={3} wrap="wrap" className="archive-hero-actions">
              <Button label="曲リスト・歌詞" href="#archive-tracks" variant="primary" size="lg" endContent={<AppIcon name="arrowRight" />} />
              <Button label="クロスフェード" href="#archive-crossfade" variant="secondary" size="lg" icon={<AppIcon name="circlePlay" />} />
              <Button label="ダウンロード" href={`/download/#album-${album.year}`} variant="secondary" size="lg" icon={<AppIcon name="download" />} />
            </HStack>
          </div>
          <ArchiveArtworkStage title={album.title} artwork={album.artwork} world={world} />
        </div>
      </section>

      <section className="site-container site-section" aria-labelledby="archive-crossfade">
        <SectionHeading id="archive-crossfade">クロスフェード</SectionHeading>
        <CrossfadeVideo videoId={album.crossfadeVideoId} albumTitle={album.title} />
      </section>

      <section className="site-container site-section" aria-labelledby="archive-tracks">
        <SectionHeading id="archive-tracks" note={`${album.discs.length}枚組・全${totalTracks}曲`}>曲リスト・歌詞</SectionHeading>
        <Text as="p">歌詞のある曲は、リンクから歌詞ページへ進めます。</Text>
        {album.discs.length > 1 && (
          <HStack as="nav" aria-label="ディスクを選ぶ" gap={3} wrap="wrap" className="disc-nav">
            {album.discs.map((disc, index) => (
              <Button key={disc.name} label={disc.name} href={`#archive-disc-${index + 1}`} variant="secondary" />
            ))}
          </HStack>
        )}
        <TrackList
          idPrefix="archive-disc"
          discs={album.discs.map((disc) => ({
            name: disc.name,
            tracks: disc.tracks.map((track) => ({
              title: track.title,
              credits: track.credits,
              lyricHref: track.lyricPath,
              artwork: track.artwork ? { src: track.artwork, alt: `${track.title}のイメージ` } : undefined,
            })),
          }))}
        />
      </section>

      {downloadAlbum && (
        <div className="site-container site-section">
          <AlbumDownloadNote album={downloadAlbum} />
        </div>
      )}

      <section className="site-container site-section" aria-labelledby="other-albums">
        <SectionHeading id="other-albums">作品一覧</SectionHeading>
        <AlbumShelf exceptYear={album.year} />
      </section>
    </>
  );
}
