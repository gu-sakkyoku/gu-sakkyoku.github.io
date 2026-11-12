"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 静的HTMLの上に動きだけを足す共通部品です。JavaScriptがなくても全ての情報とリンクは見えます。
 *
 * 使い方（どの作品のページでも同じ）：
 * - data-reveal を付けた要素は、画面に入ったときに一度だけ、下からふわっと現れます。
 * - data-depth を付けた領域（ページ上部の絵のある部分）を基準に、スクロール量に応じた
 *   CSS変数（--depth-scene、--depth-art、--depth-turn）を更新します。絵の飾りがこれを使って少しだけ動きます。
 * - data-tilt を付けた要素は、マウスを載せたときだけ少し傾きます（指での操作では動きません）。
 *
 * 歌詞本文・ヘッダー・認証フォームには付けません。読んでいる文章や入力欄を動かさないためです。
 * スクロール自体の速度や位置は変更しません。OSで「動きを減らす」を選んだ人には何も動かしません。
 */
export default function AlbumMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    const configure = () => {
      dispose();
      // 設定を途中で切り替えた場合も、その場で演出を止めて通常の読みやすい表示へ戻します。
      if (preference.matches || typeof root.animate !== "function" || !("IntersectionObserver" in window)) return;

      const animations = new Map<Element, Animation>();
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter(({ isIntersecting }) => isIntersecting)
            .forEach(({ target }, index) => {
              observer.unobserve(target);
              // 画面幅の変更などで読み終えた部分を再演出しないよう、完了はDOMに記録します。
              if (target.hasAttribute("data-revealed")) return;
              target.setAttribute("data-revealed", "true");
              const animation = target.animate(
                [
                  { opacity: 0.3, transform: "translate3d(0, 28px, 0)" },
                  { opacity: 1, transform: "translate3d(0, 0, 0)" },
                ],
                { duration: 700, delay: Math.min(index, 3) * 70, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" },
              );
              animations.set(target, animation);
              animation.onfinish = () => animations.delete(target);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
      );
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => observer.observe(element));

      const hero = root.querySelector<HTMLElement>("[data-depth]");
      const tiltTarget = root.querySelector<HTMLElement>("[data-tilt]");
      let scrollFrame = 0;
      let pointerFrame = 0;

      const updateDepth = () => {
        scrollFrame = 0;
        if (!hero || document.hidden) return;
        const bounds = hero.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
        // 移動は最大でも数十px。大きな視差や画面固定を避け、スマホでも普通にスクロールできます。
        const progress = Math.max(-1, Math.min(1, (window.innerHeight * 0.2 - bounds.top) / Math.max(bounds.height, 1)));
        root.style.setProperty("--depth-scene", `${(progress * 36).toFixed(2)}px`);
        root.style.setProperty("--depth-art", `${(progress * -14).toFixed(2)}px`);
        root.style.setProperty("--depth-turn", `${(progress * 14).toFixed(2)}deg`);
      };
      const scheduleDepth = () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateDepth);
      };

      const resetTilt = () => {
        cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        root.style.setProperty("--tilt-x", "0deg");
        root.style.setProperty("--tilt-y", "0deg");
      };
      const tilt = (event: PointerEvent) => {
        // hoverがない端末では反応させず、指でページを送る操作を優先します。
        if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || !tiltTarget) return;
        cancelAnimationFrame(pointerFrame);
        pointerFrame = requestAnimationFrame(() => {
          const rect = tiltTarget.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
          const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
          root.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
          root.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
        });
      };
      const settleFocused = (event: FocusEvent) => {
        // Tabで進んだリンクは、その場で静止させてフォーカス枠を追いやすくします。
        if (!(event.target instanceof Element)) return;
        const target = event.target.closest("[data-reveal]");
        if (target) {
          animations.get(target)?.cancel();
          animations.delete(target);
        }
      };

      window.addEventListener("scroll", scheduleDepth, { passive: true });
      window.addEventListener("resize", scheduleDepth);
      tiltTarget?.addEventListener("pointermove", tilt);
      tiltTarget?.addEventListener("pointerleave", resetTilt);
      root.addEventListener("focusin", settleFocused);
      updateDepth();

      dispose = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        cancelAnimationFrame(scrollFrame);
        resetTilt();
        window.removeEventListener("scroll", scheduleDepth);
        window.removeEventListener("resize", scheduleDepth);
        tiltTarget?.removeEventListener("pointermove", tilt);
        tiltTarget?.removeEventListener("pointerleave", resetTilt);
        root.removeEventListener("focusin", settleFocused);
        ["--depth-scene", "--depth-art", "--depth-turn", "--tilt-x", "--tilt-y"].forEach((property) =>
          root.style.removeProperty(property),
        );
      };
    };

    configure();
    preference.addEventListener("change", configure);
    return () => {
      dispose();
      preference.removeEventListener("change", configure);
    };
  }, []);

  return (
    <div ref={scope} data-album-motion>
      {children}
    </div>
  );
}
