import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { album2026 } from "../src/data/album2026.ts";
import { albums } from "../src/data/albums.ts";
import { lyrics2026 } from "../src/data/lyrics2026.ts";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const tracks = album2026.discs.flatMap((disc) => disc.tracks);
const lyricSlugs = tracks.flatMap((track) => track.lyricSlug ? [track.lyricSlug] : []);

test("2026年の正式曲目・曲順を作品ページとダウンロード一覧で共有する", () => {
  assert.equal(album2026.title, "炭酸予報");
  assert.deepEqual(album2026.discs.map((disc) => disc.tracks.length), [8, 10]);
  assert.equal(tracks.length, 18);
  assert.equal(new Set(tracks.map((track) => track.title)).size, 18);
  assert.ok(tracks.every((track) => track.title && track.artist));
  const downloadAlbum = albums.find((album) => album.year === 2026);
  assert.equal(downloadAlbum.detailPath, album2026.detailPath);
  assert.equal(downloadAlbum.crossfadeVideoId, album2026.crossfadeVideoId);
  assert.deepEqual(downloadAlbum.event, album2026.event);
  assert.deepEqual(downloadAlbum.discs, album2026.discs.map((disc) => ({ name: disc.name, tracks: disc.tracks.map((track) => track.title) })));
});

test("歌詞原稿のある5曲だけを公開し、リンク切れや同一URLの重複を作らない", () => {
  assert.equal(lyricSlugs.length, 5);
  assert.equal(new Set(lyricSlugs).size, 5);
  assert.deepEqual([...lyricSlugs].sort(), Object.keys(lyrics2026).sort());
  for (const slug of lyricSlugs) {
    assert.match(slug, /^[a-z]+(?:-[a-z]+)*$/);
    assert.ok(lyrics2026[slug].trim().length > 100);
  }
});

test("テキスト・Word原稿4曲の文字と改行を転記時に変えない", () => {
  // 提供された原稿をUTF-8・LFに揃え、前後の空白だけ除去して求めたSHA-256です。
  // 原稿ファイルそのものやMac上の個人パスはテスト実行に不要です。
  const sourceHashes = {
    magicarhythm: "bf4a2632e112f05efd565013896a86e015e608c433092c2a30581b39a67c2238",
    harukaze: "17d8d9b10e55dac9a5495380c320bf8e8231adc2d2b5c3d737cabe74b5ee5afe",
    "nemuru-shirayuri": "6c5712c43180f9206bbb71ffafb93507acf48db466319da42af3651edbbda555",
    hater: "1f20bd6856235dfee78fc77f5978f30837a1b443460d910d6cd9f3d8bc5eadfa",
  };
  for (const [slug, hash] of Object.entries(sourceHashes)) {
    assert.equal(createHash("sha256").update(lyrics2026[slug].trim()).digest("hex"), hash, slug);
  }
});

test("画像原稿3枚の境界を正しい順番につなぐ", () => {
  const text = lyrics2026.tarareba;
  assert.ok(text.startsWith("「ただいま\nごめんね、 ありがとう」"));
  assert.ok(text.includes("咲き誇ると前向くから\n\nこんなにも暗くて"));
  assert.ok(text.includes("またあなたを探すの\n\n足跡は消して歩いた"));
  assert.ok(text.endsWith("もう何も見捨てなくていい"));
});

test("M3の出展日・会場・スペース・価格と動画IDを一か所で保持する", () => {
  assert.equal(album2026.event.date, "2026-10-25");
  assert.equal(album2026.event.venue, "東京流通センター");
  assert.equal(album2026.event.space, "第二展示場 1階 お-15b");
  assert.equal(album2026.event.price, "1,000円");
  assert.equal(album2026.crossfadeVideoId, "FH9i9gJuH8Q");
  assert.equal(new URL(album2026.event.url).protocol, "https:");
});

test("全年度の音源キーと配信状態を変えず、歌詞を配信用の年度データへ含めない", () => {
  for (const year of [2024, 2025, 2026]) {
    const album = albums.find((item) => item.year === year);
    assert.equal(album.downloadEnabled, true);
    assert.equal(album.r2Key, `albums/${year}.zip`);
  }
  assert.ok(!JSON.stringify(albums).includes(lyrics2026.hater));
});

test("新しい歌詞URLをサイトマップに載せ、静的なルーティングと安全な文字列描画を使う", async () => {
  const sitemap = await source("public/sitemap.xml");
  for (const slug of ["", ...lyricSlugs.map((slug) => `${slug}/`)]) {
    assert.ok(sitemap.includes(`https://gu-sakkyoku.github.io${album2026.detailPath}${slug}</loc>`));
  }
  assert.ok(!sitemap.includes("<loc>https://gu-sakkyoku.github.io/download/</loc>"));
  const page = await source("src/app/TansanYohou/[song]/page.tsx");
  assert.match(page, /generateStaticParams/);
  assert.match(page, /dynamicParams = false/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /whitespace-pre-wrap/);
  assert.match(page, /\{text\}/);
  assert.doesNotMatch(page, /dangerouslySetInnerHTML|"use client"/);
  assert.match(await source("src/component/NewAlbumAnnouncement.tsx"), /href=\{context === "album" \? "#track-list" : album.detailPath\}/);
  assert.match(await source("src/component/header.tsx"), /href: "\/TansanYohou\/"/);
});

test("動画は自動再生せず、遅延読み込みと代替リンクを用意する", async () => {
  const video = await source("src/component/CrossfadeVideo.tsx");
  assert.match(video, /www.youtube-nocookie.com\/embed\//);
  assert.match(video, /loading="lazy"/);
  assert.match(video, /aspect-video/);
  assert.match(video, /title=\{/);
  assert.match(video, /YouTubeでクロスフェードを聴く/);
  assert.doesNotMatch(video, /autoplay[=:;]|autoplay=1/);
});

test("2026だけの装飾は動きを減らす設定に対応し、フォントのライセンスを同梱する", async () => {
  const announcement = await source("src/component/NewAlbumAnnouncement.tsx");
  assert.match(announcement, /featured = album.year === 2026/);
  assert.match(announcement, /reducedMotion === false/);
  assert.match(announcement, /aria-label="ジャケットの周りに泡をはじかせる"/);
  assert.match(announcement, /event.pointerType !== "mouse"/);
  assert.match(announcement, /current === burst \? 0 : current/);
  assert.doesNotMatch(announcement, /repeat: Infinity|Math.random/);
  const css = await source("src/app/globals.css");
  assert.match(css, /release-feature-shine \{ display: none; \}/);
  assert.match(css, /transform: none !important/);
  assert.match(await source("public/licenses/zen-old-mincho-OFL.txt"), /SIL OPEN FONT LICENSE Version 1.1/);
});

test("新しい導線をホワイトテーマに統一し、2024・2025の個別ページは維持する", async () => {
  const page = await source("src/app/TansanYohou/page.tsx");
  assert.match(page, /tansan-white-theme \$\{albumMincho.variable\}/);
  assert.doesNotMatch(await source("src/app/layout.tsx"), /tansan-white-theme/);
  assert.match(await source("src/component/HomeContent.tsx"), /tansan-white-theme/);
  assert.match(await source("src/app/download/page.tsx"), /tansan-white-theme/);
  assert.match(await source("src/app/TansanYohou/[song]/page.tsx"), /tansan-white-theme/);
  assert.doesNotMatch(await source("src/app/Horoscope/page.tsx"), /tansan-white-theme/);
  assert.doesNotMatch(await source("src/app/Nijiiro/page.tsx"), /tansan-white-theme/);
  const css = await source("src/app/globals.css");
  assert.match(css, /\.tansan-white-theme \{[^}]*color-scheme: light;/s);
});

test("トップの導入表示を短縮し、作品への移動を妨げない", async () => {
  const home = await source("src/component/HomeContent.tsx");
  assert.match(home, /setIsLoading\(false\), 500/);
  assert.match(home, /transition=\{\{ duration: 0.2 \}\}/);
  assert.match(home, /pointer-events-none/);
  const content = await source("src/component/Mainpage.tsx");
  assert.ok(content.indexOf("<NewAlbumAnnouncement") < content.indexOf('id="about-club"'));
  assert.doesNotMatch(content, /<button|<br\s*\/>\s*<br\s*\/>/);
});

test("トップの部紹介から公式YouTubeチャンネルへ移動できる", async () => {
  const home = await source("src/component/Mainpage.tsx");
  assert.match(home, /href="https:\/\/www\.youtube\.com\/@gusakkyoku"[^>]*>群馬大学作曲部のYouTubeチャンネル<\/a>/);
});

test("ジャケット下の年度は途中で改行せず、枚数・曲数側で狭い幅に対応する", async () => {
  const css = await source("src/app/globals.css");
  assert.match(css, /\.release-feature-art-caption \{[^}]*align-items: baseline;/);
  assert.match(css, /\.release-feature-art-caption > :first-child \{[^}]*flex-shrink: 0;[^}]*white-space: nowrap;/);
  assert.match(css, /\.release-feature-art-caption > :last-child \{[^}]*min-width: 0;[^}]*text-align: right;/);
});
