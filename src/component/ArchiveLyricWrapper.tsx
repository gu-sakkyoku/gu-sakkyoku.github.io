import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientWrapper from "./ClientWrapper";
import SodaIcon from "./SodaIcon";
import { archiveAlbums } from "../data/archiveAlbums";

/**
 * 歌詞原稿には触れず、周りのブックレットと「作品へ戻る」導線だけを共通化します。
 * URLは各page.tsxのまま。本文中の改行・空白・曲名・クレジットはそのまま渡します。
 */
export default function ArchiveLyricWrapper({
  year,
  children,
}: {
  year: 2024 | 2025;
  children: ReactNode;
}) {
  const album = archiveAlbums[year];
  return (
    <ClientWrapper className="archive-lyric-main">
      <nav className="archive-lyric-breadcrumb" aria-label="歌詞ページの案内">
        <Link href={`${album.detailPath}#archive-tracks`}>
          <SodaIcon name="arrow" />
          {album.title}の曲リストへ
        </Link>
        <span>{album.year}</span>
      </nav>
      <article className="archive-lyric-sheet">
        <div className="archive-lyric-masthead">
          <Image
            src={album.artwork}
            alt=""
            width={80}
            height={80}
            sizes="56px"
          />
          <p>
            {album.title}
            <span>歌詞</span>
          </p>
        </div>
        {children}
      </article>
      <nav className="archive-lyric-bottom" aria-label="歌詞を読み終えた方へ">
        <Link
          className="archive-secondary-link"
          href={`${album.detailPath}#archive-tracks`}
        >
          曲リストへ戻る
        </Link>
        <Link
          className="archive-primary-link"
          href={`/download/#album-${year}`}
        >
          <SodaIcon name="download" />
          ダウンロードページへ
        </Link>
      </nav>
    </ClientWrapper>
  );
}
