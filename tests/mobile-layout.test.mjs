import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("狭い画面でも認証枠が収まる公式コンパクト表示を使う", async () => {
  const download = await source("src/component/DownloadArchive.tsx");
  assert.match(download, /api.render\(widgetContainer.current, \{[\s\S]*?size: "compact",/);
  assert.match(download, /className="download-turnstile" aria-label="認証チェック"/);
  // コンパクト版（高さ140px）の場所を先に確保し、表示後にボタンが動かないようにします。
  assert.match(await source("src/app/worlds/shared.css"), /\.download-turnstile \{[^}]*min-height: 9rem;/);
  // 見た目の修正で、既存のトークン確認・サーバー送信を外していないことも確認します。
  assert.match(download, /callback: setTurnstileToken/);
  assert.match(download, /if \(!turnstileToken\)/);
  assert.match(download, /action: "download"/);
  assert.match(download, /JSON.stringify\(\{ year, code: code.trim\(\).toUpperCase\(\), turnstileToken \}\)/);
});

test("スマホのコード入力欄は16px以上の文字で、長すぎる入力を切り詰める", async () => {
  const download = await source("src/component/DownloadArchive.tsx");
  const input = download.match(/<TextInput[\s\S]*?\/>/)[0];
  assert.match(input, /label="ダウンロードコード"/);
  assert.match(input, /width="100%"/);
  assert.match(input, /isRequired/);
  assert.match(input, /autoComplete="off"/);
  assert.match(input, /slice\(0, maxCodeLength\)/);
  assert.match(download, /const maxCodeLength = 32;/);
  // 16px未満だとiPhoneで入力時に画面が拡大されます。
  const css = await source("src/app/worlds/shared.css");
  const size = Number(css.match(/\.download-code-control input \{[^}]*font-size: ([\d.]+)rem;/)[1]);
  assert.ok(size >= 1);
});

test("送信前の形式確認はWorkerと同じ形で、合否の判定はWorkerに任せる", async () => {
  const download = await source("src/component/DownloadArchive.tsx");
  const worker = await source("worker/src/index.ts");
  const pattern = "^${year}(?:-[A-Z2-9]{4}){4}$";
  assert.ok(download.includes(pattern));
  assert.ok(worker.includes(pattern));
  // コードそのものやハッシュを画面側へ持ち込まない。
  assert.doesNotMatch(download, /DOWNLOAD_CODE_HASHES|createHash|subtle\.digest/);
});

test("M3見出しを意味のあるまとまりで折り返し、1文字だけの行を避ける", async () => {
  const event = await source("src/component/AlbumEventNotice.tsx");
  assert.match(event, /<span className="inline-block">\{event.name\}<\/span>/);
  assert.match(event, /<span className="inline-block">出展情報<\/span>/);
});
