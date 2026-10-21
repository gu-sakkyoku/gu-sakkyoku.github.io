import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// ブラウザーでの幅・操作確認に加え、共通化を後から誤って外さないための小さな構造テストです。
async function pageSources(directory = new URL("../src/app/", import.meta.url)) {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) pages.push(...await pageSources(new URL(`${entry.name}/`, directory)));
    else if (entry.name === "page.tsx") pages.push(await readFile(new URL(entry.name, directory), "utf8"));
  }
  return pages;
}

test("全ページのヘッダーと余白は共通ラッパーで管理する", async () => {
  for (const page of await pageSources()) {
    assert.doesNotMatch(page, /import Cheader|import Cfooter/);
    assert.match(page, /ClientWrapper|HomeContent/);
    assert.doesNotMatch(page, /<br\s*\/>\s*<br\s*\/>\s*<br\s*\/>\s*<br\s*\/>\s*<br\s*\/>\s*<br\s*\/>\s*<br\s*\/>\s*<h1/);
  }
  assert.match(await source("src/component/ClientWrapper.tsx"), /<main className=\{`site-main/);
  assert.match(await source("src/app/globals.css"), /padding-top: calc\(var\(--site-header-height\) \+ var\(--site-page-gap\)\)/);
});

test("閉じたナビを操作対象から外し、Escape・本文への移動・PC幅で閉じる", async () => {
  const header = await source("src/component/header.tsx");
  assert.match(header, /aria-expanded=\{openMenu\}/);
  assert.match(header, /inert=\{!openMenu\}/);
  assert.match(header, /event.key === "Escape"/);
  assert.match(header, /menuButton.current\?\.focus\(\)/);
  assert.match(header, /addEventListener\("focusin", closeOnOutsideFocus\)/);
  assert.match(header, /removeEventListener\("focusin", closeOnOutsideFocus\)/);
  assert.match(header, /matchMedia\("\(min-width: 64rem\)"\)/);
});

test("CSS統合後も新作告知と検索用サイト名を残し、動きの設定を尊重する", async () => {
  const home = await source("src/component/Mainpage.tsx");
  assert.match(home, /NewAlbumAnnouncement album=\{latestAlbum\} motionReady=\{announcementReady\}/);
  assert.match(home, /\{site.name\}/);
  assert.match(home, /<AlbumJackets\s*\/>/);
  assert.match(await source("src/component/AlbumJackets.tsx"), /canAnimate = reducedMotion === false/);
  assert.match(await source("src/app/globals.css"), /prefers-reduced-motion: reduce/);
});

test("ヘッダーを低くしても本文の余白とメニュー位置を同じ高さに揃える", async () => {
  const css = await source("src/app/globals.css");
  assert.match(css, /--site-header-height: 4rem;/);
  assert.match(css, /@media \(min-width: 64rem\) \{\s*:root \{\s*--site-header-height: 4\.5rem;/);
  const header = await source("src/component/header.tsx");
  assert.match(header, /height: var\(--site-header-height\)/);
  assert.match(header, /max-height: calc\(100dvh - var\(--site-header-height\)\)/);
});

test("ダウンロードは常設の移動リンクとし、PCナビでは重複させない", async () => {
  const header = await source("src/component/header.tsx");
  assert.match(header, /const downloadNavigation = \{ href: "\/download", label: "ダウンロード" \}/);
  assert.match(header, /navigation.filter\(\(\{ href \}\) => href !== downloadNavigation.href\)/);
  assert.match(header, /desktopNavigation.map/);
  assert.match(header, /<SdownloadLink href=\{downloadNavigation.href\} onClick=\{\(\) => setOpenMenu\(false\)\}/);
  assert.match(header, /const SdownloadLink = styled\(Link\)/);
  assert.match(header, /min-height: 2.75rem/);
});
