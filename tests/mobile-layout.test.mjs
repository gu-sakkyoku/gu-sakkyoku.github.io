import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("狭いカード内でも認証枠が収まる公式コンパクト表示を使う", async () => {
  const download = await source("src/component/DownloadArchive.tsx");
  assert.match(download, /api.render\(widgetContainer.current, \{[\s\S]*?size: "compact",/);
  assert.match(download, /className="mt-4 flex min-h-36 justify-center" aria-label="認証チェック"/);
  // 見た目の修正で、既存のトークン確認・サーバー送信を外していないことも確認します。
  assert.match(download, /callback: setTurnstileToken/);
  assert.match(download, /if \(!turnstileToken\)/);
  assert.match(download, /action: "download"/);
  assert.match(download, /JSON.stringify\(\{ year, code: code.trim\(\).toUpperCase\(\), turnstileToken \}\)/);
});

test("スマホのコード入力欄は16px相当の文字で読みやすくする", async () => {
  const download = await source("src/component/DownloadArchive.tsx");
  const input = download.match(/<input[\s\S]*?\/>/)[0];
  assert.match(input, /font-mono text-base/);
  assert.match(input, /w-full/);
  assert.match(input, /required/);
  assert.match(input, /maxLength=\{32\}/);
});

test("M3見出しを意味のあるまとまりで折り返し、1文字だけの行を避ける", async () => {
  const event = await source("src/component/AlbumEventNotice.tsx");
  assert.match(event, /<span className="inline-block">\{event.name\}<\/span>/);
  assert.match(event, /<span className="inline-block">出展情報<\/span>/);
  assert.match(event, /text-balance/);
});
