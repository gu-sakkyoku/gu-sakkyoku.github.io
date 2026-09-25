import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import QRCode from "qrcode";
import { albums as albumMetadata } from "../src/data/albums.ts";

/**
 * テスト用の年度共通コードとカードをローカルにだけ作ります。
 * 既存のコードを誤って再発行しないよう、出力ファイルがあれば処理を止めます。
 * 2027年以降の本番コードはCloudflare Secretに別途登録してください。
 */
const root = resolve(import.meta.dirname, "..");
const downloadUrl = process.env.DOWNLOAD_URL || "https://gu-sakkyoku.github.io/download/";
const parsedUrl = new URL(downloadUrl);
if (parsedUrl.protocol !== "https:" || parsedUrl.pathname !== "/download/" || parsedUrl.search || parsedUrl.hash) {
  throw new Error("DOWNLOAD_URLは https://<公開ドメイン>/download/ の形にしてください");
}

const codeOutput = resolve(root, "local-output/test-codes.txt");
try {
  await readFile(codeOutput);
  throw new Error("テストコードは発行済みです。再実行で上書きしないため停止しました。");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function generateCode(year) {
  const chars = Array.from(randomBytes(16), (byte) => alphabet[byte & 31]);
  return `${year}-${chars.join("").match(/.{4}/g).join("-")}`;
}

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const albums = albumMetadata.filter((album) => album.downloadEnabled && album.r2Key);
const codes = Object.fromEntries(albums.map(({ year }) => [year, generateCode(year)]));
const hashes = Object.fromEntries(Object.entries(codes).map(([year, code]) => [year, createHash("sha256").update(code).digest("hex")]));
const tokenSecret = randomBytes(32).toString("base64url");
const qrSvg = await QRCode.toString(downloadUrl, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 4,
  width: 640,
  color: { dark: "#172554", light: "#FFFFFF" },
});
const qrPngData = await QRCode.toDataURL(downloadUrl, {
  type: "image/png",
  errorCorrectionLevel: "H",
  margin: 4,
  width: 600,
  color: { dark: "#172554", light: "#FFFFFF" },
});

await mkdir(resolve(root, "local-output/cards"), { recursive: true });
for (const { year, title } of albums) {
  const cardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-label="${year}年のテスト用ダウンロードカード">
  <rect width="1200" height="720" rx="36" fill="#eff6ff"/>
  <rect x="28" y="28" width="1144" height="664" rx="24" fill="white" stroke="#1e3a8a" stroke-width="5"/>
  <text x="72" y="96" font-size="36" font-family="sans-serif" fill="#1e3a8a">群馬大学作曲部 / Music Download</text>
  <text x="72" y="156" font-size="31" font-family="sans-serif" font-weight="bold" fill="#991b1b">TEST CARD — 公開・頒布しないでください</text>
  <image x="72" y="206" width="420" height="420" href="${qrPngData}"/>
  <text x="540" y="275" font-size="56" font-family="sans-serif" font-weight="bold" fill="#172554">${year}</text>
  <text x="540" y="345" font-size="43" font-family="sans-serif" fill="#172554">${escapeXml(title)}</text>
  <text x="540" y="435" font-size="26" font-family="sans-serif" fill="#334155">QRを読み取り、下のコードを入力</text>
  <text x="540" y="502" font-size="31" font-family="monospace" font-weight="bold" fill="#172554">${codes[year]}</text>
  <text x="72" y="661" font-size="26" font-family="monospace" fill="#1e3a8a">${escapeXml(downloadUrl)}</text>
</svg>`;
  await writeFile(resolve(root, `local-output/cards/${year}-test-card.svg`), cardSvg, { flag: "wx" });
}

// 公開QRにはコードを含めません。2024も2025も同じURLだけを指します。
await writeFile(resolve(root, "public/download-qr.svg"), qrSvg);
await writeFile(codeOutput, `ローカルテスト専用（本番のカードに印刷しない）\nQR: ${downloadUrl}\n2024: ${codes[2024]}\n2025: ${codes[2025]}\n`, { flag: "wx", mode: 0o600 });
await writeFile(resolve(root, "worker/.dev.vars"),
  `ALLOWED_ORIGIN="http://localhost:3000"\nRUNTIME_MODE="local"\nDOWNLOAD_CODE_HASHES='${JSON.stringify(hashes)}'\nDOWNLOAD_TOKEN_SECRET="${tokenSecret}"\nTURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"\n`,
  { flag: "wx", mode: 0o600 });
await writeFile(resolve(root, ".env.local"),
  "NEXT_PUBLIC_DOWNLOAD_WORKER_URL=http://localhost:8787\nNEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA\n",
  { flag: "wx", mode: 0o600 });
console.log("共通QR、2024/2025テストカード、ローカル設定を作成しました。");
console.log("コードは local-output/test-codes.txt を開いて確認してください（Gitには含まれません）。");
