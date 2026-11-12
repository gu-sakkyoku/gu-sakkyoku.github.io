import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "**/.wrangler/**",
      "local-output/**",
      "next-env.d.ts",
      // `npx astryx theme build` が作るファイルです。手で直さず、元の *Theme.ts を直して作り直します。
      "src/themes/*/*.js",
      "src/themes/*/*.d.ts",
      // テーマの説明ファイルは、Astryxの決まりで「export default { … }」だけの形にする必要があります。
      "src/themes/*/*.doc.mjs",
    ],
  },
];

export default eslintConfig;
