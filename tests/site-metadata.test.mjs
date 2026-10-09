import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { site, websiteSchema } from "../src/data/site.ts";

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
