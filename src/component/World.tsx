"use client";

import type { ReactNode } from "react";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import jaJP from "@astryxdesign/core/locales/ja-JP.generated.js";
import { Theme } from "@astryxdesign/core/theme";
import { themes } from "../astryx-themes";

/** 作品ごとの「世界」。色・書体・角の丸さ・動きの性格をAstryxのテーマとして切り替えます。 */
export type WorldName = keyof typeof themes;

// 各作品の世界観は、OSのライト／ダーク設定に関係なく固定します。
const worldMode: Record<WorldName, "light" | "dark"> = {
  tansan: "light",
  horoscope: "dark",
  nijiiro: "light",
  aramaki: "light",
};

/**
 * 子要素をAstryxのテーマで包みます。テーマの実体は src/themes/<名前>/ にあり、
 * `npx astryx theme build` で作ったCSSを読み込むので、JavaScriptが動く前から色が付きます。
 * サイト内のリンクは、Next.jsの画面切り替え（Link）を使わず、通常のページ移動にしています。
 * Next.js 15の静的書き出しでは、裏で取りに行く画面データ（index.txt）の取得に失敗すると、
 * そのデータファイル自体へ移動して文字の羅列が表示される不具合があるためです（2026-11-12に本番で発生）。
 * 静的なサイトなので通常の移動でも十分速く、裏での先読み通信もなくなります。
 * 作品一覧のカードのように、ページの中へ別の作品のテーマを入れ子にして使うこともできます。
 */
export default function World({ name, children }: { name: WorldName; children: ReactNode }) {
  return (
    // 部品が自分で出す文言（「閉じる」「必須」など）は、Astryx同梱の日本語にします。
    <InternationalizationProvider locale="ja-JP" messages={{ "ja-JP": jaJP }}>
      <Theme theme={themes[name]} mode={worldMode[name]}>
        {children}
      </Theme>
    </InternationalizationProvider>
  );
}
