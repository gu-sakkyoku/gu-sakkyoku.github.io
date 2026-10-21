/**
 * 公開用のサイト情報です。ログイン情報やダウンロードコードは置きません。
 * Googleのサイト名・SNS共有時の名前・トップの英語表記をここで揃えます。
 * 日本語のページタイトルは別に残し、「群馬大学作曲部」で探せるようにします。
 */
export const site = {
  name: "GU sakkyoku",
  title: "群馬大学作曲部 | 公式サイト",
  url: "https://gu-sakkyoku.github.io/",
  description: "群馬大学作曲部の公式サイト。オリジナルアルバム「炭酸予報」「Horoscope」「虹色memory」の作品情報・歌詞、ダウンロードカードの案内を掲載しています。",
  // 2026-10-21からの正式ロゴ。白いヘッダーには支給された青色の透過版を使います。
  // 画像を差し替える際はlogoSizeも確認し、検索用アイコンを再生成してください。
  logo: "/site-logo-blue.png",
  logoSize: 2084,
  icon: "/site-icon.png",
  appleIcon: "/apple-touch-icon.png",
};

// サイト名は組織アカウントの名前とは別です。Googleへの希望名をトップだけで伝えます。
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  alternateName: ["群馬大学作曲部", "群大作曲部"],
  url: site.url,
};
