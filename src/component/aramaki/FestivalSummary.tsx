import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { aramaki2026 } from "../../data/aramaki2026";
import AppIcon from "../ui/AppIcon";

const { outdoorStage, djStage, merch } = aramaki2026;
const dayLabels: Record<string, string> = { "2026-11-14": "11/14（土）", "2026-11-15": "11/15（日）" };

/**
 * 荒牧祭の「いつ・どこで・何を売るか」を、3行の一覧にまとめたものです。
 * 特設ページの冒頭とトップページの最上部の両方で使います（どちらも荒牧祭のテーマの中に置きます）。
 * 内容はすべて src/data/aramaki2026.ts から読みます。各行は、特設ページの該当する場所へのリンクです。
 * linkBase は行のリンク先の前に付ける位置です（特設ページ内では ""、トップからは特設ページのパス）。
 */
export default function FestivalSummary({ linkBase = "" }: { linkBase?: string }) {
  const rows = [
    {
      href: `${linkBase}#outdoor-stage`,
      label: outdoorStage.name,
      lines: [`${dayLabels[outdoorStage.date]} ${outdoorStage.start}–${outdoorStage.end}`],
    },
    {
      href: `${linkBase}#dj-stage`,
      label: `${djStage.name}（${djStage.room}）`,
      lines: djStage.days.map((day) => `${dayLabels[day.date]} ${day.start}–${day.end}`),
    },
    {
      href: `${linkBase}#merch`,
      label: `物販（${djStage.name}の会場で販売）`,
      lines: merch.prices.map((price) => `${price.item} ${price.price}`),
    },
  ];
  return (
    <List hasDividers edge="flush" density="spacious" className="festival-summary">
      {rows.map((row) => (
        <ListItem
          key={row.href}
          href={row.href}
          label={<Text weight="bold">{row.label}</Text>}
          description={
            <VStack gap={0.5} hAlign="start">
              {row.lines.map((line) => (
                <Text key={line} type="time" className="festival-summary-time">{line}</Text>
              ))}
            </VStack>
          }
          endContent={<AppIcon name="arrowRight" color="accent" />}
        />
      ))}
    </List>
  );
}
