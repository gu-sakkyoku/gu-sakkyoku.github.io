import type { Metadata } from "next";
import Link from "next/link";
import ClientWrapper from "../../component/ClientWrapper";
import LyricLink from "../../component/LyricLink";
import NewAlbumAnnouncement from "../../component/NewAlbumAnnouncement";
import { album2026 } from "../../data/album2026";
import { albums } from "../../data/albums";
import { albumMincho } from "../../lib/album2026-font";

const title = "炭酸予報 | 群馬大学作曲部 3rdアルバム";
const description = "群馬大学作曲部の2026年アルバム「炭酸予報」。クロスフェード、全18曲の曲目・歌詞、M3-2026秋の出展情報を掲載しています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: album2026.detailPath },
  openGraph: { title, description, url: album2026.detailPath, images: [album2026.artwork] },
  twitter: { title, description, images: [album2026.artwork] },
};

/** 静的に出力する作品ページです。既存の明朝体・中央揃え・青い歌詞リンクを継承します。 */
export default function TansanYohouPage() {
  return (
    <div className={`tansan-white-theme ${albumMincho.variable}`}>
    <ClientWrapper>
      {/* ホームと同じ作品情報・告知を使用し、タイトルはこのページのh1になります。 */}
      <NewAlbumAnnouncement album={albums.find((album) => album.year === 2026)!} motionReady context="album" />
      <article className="mx-auto w-[80%] max-w-4xl pb-16 text-center font-serif [overflow-wrap:anywhere]">
        <section aria-labelledby="track-list" className="release-track-list mt-16 pt-10">
          <h2 id="track-list" className="text-[30px]">曲リスト</h2>
          <p className="mt-3 text-base">2枚組 / 全18曲</p>
          <p className="mt-3 text-base leading-7">歌詞を掲載している曲には「歌詞はこちら」のリンクがあります。</p>
          <nav aria-label="ディスクを選ぶ" className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {album2026.discs.map((disc, index) => (
              <a key={disc.name} href={`#disc-${index + 1}`} className="site-text-link inline-flex min-h-11 items-center rounded">{disc.name}</a>
            ))}
          </nav>
          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {album2026.discs.map((disc, index) => (
              <section key={disc.name} aria-labelledby={`disc-${index + 1}`}>
              <h3 id={`disc-${index + 1}`} className="border-b border-blue-200 pb-4 text-[27px] text-blue-900 dark:text-blue-300">{disc.name}</h3>
              <ol className="mt-7 space-y-8">
                {disc.tracks.map((track, trackIndex) => (
                  <li key={track.title} className="text-lg leading-8">
                    <p>{trackIndex + 1}. {track.title}</p>
                    <p>{track.artist}</p>
                    {track.lyricSlug && <LyricLink href={`${album2026.detailPath}${track.lyricSlug}/`} />}
                  </li>
                ))}
              </ol>
              </section>
            ))}
          </div>
        </section>

        <dl className="mx-auto mt-14 max-w-xl border-t border-current pt-8 text-base leading-8">
          {album2026.credits.map((credit) => (
            <div key={credit.role} className="flex flex-wrap justify-center gap-x-3">
              <dt>{credit.role}</dt><dd>{credit.name}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-base leading-7">ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。</p>
        <Link href="/download/#album-2026" className="site-text-link mt-4 inline-flex min-h-12 items-center justify-center rounded-full border-2 border-zinc-400 px-6 py-3 text-lg hover:bg-zinc-500/15">ダウンロードページへ</Link>
        <p className="mt-8"><Link href="/" className="site-text-link inline-flex min-h-11 items-center rounded">トップページへ戻る</Link></p>
      </article>
    </ClientWrapper>
    </div>
  );
}
