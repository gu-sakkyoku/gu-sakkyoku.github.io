import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "../lib/styled-components-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "群馬大学作曲部 | 公式サイト";
const siteDescription = "群馬大学作曲部の公式サイト。オリジナルアルバム「Horoscope」「虹色memory」の作品情報・歌詞、ダウンロードカードの案内を掲載しています。";

export const metadata: Metadata = {
  metadataBase: new URL("https://gu-sakkyoku.github.io/"),
  title: siteTitle,
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://gu-sakkyoku.github.io/",
    siteName: "群馬大学作曲部",
    images: [
      {
        url: "/sakkyokukyara.png",
        width: 1280,
        height: 1280,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/sakkyokukyara.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* 旧サイトの所有確認タグは引き継がず、新サイトで必要になった場合だけ再設定します。 */}
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
