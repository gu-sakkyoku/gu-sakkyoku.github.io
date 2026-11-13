import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { organizationSchema, site, websiteSchema } from "../src/data/site.ts";
import { contactNavigation } from "../src/data/navigation.ts";

const sharp = createRequire(import.meta.resolve("next"))("sharp");

test("検索の希望サイト名を、タイトル・見出し・構造化データ・og:site_name で同じ「群馬大学作曲部」に揃える", async () => {
  assert.equal(site.name, "群馬大学作曲部");
  assert.equal(websiteSchema.name, site.name);
  assert.equal(websiteSchema.url, site.url);
  assert.equal(websiteSchema["@type"], "WebSite");
  assert.ok(site.title.startsWith(site.name));
  // 英語表記・略称は別名として残し、最後の候補にサイトのアドレスを置きます（Googleの案内どおり）。
  assert.deepEqual(websiteSchema.alternateName, ["GU sakkyoku", "群大作曲部", "gu-sakkyoku.github.io"]);
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /siteName: site\.name/);
});

test("検索・Apple用アイコンはクロールできるpublic内の正方形PNG", async () => {
  for (const [path, size] of [[site.icon, 192], [site.appleIcon, 180]]) {
    const png = await readFile(new URL(`../public${path}`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
});

test("既定faviconも48px・96pxのロゴPNGを含むICO", async () => {
  const ico = await readFile(new URL("../src/app/favicon.ico", import.meta.url));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 2);
  for (const [index, size] of [48, 96].entries()) {
    const entry = 6 + index * 16;
    const offset = ico.readUInt32LE(entry + 12);
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    assert.equal(ico.subarray(offset + 1, offset + 4).toString(), "PNG");
  }
});

test("正式な青色ロゴをヘッダーと共有画像で共用し、透過を維持する", async () => {
  assert.equal(site.logo, "/site-logo-blue.png");
  const logo = await readFile(new URL(`../public${site.logo}`, import.meta.url));
  const metadata = await sharp(logo).metadata();
  assert.equal(metadata.width, site.logoSize);
  assert.equal(metadata.height, site.logoSize);
  assert.equal(metadata.hasAlpha, true);
  const { data, info } = await sharp(logo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(data[3], 0, "左上の透明余白を白背景で塗りつぶさない");
  assert.equal(info.channels, 4);
  const header = await readFile(new URL("../src/component/header.tsx", import.meta.url), "utf8");
  // 明るい世界では青色版、暗い世界（Horoscope）では支給された白色版を使います。
  // ヘッダーには、元のPNGから作った軽い縮小版（320px四方のWebP）を表示します。
  assert.match(header, /const logo = onDark \? site\.headerLogoOnDark : site\.headerLogo;/);
  assert.match(header, /const logoSize = site\.headerLogoSize;/);
  assert.match(header, /width=\{logoSize\}/);
  for (const path of [site.headerLogo, site.headerLogoOnDark]) {
    const small = await readFile(new URL(`../public${path}`, import.meta.url));
    const info = await sharp(small).metadata();
    assert.equal(info.format, "webp");
    assert.equal(info.width, site.headerLogoSize);
    assert.equal(info.hasAlpha, true, "ヘッダーの色が透けて見えるよう、透明部分を残す");
    assert.ok(small.length < 30_000, `${path} は30KB未満にする（元のPNGは最大113KB）`);
  }
  assert.equal(site.logoOnDark, "/site-logo-white.png");
  const darkLogo = await sharp(await readFile(new URL(`../public${site.logoOnDark}`, import.meta.url))).metadata();
  assert.equal(darkLogo.width, site.logoOnDarkSize);
  assert.equal(darkLogo.height, site.logoOnDarkSize);
  assert.equal(darkLogo.hasAlpha, true);
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /width: site.logoSize/);
  assert.match(layout, /height: site.logoSize/);
});

test("検索・Apple・ICOの全画像は現在の正式ロゴから生成されている", async () => {
  const logo = await readFile(new URL(`../public${site.logo}`, import.meta.url));
  for (const [path, size] of [[site.icon, 192], [site.appleIcon, 180]]) {
    const expected = await sharp(logo).resize(size, size, { fit: "contain" }).png().toBuffer();
    assert.deepEqual(await readFile(new URL(`../public${path}`, import.meta.url)), expected);
  }
  const ico = await readFile(new URL("../src/app/favicon.ico", import.meta.url));
  for (const [index, size] of [48, 96].entries()) {
    const entry = 6 + index * 16;
    const offset = ico.readUInt32LE(entry + 12);
    const length = ico.readUInt32LE(entry + 8);
    const expected = await sharp(logo).resize(size, size, { fit: "contain" }).png().toBuffer();
    assert.deepEqual(ico.subarray(offset, offset + length), expected);
  }
});

test("トップに作曲部（団体）の構造化データを載せ、公式のX・YouTubeと結ぶ", async () => {
  const accounts = contactNavigation.map((item) => item.href).filter((href) => href.startsWith("https://"));
  const organization = organizationSchema(accounts);
  assert.equal(organization["@type"], "Organization");
  assert.equal(organization.name, site.name);
  assert.equal(organization.url, site.url);
  assert.equal(organization.logo, "https://gu-sakkyoku.github.io/site-logo-blue.png");
  assert.deepEqual(organization.sameAs, ["https://x.com/GUsakkyoku", "https://www.youtube.com/@gusakkyoku"]);
  const page = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /organizationSchema\(officialAccounts\)/);
});
