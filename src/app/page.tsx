import type { Metadata } from "next";
import HomeContent from "../component/HomeContent";

const homeUrl = "https://gu-sakkyoku.github.io/";

// トップだけを正規URLに指定します。共通layoutで指定すると歌詞ページまで
// トップの重複ページとみなされるため、ここで設定します。
export const metadata: Metadata = {
  alternates: { canonical: homeUrl },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "群馬大学作曲部",
  alternateName: "群大作曲部",
  url: homeUrl,
};

export default function Home() {
  return (
    <>
      {/* Googleにサイト名を伝えるため、トップの静的HTMLにだけ記載します。 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
      <HomeContent />
    </>
  );
}
