import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { site, websiteSchema } from "../src/data/site.ts";

const sharp = createRequire(import.meta.resolve("next"))("sharp");

test("検索の希望サイト名を英語表記に揃え、日本語名も残す", () => {
  assert.equal(site.name, "GU sakkyoku");
  assert.equal(websiteSchema.name, site.name);
  assert.equal(websiteSchema.url, site.url);
  assert.equal(websiteSchema["@type"], "WebSite");
  assert.ok(websiteSchema.alternateName.includes("群馬大学作曲部"));
  assert.ok(site.title.includes("群馬大学作曲部"));
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
  assert.match(header, /src=\{site.logo\}/);
  assert.match(header, /width=\{site.logoSize\}/);
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
