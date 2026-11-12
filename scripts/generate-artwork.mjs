// ジャケットなどの大きなPNG（1枚あたり0.8〜5.9MB）から、画面幅に合った軽いWebPを作ります。
// 元のPNGは変更・削除しません。画像を差し替えたら `node scripts/generate-artwork.mjs` を実行し、
// public/art/ と src/data/artwork.generated.json を一緒にコミットしてください。
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
// URLの .pathname は日本語のフォルダ名を %E7… のように変換してしまうため、fileURLToPath で実際のパスにします。
import { fileURLToPath } from "node:url";

// sharpはNext.jsに同梱されているものを使い、依存関係を増やしません。
const sharp = createRequire(import.meta.resolve("next"))("sharp");

// 表示する大きさの候補（px）。元画像より大きい幅は作りません。
const widths = [160, 480, 960, 1500];
// ジャケットなど。public/ からの位置で書きます。
// includeOriginal: 元画像の幅が候補の途中にあるとき、元の幅の版も作ります（拡大表示で粗くしないため）。
const sources = [
  { file: "cover2026-tansan-yohou.png" },
  { file: "cover1.png" },
  { file: "cover2.png" },
  { file: "cover31.png" },
  { file: "gamoji.png" },
  // 2026年 荒牧祭のポスター（作曲部作成）。
  { file: "aramaki2026/poster-stage.jpg", includeOriginal: true },
  { file: "aramaki2026/poster-dj.png", includeOriginal: true },
  { file: "aramaki2026/poster-merch.png", includeOriginal: true },
];

const publicDir = new URL("../public/", import.meta.url);
const outDir = new URL("art/", publicDir);
await mkdir(outDir, { recursive: true });

const manifest = {};
for (const { file, includeOriginal = false } of sources) {
  const input = sharp(fileURLToPath(new URL(file, publicDir)));
  const { width, height } = await input.metadata();
  // フォルダ名も含めて1つのファイル名にします（例：aramaki2026/poster-dj.png → aramaki2026-poster-dj）。
  const name = file.replace(/\.(png|jpe?g)$/i, "").replaceAll("/", "-");
  const targets = widths.filter((value) => value <= width);
  if (includeOriginal && width < widths.at(-1) && !targets.includes(width)) targets.push(width);
  const variants = [];
  for (const target of targets) {
    const output = `art/${name}-${target}.webp`;
    await input
      .clone()
      .resize({ width: target })
      .webp({ quality: target <= 160 ? 78 : 82 })
      .toFile(fileURLToPath(new URL(output, publicDir)));
    variants.push({ width: target, src: `/${output}` });
  }
  manifest[`/${file}`] = { width, height, variants };
}

await writeFile(
  new URL("../src/data/artwork.generated.json", import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(`generated ${Object.values(manifest).flatMap((item) => item.variants).length} files`);
