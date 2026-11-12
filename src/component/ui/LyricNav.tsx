"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { HStack } from "@astryxdesign/core/HStack";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import type { LyricItem } from "../../lib/lyric-items";
import AppIcon from "./AppIcon";

const normalize = (value: string) => (value.endsWith("/") ? value : `${value}/`);
const useCurrentIndex = (items: LyricItem[]) => {
  const pathname = normalize(usePathname());
  return items.findIndex((item) => normalize(item.href) === pathname);
};

/** いま開いている歌詞が、アルバムの何曲目かを表示します（例：Disc 1・5曲目）。 */
export function LyricPosition({ items }: { items: LyricItem[] }) {
  const index = useCurrentIndex(items);
  if (index < 0) return null;
  return <Text type="supporting">{items[index].position}</Text>;
}

/**
 * 歌詞を読み終えた位置に置く「次の歌詞／前の歌詞」です。順番はアルバムの収録順です。
 * 歌詞が1曲だけの作品では何も表示しません。キーボードの操作を横取りするショートカットは付けていません。
 */
export function LyricPager({ items }: { items: LyricItem[] }) {
  const index = useCurrentIndex(items);
  if (index < 0 || items.length < 2) return null;
  const previous = items[index - 1];
  const next = items[index + 1];
  return (
    <nav aria-label="前後の歌詞" className="lyric-pager">
      {next && (
        <ClickableCard label={`次の歌詞：${next.title}`} href={next.href} padding={4} elevation="low">
          <HStack gap={4} vAlign="center" hAlign="between" minHeight={72}>
            <VStack>
              <Text type="supporting" display="block">次の歌詞・{next.position}</Text>
              <Text weight="bold" display="block">{next.title}</Text>
              {next.credit && <Text type="supporting" display="block">{next.credit}</Text>}
            </VStack>
            <AppIcon name="arrowRight" color="accent" />
          </HStack>
        </ClickableCard>
      )}
      {previous && (
        <ClickableCard label={`前の歌詞：${previous.title}`} href={previous.href} padding={4} elevation="low">
          <HStack gap={4} vAlign="center" minHeight={72}>
            <AppIcon name="arrowLeft" color="accent" />
            <VStack>
              <Text type="supporting" display="block">前の歌詞・{previous.position}</Text>
              <Text weight="bold" display="block">{previous.title}</Text>
              {previous.credit && <Text type="supporting" display="block">{previous.credit}</Text>}
            </VStack>
          </HStack>
        </ClickableCard>
      )}
    </nav>
  );
}

const sizes = ["small", "normal", "large"] as const;
type LyricSize = (typeof sizes)[number];
const storageKey = "gu-sakkyoku-lyric-size";

/**
 * 歌詞の文字サイズを「小・標準・大」から選べます。選んだ大きさはこの端末に記憶し、次の歌詞でも使います。
 * 歌詞の文字そのものには触れず、歌詞を包む要素（.lyric-sheet）へ data-lyric-size を付けるだけです。
 * JavaScriptが動かない環境では表示されず、歌詞は標準の大きさで読めます。
 */
export function LyricSizeControl() {
  const [size, setSize] = useState<LyricSize | null>(null);

  useEffect(() => {
    // 保存された値は一覧にあるものだけを採用します（想定外の文字列を属性へ入れないため）。
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch {
      // プライベートブラウズなどで保存領域が使えない場合は、標準の大きさのままにします。
    }
    setSize(sizes.find((value) => value === saved) ?? "normal");
  }, []);

  useEffect(() => {
    if (!size) return;
    document.querySelectorAll<HTMLElement>(".lyric-sheet").forEach((sheet) => {
      sheet.dataset.lyricSize = size;
    });
    try {
      window.localStorage.setItem(storageKey, size);
    } catch {
      // 保存できなくても、このページでの表示には反映されています。
    }
  }, [size]);

  if (!size) return null;
  return (
    <SegmentedControl
      label="歌詞の文字サイズ"
      size="sm"
      value={size}
      onChange={(value) => setSize(sizes.find((item) => item === value) ?? "normal")}
    >
      <SegmentedControlItem value="small" label="小" />
      <SegmentedControlItem value="normal" label="標準" />
      <SegmentedControlItem value="large" label="大" />
    </SegmentedControl>
  );
}
