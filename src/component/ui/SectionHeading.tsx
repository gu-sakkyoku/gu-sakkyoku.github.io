import type { ReactNode } from "react";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";

/**
 * ページ内の区切りの見出し（h2）です。書体・色は作品ごとのテーマから決まります。
 * 飾りの線や記号は、作品ごとのCSS（src/app/worlds/）が .section-heading に付けます。
 */
export default function SectionHeading({
  id,
  children,
  note,
}: {
  id: string;
  children: ReactNode;
  /** 見出しの下に添える短い説明（曲数など）。 */
  note?: ReactNode;
}) {
  return (
    <VStack gap={2} className="section-heading">
      <Heading level={2} type="display-3" id={id}>{children}</Heading>
      {note && <Text as="p" type="supporting">{note}</Text>}
    </VStack>
  );
}
