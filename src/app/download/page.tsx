import type { Metadata } from "next";
import Cheader from "../../component/header";
import Cfooter from "../../component/footer";
import DownloadArchive from "../../component/DownloadArchive";
import { albums } from "../../data/albums";

export const metadata: Metadata = {
  title: "Music Download | 群馬大学作曲部",
  description: "群馬大学作曲部のダウンロードカードからアルバムを受け取るページです。",
  // カードから訪れるページなので、既存の歌詞ページのSEOには触れず、このページだけ検索対象外にします。
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  // 背景色と本文色は既存ページと同じくglobals.cssへ任せます。
  // /downloadだけ白背景を固定すると、ダーク表示の歌詞ページから浮いてしまいます。
  return (
    <div className="min-h-screen">
      <Cheader />
      <main className="mx-auto max-w-6xl pb-20 pt-32 sm:pt-36">
        <header className="px-[10%] text-center">
          <h1 className="font-serif text-[30px] font-normal leading-snug sm:text-[34px]">
            アルバムダウンロード
          </h1>
          <p className="mt-3 text-sm tracking-[0.14em] opacity-75">Music Download</p>
        </header>
        <hr className="mx-auto my-8 w-[80%] border-current opacity-60" />
        <p className="mx-auto w-[80%] text-center text-sm leading-7 sm:text-base">
          カードに印刷された年のアルバムを選び、同じカードのダウンロードコードを入力してください。
        </p>
        <div className="mt-16 sm:mt-20">
          <DownloadArchive albums={albums} />
        </div>
        <p className="mx-auto mt-14 w-[80%] max-w-2xl text-center text-sm leading-7">
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
      </main>
      <Cfooter />
    </div>
  );
}
