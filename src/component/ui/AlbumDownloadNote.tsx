import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import type { Album } from "../../data/albums";
import AppIcon from "./AppIcon";

/**
 * 作品ページの下に置く、ダウンロードカードの案内です。配信状態の文は年度データから決まります。
 * コードの入力はここでは受け付けず、共通のダウンロードページ（/download/）へ案内します。
 */
export default function AlbumDownloadNote({ album }: { album: Album }) {
  return (
    <Card padding={6} elevation="low" className="album-download-note" data-reveal>
      <VStack as="aside" aria-label="ダウンロードカードのご案内" gap={5} hAlign="start">
        <Text as="p" weight="medium">
          {album.downloadEnabled
            ? "ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。"
            : album.unavailableReason === "paused"
              ? "現在、ダウンロードを一時停止しています。修正版の準備ができ次第、再開します。"
              : "ダウンロードは準備中です。公開までしばらくお待ちください。"}
        </Text>
        <Button
          label={`${album.year}年の音源を受け取る`}
          href={`/download/#album-${album.year}`}
          variant="primary"
          size="lg"
          icon={<AppIcon name="download" />}
        />
      </VStack>
    </Card>
  );
}
