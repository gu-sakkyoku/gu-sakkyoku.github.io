import type { Metadata } from "next";
import { Banner } from "@astryxdesign/core/Banner";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import ClientWrapper from "../../component/ClientWrapper";
import DownloadArchive from "../../component/DownloadArchive";
import { albums } from "../../data/albums";

export const metadata: Metadata = {
  // タブの表示を、ページの見出し・メニューの項目名（アルバムダウンロード）とそろえます。
  title: "アルバムダウンロード | 群馬大学作曲部",
  description: "群馬大学作曲部のダウンロードカードからアルバムを受け取るページです。",
  // カードから訪れるページなので、既存の歌詞ページのSEOには触れず、このページだけ検索対象外にします。
  robots: { index: false, follow: false },
};

/**
 * 毎年変わらない共通QRの行き先です。年度の選択・コード入力・認証は DownloadArchive が受け持ちます。
 * 会場の回線でもすぐ使えるよう、大きな画像や動画は置きません。
 */
export default function DownloadPage() {
  return (
    <ClientWrapper world="tansan">
      <VStack gap={6} className="site-container download-page">
        <VStack as="header" gap={3}>
          <Heading level={1}>アルバムダウンロード</Heading>
          <Text as="p">
            カードに印刷された年度を選び、そのカードのダウンロードコードを入力してください。
          </Text>
        </VStack>

        {/* 年度はデータから生成。翌年も情報を追加するだけで入口が増えます。 */}
        <DownloadArchive albums={albums} />

        <noscript>
          <Banner status="warning" title="ダウンロードにはJavaScriptが必要です。" collapsible={false} />
        </noscript>

        <Text as="p" type="supporting">
          ダウンロードできない場合は、時間をおいて再度お試しください。お困りの際は作曲部の
          <Link href="mailto:gusakkyoku@gmail.com" hasUnderline>メール（gusakkyoku@gmail.com）</Link>
          へご連絡ください。
        </Text>
      </VStack>
    </ClientWrapper>
  );
}
