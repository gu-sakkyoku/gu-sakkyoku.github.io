"use client";

import { useEffect } from "react";

// TypeScriptの標準の型にまだない、ページ移動直前のイベントの必要な部分だけを書きます。
type PageSwapEvent = Event & {
  viewTransition: unknown | null;
  activation: { entry: { url: string } } | null;
};

const isOnScreen = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
};

/**
 * 作品一覧のカードを押して作品ページへ移るとき、押したカードのジャケットを、移動先の大きなジャケットへつなげて動かします。
 * 移る直前（pageswap）に、画面に見えているそのカードの絵だけへ名前を付けるので、画面外の絵が飛んでくることはありません。
 * 動き自体はブラウザのページ移動の機能（globals.css の @view-transition）で、対応していないブラウザでは何もしません。
 */
export default function JacketHandoff() {
  useEffect(() => {
    const onSwap = (event: Event) => {
      const { viewTransition, activation } = event as PageSwapEvent;
      if (!viewTransition || !activation) return;
      const to = new URL(activation.entry.url).pathname;
      const cards = [...document.querySelectorAll<HTMLElement>("[data-jacket-href]")];
      // 前回の移動で付けた名前（戻るボタンで復元されたページに残っているもの）を外してから付け直します。
      cards.forEach((card) => card.style.removeProperty("view-transition-name"));
      const card = cards.find((item) => item.dataset.jacketHref === to && isOnScreen(item));
      if (!card) return;
      // 同じ名前は1ページに1つだけ。いまのページの大きなジャケットからは名前を外します。
      document.querySelectorAll<HTMLElement>(".album-jacket").forEach((jacket) => {
        jacket.style.viewTransitionName = "none";
      });
      card.style.viewTransitionName = "album-jacket";
    };
    window.addEventListener("pageswap", onSwap);
    return () => window.removeEventListener("pageswap", onSwap);
  }, []);
  return null;
}
