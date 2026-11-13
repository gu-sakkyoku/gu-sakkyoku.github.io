import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

/**
 * DJステージのポスターにある「音圧警告ラベル」を、画面用に組み直した飾りです。
 * 文字はポスターに印刷されている表記だけを使い、新しい宣伝文句は足しません。
 * 同じ注意の本文は、ページの「音量注意」「光刺激に関する注意」で読めるので、この飾りは読み上げません。
 */
export default function CautionLabel({ className = "" }: { className?: string }) {
  return (
    <HStack gap={4} vAlign="center" wrap="wrap" className={`caution-label ${className}`} aria-hidden="true">
      <VStack gap={1} className="caution-label-main">
        <Text type="time" className="caution-label-head">⚠ CAUTION ⚠ 01 SOUND PRESSURE WARNING</Text>
        <Text className="caution-label-big">音圧注意</Text>
        <HStack gap={4} wrap="wrap">
          <Text type="time" className="caution-label-sub">HIGH SOUND PRESSURE</Text>
          <Text type="time" className="caution-label-sub">VER.2026</Text>
        </HStack>
      </VStack>
      <VStack gap={1} className="caution-label-meter">
        <Text type="time" className="caution-label-sub">NOISE WARNING LABEL</Text>
        <Text className="caution-label-name">音圧警告ラベル 01</Text>
      </VStack>
    </HStack>
  );
}
