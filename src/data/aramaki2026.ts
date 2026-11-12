/**
 * 2026年 荒牧祭（群馬大学の学園祭）の作曲部の出演・物販情報です。
 * 出典は作曲部が作成した3枚のポスター（野外ステージ、DJステージ、物販情報）です。
 * 出演者名・曲名・時刻・価格・注意書きは、ポスターの表記をそのまま写しています。推測で補いません。
 * 学園祭が終わったら、トップとメニューの案内を止めるために showOnHome を false にしてください。
 */

export type DjSlot = { start: string; end: string; name: string };
/** ポスター画像。src は public/ からの位置。credit はデザインした人の表記（分かっているものだけ）。 */
export type Poster = { src: string; alt: string; credit?: string };
export type DjDay = { label: string; date: string; dateLabel: string; start: string; end: string; slots: DjSlot[] };

export const aramaki2026 = {
  name: "荒牧祭",
  year: 2026,
  path: "/aramakisai2026/",
  /** トップページの案内とメニューの項目を出すかどうか。閲覧時の日付では切り替えません。 */
  showOnHome: true,
  dateRangeLabel: "11/14（土）・15（日）",

  campus: {
    name: "群馬大学荒牧キャンパス",
    address: "群馬県前橋市荒牧町4-2",
  },

  /** 野外ステージ（ポスター「荒牧祭 作曲部」より）。出演順のみで、個別の時刻は掲載されていません。 */
  outdoorStage: {
    name: "野外ステージ",
    date: "2026-11-14",
    dateLabel: "2026.11.14 sat",
    start: "14:20",
    end: "15:20",
    poster: {
      src: "/aramaki2026/poster-stage.jpg",
      alt: "作曲部 荒牧祭 野外ステージのポスター（2026.11.14 14:20-15:20、出演順のタイムテーブル）",
    } as Poster,
    acts: [
      { name: "弦楽隊", song: "弦楽四重奏第二番ロ短調 大学生活" },
      { name: "群馬を副首都にする会", song: "群馬を副首都にするソング" },
      { name: "ぎりぎり^^", song: "ふりのふり" },
      // 「タラレバ」は2026年アルバム「炭酸予報」の収録曲で、歌詞ページがあります。
      { name: "赤貝", song: "タラレバ", lyricPath: "/TansanYohou/tarareba/" },
      { name: "例えばしめじ", song: "🌸←桜" },
      { name: "言うなれば緑", song: "ほんとはね" },
    ] as { name: string; song: string; lyricPath?: string }[],
  },

  /** 屋内のDJステージ（ポスター「群馬大学作曲部 荒牧祭DJステージ」より）。アルバムの販売もここで行います。 */
  djStage: {
    name: "DJステージ",
    room: "三号館二階 GC218",
    poster: {
      src: "/aramaki2026/poster-dj.png",
      alt: "群馬大学作曲部 荒牧祭DJステージのポスター（11/14・15のタイムテーブル、音圧と光刺激の注意、会場）",
      credit: "鯨の卵",
    } as Poster,
    days: [
      {
        label: "DAY 1",
        date: "2026-11-14",
        dateLabel: "2026.11.14 Sat",
        start: "11:30",
        end: "17:30",
        slots: [
          { start: "11:30", end: "12:30", name: "Howl" },
          { start: "12:30", end: "13:30", name: "Taiyo" },
          { start: "13:30", end: "14:30", name: "37SH a.k.a. 天鴞" },
          { start: "14:30", end: "15:30", name: "体験会" },
          { start: "15:30", end: "16:30", name: "na" },
          { start: "17:00", end: "17:30", name: "別部" },
        ],
      },
      {
        label: "DAY 2",
        date: "2026-11-15",
        dateLabel: "2026.11.15 Sun",
        start: "11:30",
        end: "16:30",
        slots: [
          { start: "11:30", end: "12:30", name: "Miriha" },
          { start: "12:30", end: "13:30", name: "astraire" },
          { start: "13:30", end: "14:30", name: "hosi" },
          { start: "14:30", end: "15:30", name: "ムギスタジオ" },
          { start: "15:30", end: "16:30", name: "NΛЯURU" },
        ],
      },
    ] as DjDay[],
    /** ポスターの注意書き（原文のまま）。 */
    cautions: [
      {
        title: "音量注意",
        text: "本イベントでは、演出の都合上、非常に大きな音量で音楽を再生する場合があります。音量によって耳に負担がかかる可能性がありますので、体調や聴覚に不安のある方は十分にご注意ください。また、必要に応じて耳栓をご使用いただくなど、ご自身の聴覚を保護する対策をお願いいたします。",
      },
      {
        title: "光刺激に関する注意",
        text: "本イベントでは、映像演出として点滅する光や急激に変化する映像表現を使用する場合があります。光刺激に敏感な方や、光過敏性発作の既往がある方は、十分にご注意ください。",
      },
    ],
  },

  /** 物販（ポスター「群馬大学作曲部 物販情報」より）。DJステージの会場で販売します。 */
  merch: {
    poster: {
      src: "/aramaki2026/poster-merch.png",
      alt: "群馬大学作曲部 物販情報のポスター（3作品のアルバムCD・ダウンロードカードの価格とお得情報）",
      credit: "鯨の卵",
    } as Poster,
    albumYears: [2024, 2025, 2026],
    prices: [
      { item: "アルバムCD", price: "500円" },
      { item: "ダウンロードカード", price: "200円" },
    ],
    deals: [
      { item: "DLカード3種類購入で", price: "500円" },
      { item: "CD3種類購入で", price: "1000円" },
    ],
  },
};
