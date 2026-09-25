import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * ローカルWorkerからZIPを最後の1バイトまで読み、元のZIPとSHA-256を照合します。
 * ZIPをメモリに一括読み込みせず、コードの実値もログに表示しません。
 * 先に `npm run worker:dev` と `wrangler r2 object put ... --local` が必要です。
 */
const zipDirectory = process.argv[2];
if (!zipDirectory) throw new Error("使い方: node scripts/verify-local-downloads.mjs <ZIPのあるフォルダ>");
const codeText = await readFile(resolve(import.meta.dirname, "../local-output/test-codes.txt"), "utf8");

async function hashStream(stream) {
  const hash = createHash("sha256");
  let bytes = 0;
  for await (const chunk of stream) {
    hash.update(chunk);
    bytes += chunk.byteLength;
  }
  return { digest: hash.digest("hex"), bytes };
}

for (const year of [2024, 2025]) {
  const code = new RegExp(`^${year}: (.+)$`, "m").exec(codeText)?.[1];
  assert.ok(code, `${year}年のテストコードがありません`);
  const authorization = await fetch("http://localhost:8787/api/authorize", {
    method: "POST",
    headers: { Origin: "http://localhost:3000", "Content-Type": "application/json" },
    body: JSON.stringify({ year, code, turnstileToken: "XXXX.DUMMY.TOKEN.XXXX" }),
  });
  assert.equal(authorization.status, 200, `${year}年の認証に失敗しました (${authorization.status})`);
  const { token } = await authorization.json();
  const download = await fetch(`http://localhost:8787/download/${year}?token=${encodeURIComponent(token)}`);
  assert.equal(download.status, 200, `${year}年のZIP取得に失敗しました (${download.status})`);
  assert.equal(download.headers.get("content-type"), "application/zip");
  assert.ok(download.body);
  const actual = await hashStream(download.body);
  const expected = await hashStream(createReadStream(resolve(zipDirectory, `${year}.zip`)));
  assert.equal(actual.bytes, expected.bytes);
  assert.equal(actual.digest, expected.digest, `${year}年のZIPが元ファイルと異なります`);
  console.log(`${year}: ${actual.bytes.toLocaleString()} bytes をWorkerからストリーミング受信し、SHA-256一致`);
}
