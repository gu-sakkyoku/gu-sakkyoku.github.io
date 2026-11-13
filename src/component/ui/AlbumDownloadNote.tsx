import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { MediaTheme } from "@astryxdesign/core/theme";
import { VStack } from "@astryxdesign/core/VStack";
import type { Album } from "../../data/albums";
import { worldOfYear } from "../../data/worlds";
import AppIcon from "./AppIcon";

// 帯の地色に合わせた文字の明るさ。炭酸予報は濃い空の青、Horoscopeは夜空なので白い文字、虹色memoryは方眼の紙なので通常の文字。
const bandText = { tansan: "dark", horoscope: "dark", nijiiro: "off" } as const;

/**
 * 作品ページの下に置く、ダウンロードカードの案内です。配信状態の文は年度データから決まります。
 * 画面の横幅いっぱいの帯（作品ごとのテーマの Section variant="band"）にします。
 * コードの入力はここでは受け付けず、共通のダウンロードページ（/download/）へ案内します。
 */
export default function AlbumDownloadNote({ album }: { album: Album }) {
  const headingId = `download-note-${album.year}`;
  return (
    <Section
      variant="band"
      padding={0}
      paddingBlock={10}
      role="complementary"
      aria-labelledby={headingId}
      className="site-section album-download-note"
    >
      <MediaTheme mode={bandText[worldOfYear(album.year)]}>
        <Grid columns={{ minWidth: 280, max: 2 }} gap={6} align="center" className="site-container album-download-inner">
          <VStack gap={3} hAlign="start">
            <Heading level={2} id={headingId}>ダウンロードカード</Heading>
            <Text as="p">
              {album.downloadEnabled
                ? "ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。"
                : album.unavailableReason === "paused"
                  ? "現在、ダウンロードを一時停止しています。修正版の準備ができ次第、再開します。"
                  : "ダウンロードは準備中です。公開までしばらくお待ちください。"}
            </Text>
          </VStack>
          <VStack hAlign="start" className="album-download-action">
            <Button
              label={`${album.year}年の音源を受け取る`}
              href={`/download/#album-${album.year}`}
              variant="primary"
              size="lg"
              icon={<AppIcon name="download" />}
            />
          </VStack>
        </Grid>
      </MediaTheme>
    </Section>
  );
}
