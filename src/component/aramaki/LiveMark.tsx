"use client";

import { useEffect, useState } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { tokyoNow } from "../../lib/tokyo-now";

/**
 * 学園祭の当日、いま出演中の枠に「いま」の印を付けます（日本時間で判定）。
 * 時刻表そのものは静的なHTMLのままで、この印はJavaScriptが動く環境でだけ表示される補助です。
 * 1分ごとに確認するだけで、画面は動かしません。
 */
export default function LiveMark({ date, start, end }: { date: string; start: string; end: string }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = tokyoNow();
      setLive(now.date === date && now.time >= start && now.time < end);
    };
    check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, [date, start, end]);

  if (!live) return null;
  return <Badge label="いま" variant="warning" />;
}
