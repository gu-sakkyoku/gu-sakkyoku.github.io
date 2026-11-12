import { albums } from "./albums.ts";
import { aramaki2026 } from "./aramaki2026.ts";

/**
 * ヘッダー・スマホのメニュー・フッターで共通に使う行き先です。
 * 作品は年度データ（albums.ts）から作るので、新しい年度を追加すればメニューにも自動で並びます。
 */
export const homeNavigation = { href: "/", label: "トップページ" };
export const downloadNavigation = { href: "/download/", label: "ダウンロード" };

export const albumNavigation = [...albums]
  .sort((a, b) => b.year - a.year)
  .flatMap((album) =>
    album.detailPath
      ? [{ href: album.detailPath, label: album.title, year: album.year, artwork: album.artwork }]
      : [],
  );

/** 学園祭など期間限定の特設ページ。表示中だけメニューの先頭に並べます。 */
export const eventNavigation = aramaki2026.showOnHome
  ? [{ href: aramaki2026.path, label: aramaki2026.name }]
  : [];

/** 部が公開している連絡先はこの3つだけです。追加・変更するときはここを直します。 */
export const contactNavigation = [
  { href: "mailto:gusakkyoku@gmail.com", label: "gusakkyoku@gmail.com", kind: "お問い合わせ" },
  { href: "https://x.com/GUsakkyoku", label: "@GUsakkyoku", kind: "公式X（DM）" },
  { href: "https://www.youtube.com/@gusakkyoku", label: "群馬大学作曲部のYouTubeチャンネル", kind: "公式YouTube" },
] as const;

/** 歌詞ページ（/Horoscope/fuwa/ など）でも、その作品のメニュー項目を「現在地」にします。 */
export function isCurrentPath(pathname: string, href: string) {
  const normalize = (value: string) => (value.endsWith("/") ? value : `${value}/`);
  const current = normalize(pathname);
  const target = normalize(href);
  return target === "/" ? current === "/" : current.startsWith(target);
}
