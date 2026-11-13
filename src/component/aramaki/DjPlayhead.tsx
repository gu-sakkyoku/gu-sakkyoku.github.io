"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { tokyoNow } from "../../lib/tokyo-now";

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

/**
 * DJステージのトラックに立てる、赤い再生ヘッド（現在時刻の線）です。
 * その日の、時間軸の範囲内（日本時間）にいるときだけ表示し、30秒ごとに位置を確認します。
 * 線は飾りなので読み上げません。いま出演中の枠には、別に「いま」の印（LiveMark）が付きます。
 * JavaScriptが動かない環境では表示されず、タイムテーブルはそのまま読めます。
 */
export default function DjPlayhead({ date, start, end }: { date: string; start: string; end: string }) {
  const [at, setAt] = useState<number | null>(null);

  useEffect(() => {
    const check = () => {
      const now = tokyoNow();
      const minutes = toMinutes(now.time);
      const from = toMinutes(start);
      const to = toMinutes(end);
      setAt(now.date === date && minutes >= from && minutes < to ? (minutes - from) / (to - from) : null);
    };
    check();
    const timer = window.setInterval(check, 30_000);
    return () => window.clearInterval(timer);
  }, [date, start, end]);

  if (at === null) return null;
  return <span className="dj-playhead" aria-hidden="true" style={{ "--at": at } as CSSProperties} />;
}
