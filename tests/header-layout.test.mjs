import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { albums } from "../src/data/albums.ts";
import { albumNavigation, downloadNavigation, isCurrentPath } from "../src/data/navigation.ts";

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
  const wrapper = await source("src/component/ClientWrapper.tsx");
  assert.match(wrapper, /<main id="main" className=\{`site-main/);
  assert.match(wrapper, /href="#main" className="site-skip-link"/);
  assert.match(await source("src/app/globals.css"), /padding-top: calc\(var\(--site-header-height\) \+ var\(--site-page-gap\)\)/);
});

test("スマホのメニューはAstryxの引き出しに任せ、PC幅へ広げたら閉じる", async () => {
  const header = await source("src/component/header.tsx");
  // Escape・背景クリック・フォーカスの戻し方は MobileNav が受け持ちます。
  assert.match(header, /<MobileNav isOpen=\{menuOpen\} onOpenChange=\{setMenuOpen\}/);
  assert.match(header, /label=\{menuOpen \? "メニューを閉じる" : "メニューを開く"\}/);
  assert.match(header, /matchMedia\("\(min-width: 64rem\)"\)/);
  assert.match(header, /removeEventListener\("change", closeOnDesktop\)/);
  assert.match(header, /onClick=\{\(\) => setMenuOpen\(false\)\}/);
});

test("メニューの作品は年度データから作り、現在地を歌詞ページでも示す", () => {
  assert.deepEqual(albumNavigation.map((item) => item.year), [...albums].map((album) => album.year).sort((a, b) => b - a));
  assert.ok(albumNavigation.every((item) => item.href.startsWith("/") && item.href.endsWith("/")));
  assert.equal(isCurrentPath("/Horoscope/fuwa/", "/Horoscope/"), true);
  assert.equal(isCurrentPath("/Horoscope", "/Horoscope/"), true);
  assert.equal(isCurrentPath("/TansanYohou/harukaze/", "/Horoscope/"), false);
  assert.equal(isCurrentPath("/download/", "/"), false);
  assert.equal(isCurrentPath("/", "/"), true);
});

test("ヘッダーを低くしても本文の余白とメニュー位置を同じ高さに揃える", async () => {
  const css = await source("src/app/globals.css");
  assert.match(css, /--site-header-height: 4rem;/);
  assert.match(css, /@media \(min-width: 64rem\) \{\s*:root \{\s*--site-header-height: 4\.5rem;/);
  assert.match(css, /\.site-header \{[^}]*height: var\(--site-header-height\)/);
  assert.match(css, /scroll-margin-top: calc\(var\(--site-header-height\) \+ 1rem\)/);
});

test("ダウンロードは常設の移動リンクとし、作品メニューとは重複させない", async () => {
  assert.deepEqual(downloadNavigation, { href: "/download/", label: "ダウンロード" });
  assert.ok(albumNavigation.every((item) => item.href !== downloadNavigation.href));
  const header = await source("src/component/header.tsx");
  assert.match(header, /label=\{downloadNavigation\.label\}\s*href=\{downloadNavigation\.href\}/);
});

test("動きを減らす設定を尊重し、検索用サイト名をトップに残す", async () => {
  assert.match(await source("src/component/NewAlbumAnnouncement.tsx"), /\{site\.name\}/);
  assert.match(await source("src/component/AlbumMotion.tsx"), /prefers-reduced-motion: reduce/);
  assert.match(await source("src/app/globals.css"), /prefers-reduced-motion: reduce/);
});
