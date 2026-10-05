// eslint-disable-next-line @typescript-eslint/no-require-imports -- Nextのlintが同期読み込みするCommonJS専用モジュールです。
const { globSync } = require("tinyglobby");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- 上と同じCommonJSの同期読み込みです。
const { isAbsolute } = require("node:path");

// Next.js 15.5.24のlintプラグインが使うglobSyncだけを提供します。
// fast-glob -> micromatch -> bracesに未修正のHighがあるため、その依存経路を除きます。
// tinyglobbyは標準だと指定したフォルダの中まで展開するので、元と同じ検索範囲に限定します。
// 絶対パスの検索結果も絶対パスで返し、Nextの設定でパスの意味が変わらないようにします。
exports.globSync = (pattern, options) =>
  globSync(pattern, {
    ...options,
    expandDirectories: false,
    absolute: isAbsolute(pattern) || options?.absolute,
  }).map((path) =>
    path.length > 1 ? path.replace(/\/$/, "") : path,
  );
