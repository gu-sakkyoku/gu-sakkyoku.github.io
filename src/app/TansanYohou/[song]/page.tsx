import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientWrapper from "../../../component/ClientWrapper";
import LyricSheet from "../../../component/ui/LyricSheet";
import { album2026 } from "../../../data/album2026";
import { lyrics2026 } from "../../../data/lyrics2026";
import { lyricItemsOfYear } from "../../../lib/lyric-items";

const tracks = album2026.discs.flatMap((disc) => disc.tracks).filter((track) => track.lyricSlug);
type PageProps = { params: Promise<{ song: string }> };

// GitHub Pages用に5曲すべてをビルド時に生成します。実行時サーバーは不要です。
// 未提供の歌詞を推測して公開したり、任意のパスをファイル名にして読んだりしません。
export const dynamicParams = false;
export function generateStaticParams() {
  return tracks.map((track) => ({ song: track.lyricSlug }));
}

function findSong(slug: string) {
  const track = tracks.find((item) => item.lyricSlug === slug);
  if (!track || !Object.hasOwn(lyrics2026, slug)) notFound();
  return { track, text: lyrics2026[slug] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { song } = await params;
  const { track } = findSong(song);
  const title = `${track.title} 歌詞 | 炭酸予報 | 群馬大学作曲部`;
  const description = `群馬大学作曲部「炭酸予報」収録、${track.artist}「${track.title}」の歌詞ページです。`;
  const path = `${album2026.detailPath}${song}/`;
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [album2026.artwork] },
    twitter: { title, description, images: [album2026.artwork] },
  };
}

export default async function LyricPage({ params }: PageProps) {
  const { song } = await params;
  const { track, text } = findSong(song);
  return (
    <ClientWrapper world="tansan">
      <LyricSheet
        album={{ year: album2026.year, title: album2026.title, artwork: album2026.artwork }}
        trackListHref={`${album2026.detailPath}#track-list`}
        items={lyricItemsOfYear(album2026.year)}
        heading={{ title: track.title, artist: track.artist }}
        backLabel="アルバム・曲リストへ戻る"
      >
        {/* Reactの通常の文字列描画でエスケープ。空行を保ち、長い行は画面幅に合わせます。 */}
        <p className="lyric-body whitespace-pre-wrap">{text}</p>
      </LyricSheet>
    </ClientWrapper>
  );
}
