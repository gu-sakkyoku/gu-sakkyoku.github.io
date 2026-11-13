import type { ReactNode } from "react";
import type { Viewport } from "next";

/**
 * Horoscope（2025年）の作品・歌詞ページだけの設定です。
 * この作品は暗い夜空の世界なので、スマホのブラウザのアドレスバーなどもヘッダーと同じ濃紺にします。
 */
export const viewport: Viewport = {
  themeColor: "#0b0930",
  colorScheme: "dark",
};

export default function HoroscopeLayout({ children }: { children: ReactNode }) {
  return children;
}
