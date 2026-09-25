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

export const metadata: Metadata = {
  title: "群馬大学作曲部アルバム紹介サイト",
  description: "群馬大学作曲部のオリジナルアルバムの歌詞掲載などを行っています",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '群馬大学作曲部アルバム紹介サイト',
    description: '群馬大学作曲部のオリジナルアルバムの歌詞掲載などを行っています',
    url: 'https://gu-sakkyoku.github.io/',
    siteName: '群馬大学作曲部アルバム紹介サイト',
    images: [
      {
        url: 'https://gu-sakkyoku.github.io/sakkyokukyara.png',
        width: 1280,
        height: 1280,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="群馬大学作曲部アルバム紹介サイト" />
        <meta
          name="twitter:description"
          content="群馬大学作曲部のオリジナルアルバムの歌詞掲載などを行っています"
        />
        <meta
          name="twitter:image"
          content="https://gu-sakkyoku.github.io/sakkyokukyara.png"
        />
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
