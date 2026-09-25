import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // App Routerで既存styled-componentsのサーバーHTMLとブラウザ側のクラス名を揃えます。
  compiler: { styledComponents: true },
  // GitHub Pagesでは各ルートをディレクトリ内のindex.htmlとして配信します。
  // QRコードに末尾スラッシュなしのURLを印刷しても、同じ静的ページへ解決できます。
  trailingSlash: true,
  images: {
    // 静的出力にはNext.jsの実行時画像最適化APIがないため、publicの画像をそのまま配信します。
    unoptimized: true,
  },
};

export default nextConfig;
