import type { Metadata } from "next";
import HomeContent from "../component/HomeContent";
import { site, websiteSchema } from "../data/site";

// トップだけを正規URLに指定します。共通layoutで指定すると歌詞ページまで
// トップの重複ページとみなされるため、ここで設定します。
export const metadata: Metadata = {
  alternates: { canonical: site.url },
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
