import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import postcss from "postcss";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("追加した装飾CSSは新テーマ内に限定し、旧作品の見た目へ波及させない", async () => {
  const css = await source("src/app/soda-pop.css");
  postcss.parse(css).walkRules((rule) => {
    // :where内のカンマと、複数のCSSセレクターの区切りを混同しないようにします。
    let depth = 0;
    const selectors = [""];
    for (const character of rule.selector) {
      if (character === "(") depth++;
      if (character === ")") depth--;
      if (character === "," && depth === 0) selectors.push("");
      else selectors[selectors.length - 1] += character;
    }
    for (const selector of selectors) assert.match(selector.trim(), /^\.tansan-white-theme(?:\s|$)/);
  });
  for (const page of ["Horoscope", "Nijiiro"]) {
    assert.doesNotMatch(await source(`src/app/${page}/page.tsx`), /tansan-white-theme|soda-pop/);
  }
});

test("年度リンクも曲数も公開アルバム情報から表示し、個別のコードをUIへ置かない", async () => {
  const page = await source("src/app/download/page.tsx");
  assert.match(page, /aria-label="ダウンロードする年度を選ぶ"/);
  assert.match(page, /albums\]\.sort/);
  assert.match(page, /href=\{`#album-\$\{album.year\}`\}/);
  const archive = await source("src/component/DownloadArchive.tsx");
  assert.match(archive, /album.discs.reduce/);
  assert.match(archive, /selectedYear === album.year\s*\?\s*"コード入力を閉じる"\s*:\s*"ダウンロードはこちらから"/);
  assert.doesNotMatch(page + archive, /const (?:CODE|SECRET)\s*=/);
});

test("新しいアイコンは装飾に限定し、動きを減らす設定と小さな画面にも対応する", async () => {
  const icon = await source("src/component/SodaIcon.tsx");
  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /focusable="false"/);
  const css = await source("src/app/soda-pop.css");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.match(css, /max-width: 24rem/);
  assert.match(css, /hover: hover\) and \(pointer: fine/);
  assert.doesNotMatch(css, /animation:[^;]*infinite/);
});
