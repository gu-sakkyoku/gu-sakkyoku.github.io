/**
 * 公開用のサイト情報です。ログイン情報やダウンロードコードは置きません。
 * Googleのサイト名・SNS共有時の名前・ページタイトル・トップの見出しを、すべて「群馬大学作曲部」に揃えます。
 * 名前が場所ごとに違うと、Googleは希望名を採用せず、github.io 全体の名前（GitHub）を表示します（2026-11に実際に発生）。
 */
export const site = {
  name: "群馬大学作曲部",
  title: "群馬大学作曲部 | 公式サイト",
  url: "https://gu-sakkyoku.github.io/",
  description: "群馬大学作曲部の公式サイト。オリジナルアルバム「炭酸予報」「Horoscope」「虹色memory」の作品情報・歌詞、ダウンロードカードの案内を掲載しています。",
  // 2026-10-21からの正式ロゴ。白いヘッダーには支給された青色の透過版を使います。
  // 画像を差し替える際はlogoSizeも確認し、検索用アイコンを再生成してください。
  logo: "/site-logo-blue.png",
  logoSize: 2084,
  // 暗い背景（Horoscope）のヘッダー用に支給された白色版。形は同じで、色だけが違います。
  logoOnDark: "/site-logo-white.png",
  logoOnDarkSize: 4167,
  icon: "/site-icon.png",
  appleIcon: "/apple-touch-icon.png",
};

/*
 * Googleへの希望サイト名（トップにだけ載せます）。alternateName は希望の高い順です。
 * 最後のサイトのアドレスは、どの名前も採用されなかったときの最後の候補として、Googleの案内どおりに入れています。
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: ["GU sakkyoku", "群大作曲部", "gu-sakkyoku.github.io"],
  url: site.url,
};

/*
 * 作曲部（団体）の情報（トップにだけ載せます）。公式のX・YouTubeを sameAs で結び、
 * 「この団体の公式サイトはここ」とGoogleへ伝えます。リンク先は連絡先と同じ src/data/navigation.ts の値です。
 */
export function organizationSchema(sameAs: readonly string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: ["GU sakkyoku", "群大作曲部"],
    url: site.url,
    logo: new URL(site.logo, site.url).toString(),
    sameAs: [...sameAs],
  };
}
