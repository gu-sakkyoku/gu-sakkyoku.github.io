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
    <form id={`download-form-${year}`} onSubmit={handleSubmit} className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
      <p className="mb-4 text-sm leading-6">{year}年のカードに印刷されたコードを入力してください。</p>
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
        className="mt-2 w-full rounded-lg border border-slate-500 bg-white px-4 py-3 font-mono text-sm tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
      />
      <div ref={widgetContainer} className="mt-4 min-h-18" aria-label="認証チェック" />
      <button type="submit" disabled={pending} className="mt-4 w-full rounded-full bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 disabled:cursor-wait disabled:opacity-70">
        {pending ? "確認中…" : "コードを確認してダウンロード"}
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-6 text-sm text-blue-950">{message}</p>
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
      <div className="space-y-8">
        {/* スマホでは最初に受け取れる作品を見せ、準備中の年度は末尾へ置きます。 */}
        {[...albums].sort((a, b) => Number(b.downloadEnabled) - Number(a.downloadEnabled) || b.year - a.year).map((album) => (
          <article key={album.year} className="overflow-hidden rounded-2xl border border-slate-300 bg-white p-5 shadow-lg sm:p-7">
            <div className="grid gap-6 sm:grid-cols-[minmax(180px,260px)_1fr] sm:gap-8">
              {album.artwork ? (
                <Image
                  src={album.artwork}
                  alt={`${album.title}のアルバムジャケット`}
                  width={500}
                  height={500}
                  className="aspect-square w-full rounded-xl object-cover shadow-md"
                />
              ) : (
                <div aria-hidden="true" className="flex min-h-40 items-center justify-center rounded-xl bg-blue-100 font-serif text-5xl text-blue-900 sm:aspect-square">{album.year}</div>
              )}
              <div>
                <p className="font-serif text-lg font-semibold text-blue-900">{album.year}</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold">{album.title}</h2>
                {album.detailPath && (
                  <Link href={album.detailPath} className="mt-3 inline-block rounded-sm font-semibold text-blue-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900">
                    曲紹介・歌詞を見る
                  </Link>
                )}
                {album.discs.map((disc) => (
                  <details key={disc.name} className="mt-4 rounded-lg border border-slate-200 p-3">
                    <summary className="cursor-pointer font-semibold text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900">{disc.name}（{disc.tracks.length}曲）</summary>
                    <ol className="mt-3 list-decimal space-y-1 pl-7 text-sm leading-6 text-slate-800">
                      {disc.tracks.map((track) => <li key={track}>{track}</li>)}
                    </ol>
                  </details>
                ))}
                {album.downloadEnabled ? (
                  <button
                    type="button"
                    aria-expanded={selectedYear === album.year}
                    aria-controls={`download-form-${album.year}`}
                    onClick={() => setSelectedYear(selectedYear === album.year ? null : album.year)}
                    className="mt-5 w-full rounded-full border-2 border-blue-900 bg-blue-900 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-white hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 sm:w-auto"
                  >
                    ダウンロードはこちらから
                  </button>
                ) : (
                  <p className="mt-5 rounded-full border border-slate-400 bg-slate-100 px-5 py-3 text-center font-semibold text-slate-700 sm:inline-block">ダウンロードは準備中です</p>
                )}
                {selectedYear === album.year && <DownloadForm key={album.year} year={album.year} scriptReady={scriptReady} />}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
