import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { albums } from "../src/data/albums.ts";

/**
 * 配布カード用の年度共通コードを、Git管理外のlocal-outputだけに発行します。
 * 使い方: node scripts/generate-production-codes.mjs 2024 2025
 * 既存年度のコードを再発行しないため、すでに記録された年はエラーにします。
 */
const requestedYears = process.argv.slice(2).map(Number);
if (!requestedYears.length || new Set(requestedYears).size !== requestedYears.length) {
  throw new Error("年度を重複なく指定してください（例: 2024 2025）");
}
const years = requestedYears.sort((a, b) => a - b);
for (const year of years) {
  // 公開前にコードとZIPを準備できるよう、downloadEnabledがfalseでも発行できます。
  // ただし、配信先のR2キーが決まっていない年度（例: 準備中の2026）は拒否します。
  if (!Number.isInteger(year) || !albums.some((album) => album.year === year && album.r2Key)) {
    throw new Error(`${year}年はR2キーを設定したアルバム情報がありません`);
  }
}

const outputDir = resolve(import.meta.dirname, "../local-output");
const codesPath = resolve(outputDir, `production-codes-${years.join("-")}.txt`);
const hashesPath = resolve(outputDir, "production-code-hashes.json");
let previousHashes = {};
try {
  previousHashes = JSON.parse(await readFile(hashesPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (!previousHashes || typeof previousHashes !== "object" || Array.isArray(previousHashes)) {
  throw new Error("既存のハッシュファイル形式が不正です");
}
for (const year of years) {
  if (Object.hasOwn(previousHashes, year)) throw new Error(`${year}年のコードは既に発行済みです`);
}

// 32文字の読み間違えにくい文字集合から16文字を発行します（80ビット）。
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const codes = Object.fromEntries(years.map((year) => {
  const chars = Array.from(randomBytes(16), (byte) => alphabet[byte & 31]);
  return [year, `${year}-${chars.join("").match(/.{4}/g).join("-")}`];
}));
const newHashes = Object.fromEntries(years.map((year) => [
  year,
  createHash("sha256").update(codes[year]).digest("hex"),
]));

await mkdir(outputDir, { recursive: true });
await writeFile(
  codesPath,
  `部内限定・本番ダウンロードカード用。GitHubや公開チャットには貼らないでください。\n${years.map((year) => `${year}: ${codes[year]}`).join("\n")}\n`,
  { flag: "wx", mode: 0o600 },
);
const temporaryHashesPath = resolve(outputDir, `.production-code-hashes-${randomUUID()}.tmp`);
await writeFile(temporaryHashesPath, `${JSON.stringify({ ...previousHashes, ...newHashes }, null, 2)}\n`, { flag: "wx", mode: 0o600 });
await rename(temporaryHashesPath, hashesPath);

console.log(`本番コードを保存しました: ${codesPath}`);
console.log(`Worker Secret用ハッシュを保存しました: ${hashesPath}`);
console.log("コードの実値は標準出力に表示していません。安全な部内保管先へ移し、カード原稿だけに記載してください。");
