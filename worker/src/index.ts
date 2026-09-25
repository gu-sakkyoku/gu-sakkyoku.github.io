import type { R2Bucket } from "@cloudflare/workers-types";
import { albums } from "../../src/data/albums.ts";

type Env = {
  ALBUMS: R2Bucket;
  ALLOWED_ORIGIN: string;
  RUNTIME_MODE: "production" | "local";
  DOWNLOAD_CODE_HASHES: string;
  DOWNLOAD_TOKEN_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
};

const TOKEN_LIFETIME_SECONDS = 15 * 60;
const TEST_TURNSTILE_SECRET = "1x0000000000000000000000000000000AA";

const commonHeaders = {
  "Cache-Control": "private, no-store",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function isAllowedOrigin(origin: string | null, configured: string, mode: Env["RUNTIME_MODE"]) {
  if (origin === configured) return true;
  // ローカルプレビューではlocalhostと127.0.0.1が混在しやすいため同じポートだけ許可。
  // 本番のHTTPS Originにはこの例外を適用しません。
  const match = mode === "local" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.exec(configured);
  if (!match || !origin) return false;
  const alternate = match[1] === "localhost" ? "127.0.0.1" : "localhost";
  return origin === `http://${alternate}${match[2] || ""}`;
}

function jsonResponse(data: unknown, status: number, origin?: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...commonHeaders,
      ...(origin ? corsHeaders(origin) : {}),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function errorPage(status: number) {
  // URLの有効期限切れやR2障害時も、内部情報をブラウザに表示しません。
  return new Response("<!doctype html><html lang=ja><meta charset=utf-8><title>ダウンロードできませんでした</title><p>ダウンロードに失敗しました。元のページに戻り、時間をおいて再度お試しください。</p></html>", {
    status,
    headers: { ...commonHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}

function base64url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    const decoded = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    // 末尾の未使用ビットだけを変えた別表記も拒否し、トークンを一意にします。
    return base64url(decoded) === value ? decoded : null;
  } catch {
    return null;
  }
}

function textBytes(value: string) {
  return new TextEncoder().encode(value);
}

async function hmacKey(secret: string) {
  const bytes = fromBase64url(secret);
  if (!bytes || bytes.length < 32) return null;
  return crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function issueToken(year: number, secret: string) {
  const key = await hmacKey(secret);
  if (!key) return null;
  const expires = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS;
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `${year}.${expires}.${nonce}`;
  const signature = await crypto.subtle.sign("HMAC", key, textBytes(payload));
  return `${base64url(textBytes(payload))}.${base64url(new Uint8Array(signature))}`;
}

async function verifyToken(token: string, year: number, secret: string) {
  if (token.length > 300 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) return false;
  const [encodedPayload, encodedSignature] = token.split(".");
  const payloadBytes = fromBase64url(encodedPayload);
  const signature = fromBase64url(encodedSignature);
  const key = await hmacKey(secret);
  if (!payloadBytes || !signature || !key) return false;
  const payload = new TextDecoder().decode(payloadBytes);
  const match = /^(20\d{2})\.(\d{10})\.([A-Za-z0-9_-]{22})$/.exec(payload);
  if (!match || Number(match[1]) !== year) return false;
  const now = Math.floor(Date.now() / 1000);
  const expires = Number(match[2]);
  if (expires <= now || expires > now + TOKEN_LIFETIME_SECONDS) return false;
  return crypto.subtle.verify("HMAC", key, signature, payloadBytes);
}

async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", textBytes(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function equalHex(left: string, right: string) {
  if (left.length !== 64 || right.length !== 64) return false;
  // 年度コードの比較時間が最初の異なる文字で変わらないようにします。
  let difference = 0;
  for (let index = 0; index < 64; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function albumForYear(year: number) {
  return albums.find((album) => album.year === year && album.downloadEnabled && album.r2Key);
}

async function verifyTurnstile(token: string, env: Env) {
  // Cloudflareの公開テストSecretはlocalhostからだけ許可します。誤った本番設定で認証が素通りしないためです。
  const isLocal = env.RUNTIME_MODE === "local" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(env.ALLOWED_ORIGIN);
  if (env.TURNSTILE_SECRET_KEY === TEST_TURNSTILE_SECRET && !isLocal) return false;
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 10000);
  try {
    const form = new FormData();
    form.set("secret", env.TURNSTILE_SECRET_KEY);
    form.set("response", token);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: abort.signal,
    });
    if (!response.ok) return false;
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return false;
    const verdict = result as { success?: unknown; hostname?: unknown; action?: unknown };
    if (env.TURNSTILE_SECRET_KEY === TEST_TURNSTILE_SECRET && isLocal) {
      // 公式ダミートークンのSiteverify結果はhostname=example.comで、actionが付かない場合があります。
      // この緩和はlocalhostと公開テストSecretの組合せだけに限定します。
      return verdict.success === true && verdict.hostname === "example.com" &&
        (verdict.action === undefined || verdict.action === "test");
    }
    return verdict.success === true &&
      verdict.hostname === new URL(env.ALLOWED_ORIGIN).hostname &&
      verdict.action === "download";
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function authorize(request: Request, env: Env) {
  const origin = request.headers.get("Origin");
  if (!origin || !isAllowedOrigin(origin, env.ALLOWED_ORIGIN, env.RUNTIME_MODE)) return jsonResponse({ error: "forbidden" }, 403);
  if (request.headers.get("Content-Type")?.split(";")[0] !== "application/json") {
    return jsonResponse({ error: "invalid_request" }, 415, origin);
  }
  if (Number(request.headers.get("Content-Length")) > 4096) {
    return jsonResponse({ error: "invalid_request" }, 413, origin);
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 4096) return jsonResponse({ error: "invalid_request" }, 413, origin);
    input = JSON.parse(body);
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400, origin);
  }
  if (!input || typeof input !== "object") return jsonResponse({ error: "invalid_request" }, 400, origin);
  const { year, code, turnstileToken } = input as Record<string, unknown>;
  if (typeof year !== "number" || !albumForYear(year) || typeof code !== "string" || typeof turnstileToken !== "string") {
    return jsonResponse({ error: "invalid_request" }, 400, origin);
  }
  const normalizedCode = code.trim().toUpperCase();
  if (!new RegExp(`^${year}(?:-[A-Z2-9]{4}){4}$`).test(normalizedCode) || turnstileToken.length === 0 || turnstileToken.length > 2048) {
    return jsonResponse({ error: "invalid_request" }, 400, origin);
  }
  if (!env.DOWNLOAD_CODE_HASHES || !env.DOWNLOAD_TOKEN_SECRET || !env.TURNSTILE_SECRET_KEY || !env.ALBUMS) {
    return jsonResponse({ error: "unavailable" }, 503, origin);
  }

  let hashes: Record<string, unknown>;
  try {
    hashes = JSON.parse(env.DOWNLOAD_CODE_HASHES);
  } catch {
    return jsonResponse({ error: "unavailable" }, 503, origin);
  }
  if (!hashes || typeof hashes !== "object" || Array.isArray(hashes)) return jsonResponse({ error: "unavailable" }, 503, origin);
  const expectedHash = hashes[String(year)];
  if (typeof expectedHash !== "string" || !/^[a-f0-9]{64}$/.test(expectedHash)) {
    return jsonResponse({ error: "unavailable" }, 503, origin);
  }
  if (!(await verifyTurnstile(turnstileToken, env))) {
    return jsonResponse({ error: "invalid_credentials" }, 403, origin);
  }
  if (!equalHex(await sha256Hex(normalizedCode), expectedHash)) {
    return jsonResponse({ error: "invalid_credentials" }, 401, origin);
  }

  const album = albumForYear(year)!;
  // R2の実体がない年にはリンクを発行しません。利用者へ404や内部キーを見せないためです。
  if (!(await env.ALBUMS.head(album.r2Key!))) return jsonResponse({ error: "unavailable" }, 503, origin);
  const token = await issueToken(year, env.DOWNLOAD_TOKEN_SECRET);
  if (!token) return jsonResponse({ error: "unavailable" }, 503, origin);
  return jsonResponse({ token }, 200, origin);
}

async function download(request: Request, env: Env, year: number) {
  const album = albumForYear(year);
  if (!album || !env.DOWNLOAD_TOKEN_SECRET || !env.ALBUMS) return errorPage(404);
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!(await verifyToken(token, year, env.DOWNLOAD_TOKEN_SECRET))) return errorPage(403);
  const object = await env.ALBUMS.get(album.r2Key!);
  if (!object) return errorPage(503);
  // R2ObjectBody.bodyをそのままResponseへ渡し、Workerのメモリへ大容量ZIPを展開しません。
  return new Response(object.body as unknown as BodyInit, {
    headers: {
      ...commonHeaders,
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="gunma-sakkyoku-${year}.zip"`,
      "Content-Length": String(object.size),
    },
  });
}

const downloadWorker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    try {
      if (pathname === "/api/authorize") {
        if (request.method === "OPTIONS") {
          const origin = request.headers.get("Origin");
          return origin && isAllowedOrigin(origin, env.ALLOWED_ORIGIN, env.RUNTIME_MODE)
            ? new Response(null, { status: 204, headers: { ...commonHeaders, ...corsHeaders(origin) } })
            : jsonResponse({ error: "forbidden" }, 403);
        }
        if (request.method === "POST") return await authorize(request, env);
        return jsonResponse({ error: "method_not_allowed" }, 405);
      }
      const match = /^\/download\/(20\d{2})$/.exec(pathname);
      if (match && request.method === "GET") return await download(request, env, Number(match[1]));
      return errorPage(404);
    } catch {
      // R2障害などの予期しない例外でも、内部エラーやスタックを購入者へ表示しません。
      if (pathname === "/api/authorize") {
        const origin = request.headers.get("Origin");
        const allowedOrigin = origin && isAllowedOrigin(origin, env.ALLOWED_ORIGIN, env.RUNTIME_MODE) ? origin : undefined;
        return jsonResponse({ error: "unavailable" }, 503, allowedOrigin);
      }
      return errorPage(503);
    }
  },
};

export default downloadWorker;
