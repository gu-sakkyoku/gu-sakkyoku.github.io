import type { ReactNode } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@astryxdesign/core/Breadcrumbs";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import type { LyricItem } from "../../lib/lyric-items";
import AppIcon from "./AppIcon";
import Artwork from "./Artwork";
import { LyricPager, LyricPosition, LyricSizeControl } from "./LyricNav";

/**
 * 全年度共通の歌詞ページの枠です。歌詞の文字・改行には触れず、周りの案内だけを受け持ちます。
 * 上から「現在位置 → 曲と作品の情報 → 歌詞 → 次／前の歌詞 → 戻る・ダウンロード」の順です。
 * headingを渡すと曲名（h1）と作者をここで表示します。2024・2025年の歌詞ページは、
 * 本文の中に元からh1があるので、headingは渡しません。
 */
export default function LyricSheet({
  album,
  trackListHref,
  items,
  heading,
  backLabel,
  children,
}: {
  album: { year: number; title: string; artwork: string };
  /** 作品ページの曲リストの位置（例：/TansanYohou/#track-list）。 */
  trackListHref: string;
  /** この作品で歌詞を掲載している曲の一覧（収録順）。 */
  items: LyricItem[];
  heading?: { title: string; artist: string };
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <VStack gap={6} className="lyric-page site-container">
      <Breadcrumbs label="現在位置" variant="supporting">
        <BreadcrumbItem href="/">トップ</BreadcrumbItem>
        <BreadcrumbItem href={trackListHref}>{album.title}</BreadcrumbItem>
        <BreadcrumbItem isCurrent>{heading?.title ?? "歌詞"}</BreadcrumbItem>
      </Breadcrumbs>

      <HStack as="header" gap={4} vAlign="center" wrap="wrap">
        <Artwork src={album.artwork} alt={heading ? `${album.title}のアルバムジャケット` : ""} sizes="72px" className="lyric-masthead-art" />
        <VStack gap={1} className="lyric-masthead-copy">
          {heading ? (
            <>
              <Heading level={1}>{heading.title}</Heading>
              <Text as="p" type="large" color="secondary">{heading.artist}</Text>
            </>
          ) : (
            <Text as="p" weight="bold">{album.title}（{album.year}）歌詞</Text>
          )}
          <LyricPosition items={items} />
        </VStack>
        {/* 文字サイズの切り替えが後から現れても、歌詞の位置が動かないよう高さを確保します。 */}
        <HStack hAlign="end" minHeight={36} width="100%">
          <LyricSizeControl />
        </HStack>
      </HStack>

      <article className="lyric-sheet">{children}</article>

      <LyricPager items={items} />

      <HStack as="nav" aria-label="歌詞を読み終えた方へ" gap={4} vAlign="center" wrap="wrap">
        <Button label={backLabel} href={trackListHref} variant="secondary" size="lg" icon={<AppIcon name="listMusic" />} />
        <Link href={`/download/#album-${album.year}`} isStandalone hasUnderline>ダウンロードページへ</Link>
      </HStack>
    </VStack>
  );
}
