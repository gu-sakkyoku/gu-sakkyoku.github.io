import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { albums } from "../src/data/albums.ts";
import worker from "../worker/src/index.ts";

// ここで使うコードは単体テスト専用の固定値です。配布カードのコードとは無関係です。
const code2024 = "2024-ABCD-EFGH-JKLM-NPQR";
const code2025 = "2025-ABCD-EFGH-JKLM-NPQR";
const code2026 = "2026-ABCD-EFGH-JKLM-NPQR";
const issuedCodes = [[2024, code2024], [2025, code2025], [2026, code2026]];
const origin = "http://localhost:3000";
const hashes = {
  2024: createHash("sha256").update(code2024).digest("hex"),
  2025: createHash("sha256").update(code2025).digest("hex"),
  2026: createHash("sha256").update(code2026).digest("hex"),
};
const zipBytes = new TextEncoder().encode("PK\x03\x04test fixture");
const tokenSecret = Buffer.alloc(32, 7).toString("base64url");
const publishedKeys = new Set(issuedCodes.map(([year]) => `albums/${year}.zip`));

const storage = {
  async head(key) {
    return publishedKeys.has(key) ? { size: zipBytes.length } : null;
  },
  async get(key) {
    if (!publishedKeys.has(key)) return null;
    return {
      size: zipBytes.length,
      body: new ReadableStream({ start(controller) { controller.enqueue(zipBytes); controller.close(); } }),
    };
  },
};
const env = {
  ALBUMS: storage,
  ALLOWED_ORIGIN: origin,
  RUNTIME_MODE: "local",
  DOWNLOAD_CODE_HASHES: JSON.stringify(hashes),
  DOWNLOAD_TOKEN_SECRET: tokenSecret,
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
};

const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.equal(options.body.get("secret"), env.TURNSTILE_SECRET_KEY);
  return Response.json({ success: true, hostname: "example.com" });
};
process.on("exit", () => { globalThis.fetch = originalFetch; });

function post(year, code, requestOrigin = origin, token = "XXXX.DUMMY.TOKEN.XXXX", extraEnv = {}) {
  return worker.fetch(new Request("http://localhost:8787/api/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: requestOrigin },
    body: JSON.stringify({ year, code, turnstileToken: token }),
  }), { ...env, ...extraEnv });
}

// 修正版の公開後も同じコードで再開できるかを、実際の公開設定を変更せずに検証します。
// グローバルの年度データを使うため、変更はこの逐次実行のテスト内だけに限定し必ず戻します。
async function withEnabledAlbum(year, check) {
  const album = albums.find((item) => item.year === year);
  const wasEnabled = album.downloadEnabled;
  album.downloadEnabled = true;
  try {
    return await check();
  } finally {
    album.downloadEnabled = wasEnabled;
  }
}

test("正しい年度コードだけが短時間のダウンロードURLを取得できる", async () => {
  for (const [year, code] of issuedCodes.filter(([year]) => albums.find((album) => album.year === year)?.downloadEnabled)) {
    const authorized = await post(year, code);
    assert.equal(authorized.status, 200);
    assert.equal(authorized.headers.get("Access-Control-Allow-Origin"), origin);
    const { token } = await authorized.json();
    assert.match(token, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const download = await worker.fetch(new Request(`http://localhost:8787/download/${year}?token=${token}`), env);
    assert.equal(download.status, 200);
    assert.equal(download.headers.get("Content-Type"), "application/zip");
    assert.equal(download.headers.get("Content-Length"), String(zipBytes.length));
    assert.equal(download.headers.get("Content-Disposition"), `attachment; filename="gunma-sakkyoku-${year}.zip"`);
    assert.deepEqual(new Uint8Array(await download.arrayBuffer()), zipBytes);
    const wrongYear = year === 2024 ? 2025 : 2024;
    assert.equal((await worker.fetch(new Request(`http://localhost:8787/download/${wrongYear}?token=${token}`), env)).status, 403);
  }
});

test("コード誤り、未登録年度、異なるOrigin、直接URLを拒否する", async () => {
  assert.equal((await post(2024, "2024-AAAA-AAAA-AAAA-AAAA")).status, 401);
  assert.equal((await post(2027, "2027-AAAA-AAAA-AAAA-AAAA")).status, 400);
  assert.equal((await post(2026, code2025)).status, 400);
  const foreign = await post(2024, code2024, "https://evil.example");
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal((await worker.fetch(new Request("http://localhost:8787/download/2024"), env)).status, 403);
  assert.equal((await worker.fetch(new Request("http://localhost:8787/download/2026?token=fake"), env)).status, 404);
  assert.equal((await worker.fetch(new Request("http://localhost:8787/download/2027?token=fake"), env)).status, 404);
});

test("停止中の2026は正しいコードと停止前の有効トークンがあっても取得できない", async () => {
  const album = albums.find((item) => item.year === 2026);
  assert.equal(album?.r2Key, "albums/2026.zip");
  assert.equal(album?.downloadEnabled, false);
  assert.equal(album?.unavailableReason, "paused");
  // 停止前に取得した有効リンクを再現し、画面だけの停止ではないことを確かめます。
  const { token } = await withEnabledAlbum(2026, async () => {
    const response = await post(2026, code2026);
    assert.equal(response.status, 200);
    return response.json();
  });
  let storageReads = 0;
  const stoppedEnv = {
    ALBUMS: {
      async head() { storageReads++; throw new Error("paused album must not read R2"); },
      async get() { storageReads++; throw new Error("paused album must not read R2"); },
    },
  };
  const rejected = await post(2026, code2026, origin, "XXXX.DUMMY.TOKEN.XXXX", stoppedEnv);
  assert.equal(rejected.status, 400);
  assert.equal("token" in await rejected.json(), false);
  const stoppedDownload = await worker.fetch(new Request(`http://localhost:8787/download/2026?token=${token}`), { ...env, ...stoppedEnv });
  assert.equal(stoppedDownload.status, 404);
  assert.equal(stoppedDownload.headers.get("Content-Disposition"), null);
  assert.equal(storageReads, 0);
  assert.equal(albums.find((item) => item.year === 2024)?.downloadEnabled, true);
  assert.equal(albums.find((item) => item.year === 2025)?.downloadEnabled, true);
});

test("再開後の2026のハッシュ登録が欠けた場合は安全に停止する", async () => withEnabledAlbum(2026, async () => {
  const previousYearHashes = { 2024: hashes[2024], 2025: hashes[2025] };
  const response = await post(2026, code2026, origin, "XXXX.DUMMY.TOKEN.XXXX", {
    DOWNLOAD_CODE_HASHES: JSON.stringify(previousYearHashes),
  });
  assert.equal(response.status, 503);
  assert.equal("token" in await response.json(), false);
}));

test("トークン改ざんと有効期限切れを拒否する", async () => {
  const { token } = await (await post(2024, code2024)).json();
  const tampered = `${token.slice(0, -1)}${token.endsWith("A") ? "B" : "A"}`;
  assert.equal((await worker.fetch(new Request(`http://localhost:8787/download/2024?token=${tampered}`), env)).status, 403);
  const originalNow = Date.now;
  Date.now = () => originalNow() + 16 * 60 * 1000;
  try {
    assert.equal((await worker.fetch(new Request(`http://localhost:8787/download/2024?token=${token}`), env)).status, 403);
  } finally {
    Date.now = originalNow;
  }
});

test("本番Originでテスト用Turnstile Secretを使用できない", async () => {
  const productionOrigin = "https://gu-sakkyoku.github.io";
  const rejected = await post(2024, code2024, productionOrigin, "XXXX.DUMMY.TOKEN.XXXX", { ALLOWED_ORIGIN: productionOrigin });
  assert.equal(rejected.status, 403);
  const localOriginButProductionMode = await post(2024, code2024, origin, "XXXX.DUMMY.TOKEN.XXXX", { RUNTIME_MODE: "production" });
  assert.equal(localOriginButProductionMode.status, 403);
});

test("ローカルの127.0.0.1とlocalhostは同一ポートだけ許可する", async () => {
  const local = await post(2024, code2024, "http://127.0.0.1:3000");
  assert.equal(local.status, 200);
  assert.equal(local.headers.get("Access-Control-Allow-Origin"), "http://127.0.0.1:3000");
  assert.equal((await post(2024, code2024, "http://127.0.0.1:3001")).status, 403);
});

test("本番Turnstileは公開hostnameとdownloadアクションの両方を要求する", async () => {
  const configuredOrigin = "https://gu-sakkyoku.github.io";
  const productionEnv = {
    ...env,
    ALLOWED_ORIGIN: configuredOrigin,
    RUNTIME_MODE: "production",
    TURNSTILE_SECRET_KEY: "production-secret-fixture",
  };
  const request = new Request("https://worker.example/api/authorize", {
    method: "POST",
    headers: { Origin: configuredOrigin, "Content-Type": "application/json" },
    body: JSON.stringify({ year: 2024, code: code2024, turnstileToken: "valid-token-fixture" }),
  });
  const previousFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ success: true, hostname: "gu-sakkyoku.github.io", action: "download" });
    assert.equal((await worker.fetch(request.clone(), productionEnv)).status, 200);
    globalThis.fetch = async () => Response.json({ success: true, hostname: "evil.example", action: "download" });
    assert.equal((await worker.fetch(request.clone(), productionEnv)).status, 403);
    globalThis.fetch = async () => Response.json({ success: true, hostname: "gu-sakkyoku.github.io", action: "login" });
    assert.equal((await worker.fetch(request.clone(), productionEnv)).status, 403);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test("R2にZIPがない場合はリンクを発行しない", async () => {
  for (const [year, code] of issuedCodes) {
    await withEnabledAlbum(year, async () => {
      const response = await post(year, code, origin, "XXXX.DUMMY.TOKEN.XXXX", {
        ALBUMS: { ...storage, async head() { return null; } },
      });
      assert.equal(response.status, 503);
      assert.equal("token" in await response.json(), false);
    });
  }
});

test("2026は同じ年度コードのまま配信を再開できる", async () => withEnabledAlbum(2026, async () => {
  const authorized = await post(2026, code2026);
  assert.equal(authorized.status, 200);
  const { token } = await authorized.json();
  const download = await worker.fetch(new Request(`http://localhost:8787/download/2026?token=${token}`), env);
  assert.equal(download.status, 200);
  assert.deepEqual(new Uint8Array(await download.arrayBuffer()), zipBytes);
}));

test("R2障害時は内部情報を出さずに失敗を案内する", async () => {
  const brokenStorage = {
    async head() { throw new Error("internal R2 stack fixture"); },
    async get() { throw new Error("internal R2 stack fixture"); },
  };
  const authorize = await post(2024, code2024, origin, "XXXX.DUMMY.TOKEN.XXXX", { ALBUMS: brokenStorage });
  assert.equal(authorize.status, 503);
  assert.equal(authorize.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(JSON.stringify(await authorize.json()).includes("internal R2"), false);

  const { token } = await (await post(2024, code2024)).json();
  const download = await worker.fetch(new Request(`http://localhost:8787/download/2024?token=${token}`), { ...env, ALBUMS: brokenStorage });
  assert.equal(download.status, 503);
  assert.match(await download.text(), /ダウンロードに失敗しました/);
});
