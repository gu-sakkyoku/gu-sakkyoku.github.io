"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import type { Album } from "../data/albums";
import AppIcon from "./ui/AppIcon";
import Artwork from "./ui/Artwork";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      size: "compact";
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
const configured = Boolean(workerUrl && siteKey);

// カードのコードの形（年度と、4文字×4組）。Worker側の確認と同じ形だけを送り、
// 打ち間違いで認証チェックをやり直す手間を減らします。合否そのものはWorkerだけが判定します。
const codePattern = (year: number) => new RegExp(`^${year}(?:-[A-Z2-9]{4}){4}$`);
const maxCodeLength = 32;

type Status =
  | { kind: "idle" }
  | { kind: "info" | "warning" | "error" | "success"; title: string; description?: string };

function DownloadForm({ year, scriptReady, scriptFailed }: { year: number; scriptReady: boolean; scriptFailed: boolean }) {
  const widgetContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!scriptReady || !siteKey || !widgetContainer.current || !window.turnstile) return;
    const api = window.turnstile;
    widgetId.current = api.render(widgetContainer.current, {
      sitekey: siteKey,
      action: "download",
      // 通常版は横300px必要で、320px幅のスマホのカード内に収まりません。
      // 公式のコンパクト表示（150×140px）だけを指定し、認証条件は変更しません。
      size: "compact",
      callback: setTurnstileToken,
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => {
        setTurnstileToken("");
        setStatus({ kind: "error", title: "認証チェックを読み込めませんでした。", description: "時間をおいて再度お試しください。" });
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
      setStatus({ kind: "info", title: "ただいまダウンロードの受付準備中です。", description: "しばらくお待ちください。" });
      return;
    }
    if (!codePattern(year).test(code.trim().toUpperCase())) {
      setCodeError(`コードの形式をご確認ください（例：${year}-XXXX-XXXX-XXXX-XXXX）`);
      return;
    }
    if (!turnstileToken) {
      setStatus({ kind: "warning", title: "認証チェックを完了してから、もう一度お試しください。" });
      return;
    }

    setPending(true);
    setCodeError("");
    setStatus({ kind: "idle" });
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
        if (response.status === 401 || response.status === 403) {
          setCodeError("コードまたは認証チェックを確認して、もう一度お試しください。");
        } else {
          setStatus({ kind: "error", title: "ダウンロードに失敗しました。", description: "時間をおいて再度お試しください。" });
        }
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
      setStatus({ kind: "success", title: "ダウンロードを開始しました。", description: "開始しない場合は通信環境をご確認ください。" });
    } catch {
      setStatus({ kind: "error", title: "ダウンロードに失敗しました。", description: "時間をおいて再度お試しください。" });
    } finally {
      window.clearTimeout(timeout);
      setPending(false);
      setTurnstileToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <form id={`download-form-${year}`} onSubmit={handleSubmit} noValidate>
      <VStack gap={4}>
        <TextInput
          label="ダウンロードコード"
          description={`${year}年のカードに印刷されたコードを入力してください。`}
          placeholder={`${year}-XXXX-XXXX-XXXX-XXXX`}
          value={code}
          // 英字は大文字にそろえます（カードの表記と同じ）。長すぎる貼り付けは切り詰めます。
          onChange={(value) => {
            setCode(value.toUpperCase().slice(0, maxCodeLength));
            setCodeError("");
          }}
          htmlName="download-code"
          size="lg"
          width="100%"
          autoComplete="off"
          autoCapitalize="characters"
          hasAutoCorrect={false}
          hasSpellCheck={false}
          enterKeyHint="done"
          isRequired
          isReadOnly={pending}
          isDisabled={!configured}
          disabledMessage={configured ? undefined : "ただいまダウンロードの受付準備中です。"}
          status={codeError ? { type: "error", message: codeError } : undefined}
          statusVariant="detached"
          controlClassName="download-code-control"
        />
        {/* 読み込み前からコンパクト版の高さを確保し、表示後にボタンが飛び跳ねないようにします。 */}
        <div ref={widgetContainer} className="download-turnstile" aria-label="認証チェック" />
        <Button
          type="submit"
          label={pending ? "確認中…" : "コードを確認してダウンロード"}
          variant="primary"
          size="lg"
          width="100%"
          isLoading={pending}
          isDisabled={!configured}
          icon={<AppIcon name="download" />}
        />
        <div role="status" aria-live="polite" className="download-status">
          {scriptFailed && status.kind === "idle" ? (
            <Banner status="error" title="認証チェックを読み込めませんでした。" description="時間をおいて再度お試しください。" collapsible={false} />
          ) : status.kind !== "idle" ? (
            <Banner status={status.kind} title={status.title} description={status.description} collapsible={false} />
          ) : null}
        </div>
      </VStack>
    </form>
  );
}

/**
 * ダウンロードカード用の受け取り画面です。年度を選び、コードを入れて、認証チェックを通すと、
 * WorkerがZIPの配信を許可します。コードの確認・配信はすべてWorker側で行い、ここは入力と案内だけです。
 * 年度の一覧・作品名・曲数・配信状態は、年度データ（albums.ts）から表示します。
 */
export default function DownloadArchive({ albums }: { albums: Album[] }) {
  // 年度は新しい順に、いつも同じ位置へ並べます（配信状態で並べ替えません）。
  const ordered = [...albums].sort((a, b) => b.year - a.year);
  const defaultYear = (ordered.find((album) => album.downloadEnabled) ?? ordered[0])?.year;
  const [selectedYear, setSelectedYear] = useState<number | undefined>(defaultYear);
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  useEffect(() => {
    // カードやほかのページからの /download/#album-2025 のようなリンクで、その年度を選んだ状態にします。
    const selectFromHash = () => {
      const year = Number(window.location.hash.replace("#album-", ""));
      if (albums.some((album) => album.year === year)) setSelectedYear(year);
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, [albums]);

  const album = ordered.find((item) => item.year === selectedYear);
  if (!album) return null;
  const trackCount = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);

  return (
    <>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setScriptFailed(true)}
        />
      )}
      <Card padding={5} elevation="med" className="download-panel">
        <VStack gap={6}>
          {/* 以前の年度別リンク（#album-2026 など）が、この受け取り画面の位置へ届くようにします。 */}
          {ordered.map((item) => (
            <span key={item.year} id={`album-${item.year}`} className="download-anchor" />
          ))}

          <VStack gap={2}>
            <Text as="p" weight="bold">カードに印刷された年度</Text>
            <SegmentedControl
              label="カードに印刷された年度"
              size="lg"
              layout="fill"
              value={String(album.year)}
              onChange={(value) => setSelectedYear(Number(value))}
            >
              {ordered.map((item) => (
                <SegmentedControlItem key={item.year} value={String(item.year)} label={`${item.year}年`} />
              ))}
            </SegmentedControl>
          </VStack>

          {/* 年度を切り替えたとき、選ばれた作品名を読み上げで伝えます。 */}
          <HStack gap={4} vAlign="center" aria-live="polite">
            {album.artwork && (
              <Artwork
                src={album.artwork}
                alt={`${album.title}のアルバムジャケット`}
                sizes="(max-width: 640px) 96px, 160px"
                className="download-album-art"
              />
            )}
            <VStack gap={1} hAlign="start">
              <Text type="supporting">{album.year}年・{album.discs.length}枚組・全{trackCount}曲</Text>
              <Heading level={2}>{album.title}</Heading>
              {album.detailPath && (
                <Link href={album.detailPath} isStandalone hasUnderline>歌詞ページはこちらから</Link>
              )}
            </VStack>
          </HStack>

          {!album.downloadEnabled ? (
            <Banner
              status={album.unavailableReason === "paused" ? "warning" : "info"}
              title={album.unavailableReason === "paused" ? "一時停止中" : "Coming Soon"}
              description={
                album.unavailableReason === "paused"
                  ? "ZIPの修正版を準備しています。しばらくお待ちください。"
                  : "ダウンロードは準備中です"
              }
              collapsible={false}
            />
          ) : (
            <>
              {!configured && (
                <Banner status="info" title="ただいまダウンロードの受付準備中です。" description="しばらくお待ちください。" collapsible={false} />
              )}
              {/* 年度ごとに入力欄と認証チェックを作り直し、別の年度のコードが残らないようにします。 */}
              <DownloadForm key={album.year} year={album.year} scriptReady={scriptReady} scriptFailed={scriptFailed} />
            </>
          )}
        </VStack>
      </Card>
    </>
  );
}
