import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// レイヤー順の宣言は必ず最初に読み込みます（理由はlayers.cssに記載）。
import "./layers.css";
// Astryxの部品が正しく表示されるための基本CSS。どちらも専用のレイヤーに入るので、サイト独自のCSSが優先されます。
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "./globals.css";
import { site } from "../data/site";
import { siteFontVariables } from "../lib/site-fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  // src/app/favicon.icoも同じヘッダー画像から作成し、古い既定アイコンを残しません。
  icons: {
    icon: [{ url: site.icon, type: "image/png", sizes: "192x192" }],
    apple: [{ url: site.appleIcon, type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: site.logo,
        width: site.logoSize,
        height: site.logoSize,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.logo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        // 書体のCSS変数はここで一度だけ定義し、どの作品のテーマからも参照できるようにします。
        className={`${geistSans.variable} ${geistMono.variable} ${siteFontVariables} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
