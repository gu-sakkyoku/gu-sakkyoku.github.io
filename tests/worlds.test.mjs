import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import postcss from "postcss";
import { albums } from "../src/data/albums.ts";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const worlds = ["tansan", "horoscope", "nijiiro", "aramaki"];

test("作品ごとの飾りCSSはその作品の中に限定し、ほかの作品の見た目へ波及させない", async () => {
  for (const world of worlds) {
    const css = await source(`src/app/worlds/${world}.css`);
    postcss.parse(css).walkRules((rule) => {
      // @keyframes の中（from / to / 50% など）はセレクターではないので対象外です。
      if (rule.parent?.type === "atrule" && rule.parent.name === "keyframes") return;
      // :where内のカンマと、複数のCSSセレクターの区切りを混同しないようにします。
      let depth = 0;
      const selectors = [""];
      for (const character of rule.selector) {
        if (character === "(") depth++;
        if (character === ")") depth--;
        if (character === "," && depth === 0) selectors.push("");
        else selectors[selectors.length - 1] += character;
      }
      for (const selector of selectors) {
        assert.match(selector.trim(), new RegExp(`^\\.site-world--${world}(?:\\s|$)`), `${world}: ${selector}`);
      }
    });
    assert.match(css, /prefers-reduced-motion: reduce/, world);
    assert.match(css, /forced-colors: active/, world);
    assert.doesNotMatch(css, /animation:[^;]*infinite/, world);
  }
});

test("テーマは元ファイルとビルド済みファイルをそろえて管理し、全ページで読み込む", async () => {
  const registry = await source("src/astryx-themes.ts");
  for (const world of worlds) {
    const theme = await source(`src/themes/${world}/${world}Theme.ts`);
    assert.match(theme, new RegExp(`name: '${world}'`));
    assert.match(theme, /extends: neutralTheme/);
    // ビルド済みCSSがあると、JavaScriptが動く前から色が付きます。
    const built = await source(`src/themes/${world}/${world}.css`);
    assert.match(built, new RegExp(`data-astryx-theme="${world}"`));
    assert.match(registry, new RegExp(`./themes/${world}/${world}\\.css`));
    await access(new URL(`../src/themes/${world}/${world}Theme.doc.mjs`, import.meta.url));
  }
  const layout = await source("src/app/layout.tsx");
  // レイヤー順の宣言は、ほかのどのCSSよりも先に読み込みます。
  assert.ok(layout.indexOf('import "./layers.css"') < layout.indexOf('import "./globals.css"'));
  assert.match(await source("src/app/layers.css"), /@layer properties, reset, theme, base, astryx-base, astryx-theme, components, utilities;/);
});

test("年度リンクも曲数も公開アルバム情報から表示し、個別のコードをUIへ置かない", async () => {
  const page = await source("src/app/download/page.tsx");
  assert.match(page, /<DownloadArchive albums=\{albums\} \/>/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.match(page, /アルバムダウンロード/);
  const archive = await source("src/component/DownloadArchive.tsx");
  assert.match(archive, /album.discs.reduce/);
  assert.match(archive, /label="カードに印刷された年度"/);
  // 以前の年度別リンク（/download/#album-2026 など）を引き続き受け付けます。
  assert.match(archive, /id=\{`album-\$\{item.year\}`\}/);
  assert.match(archive, /window\.location\.hash\.replace\("#album-", ""\)/);
  assert.doesNotMatch(page + archive, /const (?:CODE|SECRET)\s*=/);
});

test("軽量版のジャケット画像は一覧と実ファイルが一致し、元の画像も残す", async () => {
  const manifest = JSON.parse(await source("src/data/artwork.generated.json"));
  for (const album of albums) {
    assert.ok(manifest[album.artwork], `${album.artwork} の軽量版がありません`);
  }
  for (const [original, entry] of Object.entries(manifest)) {
    await access(new URL(`../public${original}`, import.meta.url));
    assert.ok(entry.variants.length >= 2, original);
    for (const variant of entry.variants) {
      await access(new URL(`../public${variant.src}`, import.meta.url));
      assert.ok(variant.width <= entry.width);
    }
  }
});

test("アイコンは文字ラベルと一緒に使う飾りで、名前の一覧を1か所にまとめる", async () => {
  const icon = await source("src/component/ui/AppIcon.tsx");
  assert.match(icon, /export type AppIconName = keyof typeof icons;/);
  // 曲リストの「歌詞はこちら」は、色だけでなく文字と矢印でもリンクだと分かるようにします。
  const tracks = await source("src/component/ui/TrackList.tsx");
  assert.match(tracks, /歌詞はこちら\s*<AppIcon name="arrowRight"/);
  assert.match(await source("src/app/worlds/shared.css"), /\.track-lyric-mark \{[^}]*text-decoration: underline;/);
});
