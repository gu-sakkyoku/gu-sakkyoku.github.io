import { album2026, type AlbumEvent } from "./album2026.ts";

/**
 * ダウンロード一覧の唯一の年度データです。
 * 新しい年を公開するときは、まずこの配列に1件追加してください。
 * r2Keyは秘密ではありませんが、R2バケットそのものは非公開のまま運用します。
 */
export type Album = {
  year: number;
  title: string;
  artwork?: string;
  detailPath?: string;
  crossfadeVideoId?: string;
  event?: AlbumEvent;
  downloadEnabled: boolean;
  // 既に公開した作品の配布停止を、まだ未公開の「Coming Soon」と区別する表示用の理由です。
  unavailableReason?: "paused";
  r2Key?: string;
  discs: { name: string; tracks: string[] }[];
};

export const albums: Album[] = [
  {
    year: 2026,
    title: album2026.title,
    // タイトル入りの新ジャケット。旧画像と別名にして、ブラウザのキャッシュ残りを避けます。
    artwork: album2026.artwork,
    detailPath: album2026.detailPath,
    crossfadeVideoId: album2026.crossfadeVideoId,
    event: album2026.event,
    // 2026-10-09: 修正版を同じR2キーへ差し替え、全量のSHA-256一致を確認して配信を再開します。
    // ZIPの更新とコードの更新は別の操作です。印刷済みの年度コード・QR・Secretは変更しません。
    downloadEnabled: true,
    r2Key: "albums/2026.zip",
    // 詳細ページと同じ正式曲目から生成します。歌詞本文はここへ読み込みません。
    discs: album2026.discs.map((disc) => ({ name: disc.name, tracks: disc.tracks.map((track) => track.title) })),
  },
  {
    year: 2025,
    title: "Horoscope",
    artwork: "/cover1.png",
    detailPath: "/Horoscope/",
    downloadEnabled: true,
    r2Key: "albums/2025.zip",
    discs: [
      {
        name: "Disc 1",
        tracks: [
          "フワっと！スペースえすけ～ぷ！！ feat. 知声, 花隈千冬",
          "流星を詠む",
          "テザー feat. 花隈千冬",
          "ブラックホール、午後ティーを添えて",
          "Lift Off!",
          "Into the Horoscope",
          "Negative Infinite Space",
          "Starlight",
          "c89de",
          "Assault Star",
          "沈黙の衛星と虚構における記憶の硝子",
          "フェード feat. 音街ウナ",
          "星くずの小瓶",
          "Amairo Trail",
        ],
      },
      {
        name: "Disc 2",
        tracks: [
          "The signal in the noise",
          "can't ESCAPE!!! feat. 雨歌エル",
          "招雷降神、CUCUMBER",
          "弦楽四重奏曲第1番ホ長調-入学祝い-",
          "青空",
          "もしもあなたと",
          "０３：３９",
          "ため息は空に溶けた feat. 花隈千冬",
          "クチグルマジャーニー",
        ],
      },
    ],
  },
  {
    year: 2024,
    title: "虹色memory",
    artwork: "/cover31.png",
    detailPath: "/Nijiiro/",
    downloadEnabled: true,
    r2Key: "albums/2024.zip",
    discs: [
      {
        name: "Track List",
        tracks: [
          "曇りのち晴れ feat. 音街ウナ",
          "僕らの夏 feat. 可不",
          "Cloud Border",
          "ArcTech",
          "ギュっと！バーチャルどり～む！！ feat. 可不&花隈千冬",
          "School Addiction",
          "青春MIXブレンディング feat. No.7&ナクモ",
          "Hopen Campus",
          "レッツゴー青春",
          "水平線上の在処",
          "軌跡",
        ],
      },
    ],
  },
];
