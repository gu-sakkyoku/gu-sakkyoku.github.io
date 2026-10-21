/**
 * 「炭酸予報」の公開用作品情報です。
 * 公式クロスフェードの概要欄（2026-10-20公開）を出典にしています。
 * https://www.youtube.com/watch?v=FH9i9gJuH8Q
 * トップ・作品ページ・ダウンロード一覧で同じ曲名を使うため、ここへ集約します。
 * 歌詞本文は別ファイルに分け、音源配信用Workerへ取り込まないようにしています。
 */
export type AlbumEvent = {
  name: string;
  date: string;
  dateLabel: string;
  venue: string;
  space: string;
  price: string;
  url: string;
};

type Track = { title: string; artist: string; lyricSlug?: string };

const discs: { name: string; tracks: Track[] }[] = [
  {
    name: "Disc 1",
    tracks: [
      { title: "⋆˚⊹Sp4rk71n9⋆.˚₊✩°｡⋆", artist: "Miriha" },
      { title: "Dissolve(feat.符色)", artist: "C7" },
      { title: "夕立のリリカルセンチメント", artist: "37SH" },
      { title: "Tidal Cascade", artist: "astraire" },
      { title: "春風のレクイエム―君を消した空の下で―", artist: "the endo", lyricSlug: "harukaze" },
      { title: "眠る白百合 feat.知声", artist: "花曇＆Canopus", lyricSlug: "nemuru-shirayuri" },
      { title: "マギカリズム feat.花隈千冬", artist: "ムギスタジオ", lyricSlug: "magicarhythm" },
      { title: "夢の続きを追い駆けて", artist: "創駄" },
    ],
  },
  {
    name: "Disc 2",
    tracks: [
      { title: "Hater feat.知声", artist: "Harumaki", lyricSlug: "hater" },
      { title: "タラレバ", artist: "kra＆MiMN", lyricSlug: "tarareba" },
      { title: "夜なべは朝飯前", artist: "コロッケクリームガニ" },
      { title: "Midnight hub", artist: "Howl" },
      { title: "弦楽四重奏曲第2番ロ短調-大学生活-", artist: "創駄" },
      { title: "Sunbathing", artist: "Karin" },
      { title: "#ʜʏᴘᴇᴅ4₍ᐢ..ᐢ₎", artist: "Miriha" },
      { title: "pool", artist: "szk" },
      { title: "You Need a -5 dB Clipper on the Master", artist: "vsBeppu" },
      { title: "Magical Girls' Nightmare  It's Illusion or Grim Reality", artist: "天鴞 a.k.a. 37SH" },
    ],
  },
];

export const album2026 = {
  year: 2026,
  title: "炭酸予報",
  detailPath: "/TansanYohou/",
  artwork: "/cover2026-tansan-yohou.png",
  crossfadeVideoId: "FH9i9gJuH8Q",
  // 終了後に告知を取り下げる場合はeventを使う表示箇所を調整してください。
  // 閲覧時の時計で切り替えず、日付を明示した静的な「出展情報」として掲載します。
  event: {
    name: "M3-2026秋",
    date: "2026-10-25",
    dateLabel: "2026年10月25日（日）",
    venue: "東京流通センター",
    space: "第二展示場 1階 お-15b",
    price: "1,000円",
    url: "https://www.m3net.jp/",
  } satisfies AlbumEvent,
  discs,
  credits: [
    { role: "Mastering", name: "Miriha" },
    { role: "Illust", name: "szk" },
    { role: "Movie", name: "鯨の卵" },
  ],
};
