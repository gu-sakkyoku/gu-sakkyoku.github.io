"use client";

import { useEffect } from "react";

/**
 * data-play-on-view を付けた要素が画面に入ったら、一度だけ data-play を付けます。
 * CSSはこの印を合図に、一度きりの動き（題字が跳ねる・泡が上がるなど）を再生します。
 * 値は「どれだけ見えたら始めるか」（0〜1）。OSで動きを減らす設定の人には付けないので、最初から止まった状態です。
 * JavaScriptが動かない環境でも、題字・絵・リンクはすべて最初から見えています。
 */
export default function ViewportPlay() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observers = [...document.querySelectorAll<HTMLElement>("[data-play-on-view]")].map((target) => {
      const threshold = Number(target.dataset.playOnView) || 0.15;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry || entry.intersectionRatio < threshold) return;
          target.dataset.play = "";
          observer.disconnect();
        },
        { threshold },
      );
      observer.observe(target);
      return observer;
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);
  return null;
}
