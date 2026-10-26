"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AlbumMotionTheme = "cosmos" | "rainbow" | "soda";

// 歌詞本文・ヘッダー・認証フォームは対象に含めません。読んでいる文章や入力欄を動かさないためです。
const revealSelector = [
  ".archive-hero-copy",
  ".archive-section-heading",
  ".archive-track-list > li",
  ".release-feature-media",
  ".release-track-list > h2",
  ".release-track-list h3",
  ".release-track-list li",
  ".home-about-intro",
  ".home-contact-note",
  ".home-discography-grid > article",
].join(",");

/**
 * 静的HTMLの上に動きだけを足す共通部品です。JSがなくても全ての情報とリンクは見えます。
 * 要素が見える時だけ一度アニメーションし、スクロール自体の速度や位置は変更しません。
 * 新しい年度にも同じ部品を使えます。調整する数値はこのファイルとalbum-motion.cssにまとめます。
 */
export default function AlbumMotion({
  theme,
  children,
}: {
  theme: AlbumMotionTheme;
  children: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};

    const configure = () => {
      dispose();
      // 設定を途中で切り替えた場合も、その場で演出を止めて通常の読みやすい表示へ戻します。
      if (
        preference.matches ||
        typeof root.animate !== "function" ||
        !("IntersectionObserver" in window)
      )
        return;
      const animations = new Map<Element, Animation>();
      const targets = [...root.querySelectorAll<HTMLElement>(revealSelector)];
      const observer = new IntersectionObserver(
        (entries) => {
          entries
            .filter(({ isIntersecting }) => isIntersecting)
            .forEach(({ target }, index) => {
              observer.unobserve(target);
              // 設定変更や画面幅変更のたびに読み終えた行を再演出しないよう、完了はDOMに記録します。
              if (target.hasAttribute("data-motion-revealed")) return;
              target.setAttribute("data-motion-revealed", "true");
              const row = target.tagName === "LI";
              const animation = target.animate(
                [
                  {
                    opacity: 0.35,
                    transform: `translate3d(0, ${row ? 22 : 30}px, 0)`,
                  },
                  { opacity: 1, transform: "translate3d(0, 0, 0)" },
                ],
                {
                  duration: theme === "cosmos" ? 800 : 650,
                  delay: row ? Math.min(index, 4) * 55 : 0,
                  easing: "cubic-bezier(.16,1,.3,1)",
                  fill: "none",
                },
              );
              animations.set(target, animation);
              animation.onfinish = () => animations.delete(target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -20px 0px" },
      );
      targets.forEach((element) => observer.observe(element));

      const hero = root.querySelector<HTMLElement>(
        ".archive-hero, .release-feature",
      );
      const artwork = root.querySelector<HTMLElement>(".archive-art-stage");
      let scrollFrame = 0;
      let pointerFrame = 0;
      const updateDepth = () => {
        scrollFrame = 0;
        if (!hero || document.hidden) return;
        const bounds = hero.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
        // 移動は最大24px。大きな視差や画面固定を避け、スマホでも普通にスクロールできます。
        const progress = Math.max(
          -1,
          Math.min(
            1,
            (window.innerHeight * 0.2 - bounds.top) /
              Math.max(bounds.height, 1),
          ),
        );
        root.style.setProperty(
          "--album-scene-shift",
          `${(progress * 24).toFixed(2)}px`,
        );
        root.style.setProperty(
          "--album-art-shift",
          `${(progress * -12).toFixed(2)}px`,
        );
        root.style.setProperty(
          "--album-orbit-turn",
          `${(progress * 12).toFixed(2)}deg`,
        );
      };
      const scheduleDepth = () => {
        if (!scrollFrame) scrollFrame = requestAnimationFrame(updateDepth);
      };
      const resetTilt = () => {
        cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        root.style.setProperty("--album-tilt-x", "0deg");
        root.style.setProperty("--album-tilt-y", "0deg");
      };
      const tilt = (event: PointerEvent) => {
        // hoverがない端末では反応させず、指でページを送る操作を優先します。
        if (
          event.pointerType !== "mouse" ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
          !artwork
        )
          return;
        cancelAnimationFrame(pointerFrame);
        pointerFrame = requestAnimationFrame(() => {
          const rect = artwork.getBoundingClientRect();
          const x = Math.max(
            -1,
            Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
          );
          const y = Math.max(
            -1,
            Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
          );
          root.style.setProperty("--album-tilt-x", `${(-y * 3).toFixed(2)}deg`);
          root.style.setProperty("--album-tilt-y", `${(x * 3).toFixed(2)}deg`);
        });
      };
      const settleFocusedRow = (event: FocusEvent) => {
        // Tabで進んだリンクは、その場で静止させてフォーカス枠を追いやすくします。
        if (!(event.target instanceof Element)) return;
        const row = event.target.closest(revealSelector);
        if (row) {
          animations.get(row)?.cancel();
          animations.delete(row);
        }
      };
      window.addEventListener("scroll", scheduleDepth, { passive: true });
      window.addEventListener("resize", scheduleDepth);
      artwork?.addEventListener("pointermove", tilt);
      artwork?.addEventListener("pointerleave", resetTilt);
      root.addEventListener("focusin", settleFocusedRow);
      updateDepth();
      dispose = () => {
        observer.disconnect();
        animations.forEach((animation) => animation.cancel());
        cancelAnimationFrame(scrollFrame);
        resetTilt();
        window.removeEventListener("scroll", scheduleDepth);
        window.removeEventListener("resize", scheduleDepth);
        artwork?.removeEventListener("pointermove", tilt);
        artwork?.removeEventListener("pointerleave", resetTilt);
        root.removeEventListener("focusin", settleFocusedRow);
        [
          "--album-scene-shift",
          "--album-art-shift",
          "--album-orbit-turn",
          "--album-tilt-x",
          "--album-tilt-y",
        ].forEach((property) => root.style.removeProperty(property));
      };
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      dispose();
      preference.removeEventListener("change", configure);
    };
  }, [theme]);

  return (
    <div ref={scope} data-album-motion={theme}>
      {children}
    </div>
  );
}
