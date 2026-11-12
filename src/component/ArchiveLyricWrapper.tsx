import type { ReactNode } from "react";
import ClientWrapper from "./ClientWrapper";
import LyricSheet from "./ui/LyricSheet";
import { archiveAlbums } from "../data/archiveAlbums";
import { worldOfYear } from "../data/worlds";
import { lyricItemsOfYear } from "../lib/lyric-items";

/**
 * 2024・2025年の歌詞ページの外枠です。歌詞原稿（各page.tsxの中身）には触れず、
 * 周りの案内（現在位置・前後の歌詞・曲リストへ戻る）だけを全年度共通の部品で用意します。
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
    <ClientWrapper world={worldOfYear(year)}>
      <LyricSheet
        album={{ year: album.year, title: album.title, artwork: album.artwork }}
        trackListHref={`${album.detailPath}#archive-tracks`}
        items={lyricItemsOfYear(year)}
        backLabel="曲リストへ戻る"
      >
        <div className="lyric-legacy">{children}</div>
      </LyricSheet>
    </ClientWrapper>
  );
}
