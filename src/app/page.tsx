import type { Metadata } from "next";
import HomeContent from "../component/HomeContent";
import { contactNavigation } from "../data/navigation";
import { organizationSchema, site, websiteSchema } from "../data/site";

// 連絡先のうち、公式アカウント（X・YouTube）だけを団体の sameAs に使います。
const officialAccounts = contactNavigation.map((item) => item.href).filter((href) => href.startsWith("https://"));

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
      {/* 作曲部（団体）と公式X・YouTubeのつながり。旧サイトではなくこのサイトが公式だと伝えるためのものです。 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema(officialAccounts)).replace(/</g, "\\u003c"),
        }}
      />
      <HomeContent />
    </>
  );
}
