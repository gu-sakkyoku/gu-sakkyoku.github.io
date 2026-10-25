import type { Metadata } from "next";
import ClientWrapper from "../../component/ClientWrapper";
import DownloadArchive from "../../component/DownloadArchive";
import { albums } from "../../data/albums";
import { albumMincho, albumRounded } from "../../lib/album2026-font";
import SodaIcon from "../../component/SodaIcon";

export const metadata: Metadata = {
  title: "Music Download | 群馬大学作曲部",
  description: "群馬大学作曲部のダウンロードカードからアルバムを受け取るページです。",
  // カードから訪れるページなので、既存の歌詞ページのSEOには触れず、このページだけ検索対象外にします。
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  // 新しいトップと同じ明るいテーマを、この導線だけに適用します。
  // 2024・2025の個別作品／歌詞ページのテーマや、コード認証は変更しません。
  return (
    <div className={`tansan-white-theme ${albumMincho.variable} ${albumRounded.variable}`}>
    <ClientWrapper className="tansan-download mx-auto max-w-6xl pb-20">
        <header className="download-page-intro px-[10%] text-center">
          <span className="download-intro-icon"><SodaIcon name="download" width="28" height="28" /></span>
          <h1 className="font-serif text-[30px] font-normal leading-snug sm:text-[34px]">
            アルバムダウンロード
          </h1>
          <p className="mt-3 text-sm tracking-[0.14em] opacity-75">Music Download</p>
        </header>
        <p className="download-page-help mx-auto w-[80%] text-center text-sm leading-7 sm:text-base">
          カードに印刷された年度を選び、そのカードのダウンロードコードを入力してください。
        </p>
        {/* 年度はデータから生成。翌年も情報を追加するだけで入口が増えます。 */}
        <nav className="download-year-nav" aria-label="ダウンロードする年度を選ぶ">
          {[...albums].sort((a, b) => b.year - a.year).map((album) => (
            <a key={album.year} href={`#album-${album.year}`}>
              <SodaIcon name="disc" /><span>{album.year}</span><SodaIcon name="arrow" />
            </a>
          ))}
        </nav>
        <div className="mt-16 sm:mt-20">
          <DownloadArchive albums={albums} />
        </div>
        <p className="download-support-note mx-auto mt-14 w-[80%] max-w-2xl text-center text-sm leading-7">
          ダウンロードできない場合は、時間をおいて再度お試しください。
          お困りの際は作曲部の
          <a
            href="mailto:gusakkyoku@gmail.com"
            className="text-blue-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-300"
          >
            メール（gusakkyoku@gmail.com）
          </a>
          へご連絡ください。
        </p>
    </ClientWrapper>
    </div>
  );
}
