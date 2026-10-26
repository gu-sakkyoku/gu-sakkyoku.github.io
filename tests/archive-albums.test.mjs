import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { archiveAlbums } from "../src/data/archiveAlbums.ts";
import { albums } from "../src/data/albums.ts";

const source = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("旧アルバムの曲順と枚数をダウンロード一覧と共有し、元の歌詞URLを維持する", async () => {
  const expected = {
    2024: { counts: [11], lyrics: 1, video: "arK-hOelO2M" },
    2025: { counts: [14, 9], lyrics: 8, video: "iPNjS8T7ZEM" },
  };
  for (const year of [2024, 2025]) {
    const album = archiveAlbums[year];
    const original = albums.find((item) => item.year === year);
    assert.deepEqual(
      album.discs.map((disc) => disc.tracks.length),
      expected[year].counts,
    );
    assert.deepEqual(
      album.discs.map((disc) => ({
        name: disc.name,
        tracks: disc.tracks.map((track) => track.title),
      })),
      original.discs,
    );
    assert.equal(album.detailPath, original.detailPath);
    assert.equal(album.artwork, original.artwork);
    assert.equal(album.crossfadeVideoId, expected[year].video);
    const lyrics = album.discs
      .flatMap((disc) => disc.tracks)
      .filter((track) => track.lyricPath);
    assert.equal(lyrics.length, expected[year].lyrics);
    for (const track of lyrics)
      await access(
        new URL(`../src/app${track.lyricPath}page.tsx`, import.meta.url),
      );
  }
  assert.ok(
    archiveAlbums[2025].discs
      .flatMap((disc) => disc.tracks)
      .every((track) => track.credits?.length),
  );
  assert.ok(
    archiveAlbums[2024].discs
      .flatMap((disc) => disc.tracks)
      .every((track) => !track.credits),
  );
});

test("9曲の元の本文・改行・タイトル・画像の記述をデザイン変更で書き換えない", async () => {
  // 変更前のh1からラッパー末尾までをそのまま比較。歌詞の編集時は原稿を確認して更新します。
  const hashes = {
    "Horoscope/cant":
      "ed126e5e435275d6d37633228cd9ec0c5f97139e32b72d0734f9bf335c7b1b54",
    "Horoscope/fead":
      "ed82b746a04cdb1722aca6457ccbf33710ef77543e94162c5a9ca7b085625823",
    "Horoscope/fuwa":
      "aeaea38f549e11b458a462515c99588a8ec2fd68f4836434806642ca909aceac",
    "Horoscope/hoshikuzu":
      "e65368f5b8714446ade06c7f74cc38b39f3eac1fdbd9340252297fb1d2c5df34",
    "Horoscope/melt":
      "251b25f175a1a831210e8a9edc480f25787ee0ab2c7615a25d004cf299a02e1a",
    "Horoscope/mosimo":
      "8f46171ebc4deedfe39686c8043e907dd78a3fd10bbe7ca9f9d4c3684fe84216",
    "Horoscope/tameiki":
      "c2d715a807d816379b072398110dfff427eafa70ad1fa1359849961e9b739a14",
    "Horoscope/teza":
      "06be823bd69c2e4dad822682c52876cf301127e09a3b06837ce81acbcc264a49",
    "Nijiiro/kumori":
      "35825c4330318a512fa145f78ae1c7655c4d89c061b17b529f885ae681d54266",
  };
  for (const [route, hash] of Object.entries(hashes)) {
    const text = await source(`src/app/${route}/page.tsx`);
    const body = text.slice(
      text.indexOf("<h1"),
      text.lastIndexOf("</ClientWrapper>"),
    );
    assert.equal(createHash("sha256").update(body).digest("hex"), hash, route);
  }
});
