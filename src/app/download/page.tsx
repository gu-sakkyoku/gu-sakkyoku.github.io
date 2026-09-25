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
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Cheader />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-8">
        <div className="mb-10 text-center">
          <p className="font-serif text-sm tracking-[0.2em] text-blue-900">群馬大学作曲部</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">Music Download</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            カードに印刷された年のアルバムを選び、同じカードのダウンロードコードを入力してください。
            スマートフォンからもご利用いただけます。
          </p>
        </div>
        <DownloadArchive albums={albums} />
        <p className="mt-10 text-center text-sm leading-7 text-slate-700">
          ダウンロードできない場合は、時間をおいて再度お試しください。
          お困りの際はカードを購入した際の案内元へご連絡ください。
        </p>
      </main>
      <Cfooter />
    </div>
  );
}
