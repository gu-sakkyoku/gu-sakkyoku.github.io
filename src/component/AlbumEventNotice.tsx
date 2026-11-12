import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import { VStack } from "@astryxdesign/core/VStack";
import type { AlbumEvent } from "../data/album2026";

/**
 * イベントの出展情報です。日付・会場・価格は作品データから受け取り、ここには直接書きません。
 * 閲覧時の時計で表示を切り替えず、日付を明示した記録として掲載します。
 */
export default function AlbumEventNotice({ event }: { event: AlbumEvent }) {
  return (
    <VStack as="section" aria-label={`${event.name} 出展情報`} gap={4} hAlign="start">
      {/* イベント名と「出展情報」をそれぞれまとまりにし、末尾1文字だけの改行を防ぎます。 */}
      <Heading level={3}>
        <span className="inline-block">{event.name}</span>{" "}<span className="inline-block">出展情報</span>
      </Heading>
      <MetadataList label={{ position: "start", width: "5.5rem" }}>
        <MetadataListItem label="開催日"><time dateTime={event.date}>{event.dateLabel}</time></MetadataListItem>
        <MetadataListItem label="会場">{event.venue}</MetadataListItem>
        <MetadataListItem label="スペース">{event.space}</MetadataListItem>
        <MetadataListItem label="頒布価格">{event.price}</MetadataListItem>
      </MetadataList>
      <Link href={event.url} isStandalone hasUnderline>M3公式サイト</Link>
    </VStack>
  );
}
