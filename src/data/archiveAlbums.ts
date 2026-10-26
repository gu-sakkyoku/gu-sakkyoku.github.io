import { albums } from "./albums.ts";

export type ArchiveTheme = "cosmos" | "rainbow";
type TrackNote = { credits?: string[]; lyricPath?: string; artwork?: string };
export type ArchiveAlbum = {
  year: 2024 | 2025;
  ordinal: 1 | 2;
  theme: ArchiveTheme;
  title: string;
  artwork: string;
  detailPath: string;
  crossfadeVideoId: string;
  discs: { name: string; tracks: ({ title: string } & TrackNote)[] }[];
};

/**
 * 旧作品ページに掲載していたクレジットと歌詞URLです。表記を勝手に補完しません。
 * 曲名・曲順・枚数はダウンロード一覧のalbums.tsを参照し、食い違いを防ぎます。
 * 元々作者名が載っていなかった2024年の曲に、推測の名前は追加しません。
 */
const horoscopeNotes: TrackNote[][] = [
  [
    {
      credits: ["music・lyrics/Solar Systems"],
      lyricPath: "/Horoscope/fuwa/",
      artwork: "/gamoji.png",
    },
    { credits: ["music/創駄"] },
    { credits: ["music・lyrics/ムギスタジオ"], lyricPath: "/Horoscope/teza/" },
    { credits: ["music/♮まき6"] },
    { credits: ["music/おむすび"] },
    { credits: ["music/コロッケクリームガニ"] },
    { credits: ["music/C7"] },
    { credits: ["music/かたや"] },
    { credits: ["music/szk"] },
    { credits: ["music/astraire"] },
    { credits: ["music/Noζris"] },
    { credits: ["music・lyrics/おちゃ2"], lyricPath: "/Horoscope/fead/" },
    {
      credits: ["music・lyrics/花曇,Canopus"],
      lyricPath: "/Horoscope/hoshikuzu/",
    },
    { credits: ["music/Miriha"] },
  ],
  [
    { credits: ["music/Miriha"] },
    { credits: ["music・lyrics/おちゃ2"], lyricPath: "/Horoscope/cant/" },
    { credits: ["music/♮まき6"] },
    { credits: ["music/創駄"] },
    { credits: ["music/梨子"] },
    { credits: ["music・lyrics/the endo"], lyricPath: "/Horoscope/mosimo/" },
    { credits: ["music/コロッケクリームガニ"] },
    {
      credits: ["music・lyrics/ムギスタジオ"],
      lyricPath: "/Horoscope/tameiki/",
    },
    {
      credits: ["music・lyrics/コロッケクリームガニ", "vocal/Melty kNightmare"],
      lyricPath: "/Horoscope/melt/",
    },
  ],
];

function createArchiveAlbum(
  year: 2024 | 2025,
  theme: ArchiveTheme,
  ordinal: 1 | 2,
  videoId: string,
): ArchiveAlbum {
  const original = albums.find((album) => album.year === year);
  if (!original?.artwork || !original.detailPath)
    throw new Error("Archive album metadata is missing");
  // 曲順変更で別の曲へクレジットがずれることを防ぐため、食い違いはビルド時に止めます。
  if (
    year === 2025 &&
    (original.discs.length !== horoscopeNotes.length ||
      original.discs.some(
        (disc, index) => disc.tracks.length !== horoscopeNotes[index].length,
      ))
  ) {
    throw new Error("Archive track credits do not match the track list");
  }
  return {
    year,
    theme,
    ordinal,
    title: original.title,
    artwork: original.artwork,
    detailPath: original.detailPath,
    crossfadeVideoId: videoId,
    discs: original.discs.map((disc, discIndex) => ({
      name: disc.name,
      tracks: disc.tracks.map((title, trackIndex) => ({
        title,
        ...(year === 2025
          ? horoscopeNotes[discIndex][trackIndex]
          : trackIndex === 0
            ? { lyricPath: "/Nijiiro/kumori/" }
            : {}),
      })),
    })),
  };
}

// 既存ページに埋め込まれていた同じ動画です。新しい動画や自動再生は追加しません。
export const archiveAlbums = {
  2025: createArchiveAlbum(2025, "cosmos", 2, "iPNjS8T7ZEM"),
  2024: createArchiveAlbum(2024, "rainbow", 1, "arK-hOelO2M"),
};
