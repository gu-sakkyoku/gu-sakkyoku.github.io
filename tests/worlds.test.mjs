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

test("傾く飾りは3D空間を共有させず、後ろの飾りが手前へ飛び出さない", async () => {
  // preserve-3d を使うと、傾いた板どうしが奥行きで描かれ、z-index の前後が崩れます（2026年のディスクで発生）。
  for (const world of worlds) {
    assert.doesNotMatch(await source(`src/app/worlds/${world}.css`), /transform-style:\s*preserve-3d/, world);
  }
  const tansan = await source("src/app/worlds/tansan.css");
  assert.match(tansan, /\.tansan-polaroid-frame \{[^}]*z-index: 1;[^}]*transform: perspective\(900px\)/);
  assert.match(tansan, /\.tansan-disc \{[^}]*z-index: 0;/);
});

test("作品ページの面・枠・題字は、3作品のテーマに同じ名前のvariantとして定義する", async () => {
  for (const world of ["tansan", "horoscope", "nijiiro"]) {
    const theme = await source(`src/themes/${world}/${world}Theme.ts`);
    for (const key of ["'variant:stage'", "'variant:band'", "'variant:panel'", "'variant:jacket'", "'type:album-title'", "'type:eyebrow'", "'type:track-number'"]) {
      assert.ok(theme.includes(key), `${world}: ${key}`);
    }
    // 生成済みのテーマにも反映されていること（theme build のし忘れを防ぎます）。
    const built = await source(`src/themes/${world}/${world}.css`);
    assert.match(built, /\.astryx-section\[data-variant="stage"\]/, world);
    assert.match(built, /\.astryx-heading\[data-type="album-title"\]/, world);
  }
  const page = await source("src/component/ArchiveAlbumPage.tsx");
  assert.match(page, /variant="stage"/);
  assert.match(await source("src/app/TansanYohou/page.tsx"), /variant="stage"/);
});

test("見出しや段落ごとに現れる演出は付けず、動きは各ページの見せ場の一度きりにする", async () => {
  const files = [
    "src/app/TansanYohou/page.tsx",
    "src/app/aramakisai2026/page.tsx",
    "src/component/ArchiveAlbumPage.tsx",
    "src/component/Mainpage.tsx",
    "src/component/ui/TrackList.tsx",
    "src/component/ui/SectionHeading.tsx",
    "src/component/ui/AlbumShelf.tsx",
    "src/component/CrossfadeVideo.tsx",
  ];
  for (const file of files) assert.doesNotMatch(await source(file), /data-reveal/, file);
  assert.doesNotMatch(await source("src/component/AlbumMotion.tsx"), /IntersectionObserver/);
});

test("ページ移動のつなぎは動きを減らす設定で止まり、ジャケットは画面に見えているものだけをつなぐ", async () => {
  const css = await source("src/app/globals.css");
  const motionBlock = css.slice(css.indexOf("@media (prefers-reduced-motion: no-preference)"));
  assert.match(motionBlock, /@view-transition \{\s*navigation: auto;/);
  assert.match(motionBlock, /\.album-jacket \{\s*view-transition-name: album-jacket;/);
  assert.doesNotMatch(css.slice(0, css.indexOf("@media (prefers-reduced-motion: no-preference)")), /@view-transition/);
  const handoff = await source("src/component/ui/JacketHandoff.tsx");
  assert.match(handoff, /"pageswap"/);
  assert.match(handoff, /isOnScreen\(item\)/);
  // 同じ名前が1ページに2つあると、ブラウザはつなぎ自体を取りやめます。移る直前に大きなジャケットの名前を外します。
  assert.match(handoff, /viewTransitionName = "none"/);
});

test("ブラウザが描く部分（スクロールバー・入力中の線・押した瞬間の色）も作品の色にそろえ、日本語は文節の途中で折り返さない", async () => {
  const css = await source("src/app/globals.css");
  for (const world of worlds) assert.match(css, new RegExp(`:root:has\\(\\.site-world--${world}\\) \\{[^}]*scrollbar-color`));
  assert.match(css, /:root:has\(\.site-world--horoscope\) \{[^}]*color-scheme: dark/);
  assert.match(css, /caret-color: var\(--color-accent\)/);
  assert.match(css, /-webkit-tap-highlight-color/);
  assert.match(css, /:is\(h1, h2, h3, h4, h5, h6\) \{\s*word-break: auto-phrase;\s*text-wrap: balance;/);
  // 歌詞は原稿の改行どおりに表示するので、文章の折り返し調整の対象から外します。
  assert.match(css, /p:not\(:where\(\.lyric-sheet \*\)\)/);
});

test("光のにじみ（同じ位置の色付きの影）と、行の左端の色線を飾りに使わない", async () => {
  const horoscopeTheme = await source("src/themes/horoscope/horoscopeTheme.ts");
  // 影の始まりが「0 0 ぼかし 色」のもの（ずらさずにぼかした光）を探します。「0 0 0 6px」の細い輪は対象外です。
  assert.doesNotMatch(horoscopeTheme, /(textShadow|boxShadow): '(?:[^']*, )?0 0 [1-9]\d*px rgb/);
  const horoscopeCss = await source("src/app/worlds/horoscope.css");
  assert.doesNotMatch(horoscopeCss, /box-shadow: inset 2px 0 0/);
  assert.doesNotMatch(horoscopeCss, /box-shadow: 0 0 \d+px/);
  // 白地に白い文字になっていた、トップの荒牧祭のまとめの題字の上のラベルは置かない。
  assert.doesNotMatch(await source("src/component/aramaki/FestivalNotice.tsx"), /type="eyebrow"/);
});

test("トップの新作紹介はアニメーション用のライブラリを読み込まず、クロスフェードの枠は列の幅いっぱいに広がる", async () => {
  const pkg = JSON.parse(await source("package.json"));
  assert.equal(pkg.dependencies["framer-motion"], undefined);
  const shared = await source("src/app/worlds/shared.css");
  assert.match(shared, /\.crossfade-video \{\s*align-self: stretch;\s*width: 100%;/);
});

test("CIと公開のビルドは、Googleフォントの一時的な取得失敗のときだけ1回やり直す", async () => {
  const script = await source("scripts/ci-build.sh");
  assert.match(script, /set -uo pipefail/);
  assert.match(script, /grep -qE "next-font-loader\|from Google Fonts"/);
  assert.match(script, /else\s+exit 1/);
  for (const workflow of ["ci.yml", "deploy-pages.yml"]) {
    assert.match(await source(`.github/workflows/${workflow}`), /run: bash scripts\/ci-build.sh/);
  }
});
