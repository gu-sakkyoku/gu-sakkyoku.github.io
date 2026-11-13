"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@astryxdesign/core/Button";
import AppIcon from "./ui/AppIcon";

// 泡の飛ぶ方向は固定値にし、SSRとブラウザで変わらないようにします。音・通信は発生しません。
const particles = Array.from({ length: 12 }, (_, index) => ({
  x: Math.round(Math.cos((index * Math.PI) / 6) * (index % 2 ? 120 : 155)),
  y: Math.round(Math.sin((index * Math.PI) / 6) * (index % 2 ? 120 : 155)),
}));

/**
 * 新作のジャケット（ポラロイド）と「泡をはじく」ボタンです。押すたびに、ジャケットから泡と星が一度はじけます。
 * 動き自体はCSS（worlds/tansan.css の tansan-pop-fly）で、ここは押した回数を覚えるだけです。
 * OSで動きを減らす設定の人には、泡は飛ばさず、離れた位置でゆっくり現れて消えるだけにします（CSS側）。
 */
export default function TansanBurst({ children }: { children: ReactNode }) {
  const [burst, setBurst] = useState(0);
  return (
    <>
      <div className="tansan-polaroid">
        {children}
        {burst > 0 && (
          // keyを変えると、続けて押しても最初からはじけ直します。
          <div key={burst} className="tansan-pop" aria-hidden="true">
            {particles.map((particle, index) => (
              <span
                key={index}
                className={index % 2 ? "tansan-pop-bubble" : "tansan-pop-star"}
                style={{ "--x": `${particle.x}px`, "--y": `${particle.y}px`, "--i": index } as CSSProperties}
                onAnimationEnd={
                  index === particles.length - 1
                    ? () => setBurst((current) => (current === burst ? 0 : current))
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
      <div className="tansan-pop-button">
        <Button
          label="泡をはじく"
          size="sm"
          variant="secondary"
          icon={<AppIcon name="sparkles" />}
          onClick={() => setBurst((current) => current + 1)}
        />
      </div>
    </>
  );
}
