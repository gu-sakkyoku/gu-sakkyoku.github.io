// ジャケットなどの大きなPNG（1枚あたり0.8〜5.9MB）から、画面幅に合った軽いWebPを作ります。
// 元のPNGは変更・削除しません。画像を差し替えたら `node scripts/generate-artwork.mjs` を実行し、
// public/art/ と src/data/artwork.generated.json を一緒にコミットしてください。
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";

// sharpはNext.jsに同梱されているものを使い、依存関係を増やしません。
const sharp = createRequire(import.meta.resolve("next"))("sharp");

// 表示する大きさの候補（px）。元画像より大きい幅は作りません。
const widths = [160, 480, 960, 1500];
const sources = [
  "cover2026-tansan-yohou.png",
  "cover1.png",
  "cover2.png",
  "cover31.png",
  "gamoji.png",
];

const publicDir = new URL("../public/", import.meta.url);
const outDir = new URL("art/", publicDir);
await mkdir(outDir, { recursive: true });

const manifest = {};
for (const file of sources) {
  const input = sharp(new URL(file, publicDir).pathname);
  const { width, height } = await input.metadata();
  const name = file.replace(/\.png$/, "");
  const variants = [];
  for (const target of widths.filter((value) => value <= width)) {
    const output = `art/${name}-${target}.webp`;
    await input
      .clone()
      .resize({ width: target })
      .webp({ quality: target <= 160 ? 78 : 82 })
      .toFile(new URL(output, publicDir).pathname);
    variants.push({ width: target, src: `/${output}` });
  }
  manifest[`/${file}`] = { width, height, variants };
}

await writeFile(
  new URL("../src/data/artwork.generated.json", import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`generated ${Object.values(manifest).flatMap((item) => item.variants).length} files`);
