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
  downloadEnabled: boolean;
  r2Key?: string;
  discs: { name: string; tracks: string[] }[];
};

export const albums: Album[] = [
  {
    year: 2026,
    title: "2026年のアルバム",
    artwork: "/cover2026.webp",
    // ジャケットだけ先に公開。音源とコードの準備ができるまでダウンロードは無効のままにします。
    downloadEnabled: false,
    discs: [],
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
