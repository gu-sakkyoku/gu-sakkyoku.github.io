import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";

/**
 * ヘッダーの既存ロゴを、見た目・比率・透明度を変えず小さくするだけの処理です。
 * Next.jsが画像処理用に持つsharpを使うため、新しい依存関係・有料APIは不要です。
 * ロゴを更新した技術担当が、npm ciの後に node scripts/generate-site-icons.mjs を実行します。
 * 書き換えるのは下記のアイコン3ファイルだけ。元のロゴは上書きしません。
 */
const requireFromNext = createRequire(import.meta.resolve("next"));
const sharp = requireFromNext("sharp");
const source = await readFile(new URL("../public/sakkyokukyara.png", import.meta.url));

await writeFile(new URL("../public/site-icon.png", import.meta.url),
  await sharp(source).resize(192, 192, { fit: "contain" }).png().toBuffer());
await writeFile(new URL("../public/apple-touch-icon.png", import.meta.url),
  await sharp(source).resize(180, 180, { fit: "contain" }).png().toBuffer());

// ICOは48px・96pxのPNGを収めます。Next.jsの既定faviconとPNGアイコンを同じロゴにします。
const sizes = [48, 96];
const images = await Promise.all(sizes.map((size) =>
  sharp(source).resize(size, size, { fit: "contain" }).png().toBuffer()));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([directory, ...images]));
console.log("ヘッダーのロゴから、検索・ブラウザ用のアイコン3ファイルを更新しました。");
