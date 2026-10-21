import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientWrapper from "../../../component/ClientWrapper";
import { album2026 } from "../../../data/album2026";
import { lyrics2026 } from "../../../data/lyrics2026";
import { albumMincho } from "../../../lib/album2026-font";

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
    <div className={`tansan-white-theme ${albumMincho.variable}`}>
    <ClientWrapper>
      <article style={{ fontFamily: albumMincho.style.fontFamily }} className="mx-auto w-[80%] max-w-3xl pb-16 text-center [overflow-wrap:anywhere]">
        <p><Link href={album2026.detailPath} className="site-text-link inline-flex min-h-11 items-center rounded">炭酸予報 / 曲リストへ戻る</Link></p>
        <h1 className="mt-5 text-[30px] leading-relaxed">{track.title}</h1>
        <p className="mt-3 text-lg">{track.artist}</p>
        <Image src={album2026.artwork} alt="炭酸予報のアルバムジャケット" width={700} height={700} sizes="(max-width: 640px) 80vw, 340px" className="mx-auto mt-8 aspect-square w-full max-w-[340px] rounded-xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.3)]" />
        {/* Reactの通常の文字列描画でエスケープ。空行を保ち、長い行は画面幅に合わせます。 */}
        <p className="mt-10 whitespace-pre-wrap text-lg leading-9">{text}</p>
        <p className="mt-12"><Link href={album2026.detailPath} className="site-text-link inline-flex min-h-12 items-center justify-center rounded-full border-2 border-zinc-400 px-6 py-3 text-lg hover:bg-zinc-500/15">アルバム・曲リストへ戻る</Link></p>
      </article>
    </ClientWrapper>
    </div>
  );
}
