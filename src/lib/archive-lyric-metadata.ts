import type { Metadata } from "next";
import { archiveAlbums } from "../data/archiveAlbums";
import { site } from "../data/site";
import { lyricItemsOfYear } from "./lyric-items";

/**
 * 2024・2025年の歌詞ページ（URLごとに1ファイル）の、検索・共有用の情報です。
 * 曲名とアルバム名は曲リストのデータから取るので、各ページの歌詞原稿には何も書き足しません。
 * 2026年の歌詞ページ（src/app/TansanYohou/[song]/page.tsx）と同じ書き方にそろえています。
 */
export function archiveLyricMetadata(year: 2024 | 2025, path: string): Metadata {
  const album = archiveAlbums[year];
  const item = lyricItemsOfYear(year).find((lyric) => lyric.href === path);
  if (!item) throw new Error(`歌詞ページ ${path} が ${year} 年の曲リストにありません。`);
  const title = `${item.title} 歌詞 | ${album.title} | ${site.name}`;
  const description = `${site.name}「${album.title}」（${year}年）収録「${item.title}」の歌詞ページです。`;
  const images = album.artwork ? [album.artwork] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images },
    twitter: { title, description, images },
  };
}
