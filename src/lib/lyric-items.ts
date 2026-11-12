import { album2026 } from "../data/album2026.ts";
import { archiveAlbums } from "../data/archiveAlbums.ts";

/** 歌詞ページ1件ぶんの案内情報です。曲順はアルバムの収録順のままにします。 */
export type LyricItem = {
  href: string;
  title: string;
  /** 作者などの表記。データに書かれた文字列をそのまま使います。 */
  credit?: string;
  /** 「Disc 1・5曲目」のような、アルバム内での位置。 */
  position: string;
};

/** その年度で歌詞を掲載している曲を、収録順に並べて返します。前後の歌詞への移動に使います。 */
export function lyricItemsOfYear(year: number): LyricItem[] {
  if (year === album2026.year) {
    return album2026.discs.flatMap((disc) =>
      disc.tracks.flatMap((track, index) =>
        track.lyricSlug
          ? [{
              href: `${album2026.detailPath}${track.lyricSlug}/`,
              title: track.title,
              credit: track.artist,
              position: `${disc.name}・${index + 1}曲目`,
            }]
          : [],
      ),
    );
  }
  const archive = year === 2025 ? archiveAlbums[2025] : year === 2024 ? archiveAlbums[2024] : undefined;
  if (!archive) return [];
  return archive.discs.flatMap((disc) =>
    disc.tracks.flatMap((track, index) =>
      track.lyricPath
        ? [{
            href: track.lyricPath,
            title: track.title,
            credit: track.credits?.[0],
            position: `${disc.name}・${index + 1}曲目`,
          }]
        : [],
    ),
  );
}
