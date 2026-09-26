"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Album } from "../data/albums";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// 公開設定だけをブラウザに渡します。ダウンロードコードやSecretはここへ置かないでください。
const workerUrl = (() => {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_DOWNLOAD_WORKER_URL || "");
    const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    // 本番で誤って平文HTTPへカードコードを送らないよう、HTTPS以外はローカル限定です。
    return url.protocol === "https:" || local ? url.origin : undefined;
  } catch {
    return undefined;
  }
})();
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function DownloadForm({ year, scriptReady }: { year: number; scriptReady: boolean }) {
  const widgetContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [code, setCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!scriptReady || !siteKey || !widgetContainer.current || !window.turnstile) return;
    const api = window.turnstile;
    widgetId.current = api.render(widgetContainer.current, {
      sitekey: siteKey,
      action: "download",
      callback: setTurnstileToken,
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => {
        setTurnstileToken("");
        setMessage("認証チェックを読み込めませんでした。時間をおいて再度お試しください。");
      },
    });
    return () => {
      if (widgetId.current) api.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [scriptReady]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!workerUrl || !siteKey) {
      setMessage("ただいまダウンロードの受付準備中です。しばらくお待ちください。");
      return;
    }
    if (!turnstileToken) {
      setMessage("認証チェックを完了してから、もう一度お試しください。");
      return;
    }

    setPending(true);
    setMessage("");
    const abort = new AbortController();
    const timeout = window.setTimeout(() => abort.abort(), 15000);
    try {
      const response = await fetch(`${workerUrl}/api/authorize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, code: code.trim().toUpperCase(), turnstileToken }),
        signal: abort.signal,
        cache: "no-store",
      });
      if (!response.ok) {
        setMessage(
          response.status === 401 || response.status === 403
            ? "コードまたは認証チェックを確認して、もう一度お試しください。"
            : "ダウンロードに失敗しました。時間をおいて再度お試しください。",
        );
        return;
      }
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("token" in result) || typeof result.token !== "string") {
        throw new Error("Invalid authorization response");
      }
      // ZIP本体をfetch().blob()で受け取ると約1～2GBを端末メモリに載せてしまいます。
      // ブラウザの通常のダウンロード機能に任せ、Workerから直接ストリーミングします。
      const link = document.createElement("a");
      link.href = `${workerUrl}/download/${year}?token=${encodeURIComponent(result.token)}`;
      link.referrerPolicy = "no-referrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage("ダウンロードを開始しました。開始しない場合は通信環境をご確認ください。");
    } catch {
      setMessage("ダウンロードに失敗しました。時間をおいて再度お試しください。");
    } finally {
      window.clearTimeout(timeout);
      setPending(false);
      setTurnstileToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <form id={`download-form-${year}`} onSubmit={handleSubmit} className="mx-auto mt-9 max-w-xl border-t border-zinc-500 pt-6 text-left">
      <p className="mb-5 text-sm leading-6">{year}年のカードに印刷されたコードを入力してください。</p>
      <label htmlFor={`download-code-${year}`} className="block text-sm font-semibold">ダウンロードコード</label>
      <input
        id={`download-code-${year}`}
        name="download-code"
        type="text"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        required
        maxLength={32}
        placeholder={`${year}-XXXX-XXXX-XXXX-XXXX`}
        className="mt-2 w-full rounded-lg border border-zinc-500 bg-white px-4 py-3 font-mono text-sm tracking-wide text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      />
      <div ref={widgetContainer} className="mt-4 min-h-18" aria-label="認証チェック" />
      <button type="submit" disabled={pending} className="mt-4 w-full rounded-full border-2 border-zinc-400 px-5 py-3 font-serif text-lg transition-colors hover:bg-zinc-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-70">
        {pending ? "確認中…" : "コードを確認してダウンロード"}
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm">{message}</p>
    </form>
  );
}

export default function DownloadArchive({ albums }: { albums: Album[] }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}
      <div className="space-y-20 sm:space-y-24">
        {/* スマホでは最初に受け取れる作品を見せ、準備中の年度は末尾へ置きます。 */}
        {[...albums].sort((a, b) => Number(b.downloadEnabled) - Number(a.downloadEnabled) || b.year - a.year).map((album) => (
          <article key={album.year} className="mx-auto w-[80%] max-w-4xl border-t border-zinc-500 pt-12 text-center">
            {/* 既存の作品ページと同じく、見出し・ジャケット・曲リストを縦に配置します。 */}
            <p className="text-sm opacity-75">{album.year}年</p>
            <h2 className="mt-2 font-serif text-[30px] leading-snug">{album.title}</h2>
            {album.artwork && (
              <Image
                src={album.artwork}
                alt={`${album.title}のアルバムジャケット`}
                width={700}
                height={700}
                className="mx-auto mt-8 aspect-square w-full max-w-[340px] rounded-xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.3)] sm:max-w-[420px]"
              />
            )}
            {album.detailPath && (
              <Link href={album.detailPath} className="mt-9 inline-block rounded-full border-2 border-zinc-400 px-5 py-3 font-serif text-lg text-blue-700 underline underline-offset-4 transition-colors hover:bg-zinc-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-300">
                歌詞ページはこちらから
              </Link>
            )}
            <div className="mx-auto mt-8 max-w-xl">
              {album.discs.map((disc) => (
                <details key={disc.name} className="border-b border-zinc-500 py-4">
                  <summary className="cursor-pointer font-serif text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">{disc.name}（{disc.tracks.length}曲）</summary>
                  <ol className="mt-4 list-decimal space-y-2 pl-7 text-left text-sm leading-6">
                    {disc.tracks.map((track) => <li key={track}>{track}</li>)}
                  </ol>
                </details>
              ))}
            </div>
            {album.downloadEnabled ? (
              <button
                type="button"
                aria-expanded={selectedYear === album.year}
                aria-controls={selectedYear === album.year ? `download-form-${album.year}` : undefined}
                onClick={() => setSelectedYear(selectedYear === album.year ? null : album.year)}
                className="mt-9 w-full rounded-full border-2 border-zinc-400 px-5 py-3 text-center font-serif text-lg transition-colors hover:bg-zinc-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
              >
                ダウンロードはこちらから
              </button>
            ) : (
              <div className="mt-9">
                <p className="font-serif text-2xl">Coming Soon</p>
                <p className="mt-2 text-sm opacity-75">ダウンロードは準備中です</p>
              </div>
            )}
            {selectedYear === album.year && <DownloadForm key={album.year} year={album.year} scriptReady={scriptReady} />}
          </article>
        ))}
      </div>
    </>
  );
}
