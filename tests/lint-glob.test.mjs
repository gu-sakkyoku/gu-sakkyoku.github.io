import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs");

// 実際のNextプラグインを通して確認し、互換処理だけ成功してlint本体が壊れるのを防ぎます。
test("Next lintは通常のプロジェクトルートを変更しない", () => {
  assert.deepEqual(getRootDirs({ cwd: projectRoot, settings: {} }), [projectRoot]);
});

test("Next lintは相対パスのルート指定を相対パスで返す", () => {
  assert.deepEqual(
    getRootDirs({ cwd: projectRoot, settings: { next: { rootDir: "src/{app,component}" } } }).sort(),
    ["src/app", "src/component"],
  );
});

test("Next lintのルート検索は指定フォルダだけを返し、子フォルダへ勝手に展開しない", () => {
  const rootDir = `${projectRoot}/src/{app,component}`;
  const directories = getRootDirs({ cwd: projectRoot, settings: { next: { rootDir } } });
  assert.deepEqual(directories.sort(), [
    resolve(projectRoot, "src/app"),
    resolve(projectRoot, "src/component"),
  ].sort());
});

test("Next lintは複数のルート指定に対応し、ファイルをルートに含めない", () => {
  const rootDir = [`${projectRoot}/src/data`, `${projectRoot}/public/*.png`];
  assert.deepEqual(
    getRootDirs({ cwd: projectRoot, settings: { next: { rootDir } } }),
    [resolve(projectRoot, "src/data")],
  );
});
