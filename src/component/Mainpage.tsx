"use client";

import Link from "next/link";
import Image from "next/image";
import AlbumJackets from "./AlbumJackets";
import NewAlbumAnnouncement from "./NewAlbumAnnouncement";
import { albums } from "../data/albums";
import { site } from "../data/site";

// 年度を追加すると新作告知も自動で切り替わります。作品情報をトップへ二重に書きません。
const latestAlbum = [...albums].sort((a, b) => b.year - a.year)[0];

const MainPage = ({ announcementReady = true }: { announcementReady?: boolean }) => {
  return (
    <>
      <h1 className="text-[30px] px-[10%] font-serif text-center">
        群馬大学作曲部 公式サイト
      </h1>
      {/* 検索用の希望サイト名と、閲覧者が見える呼び名を一致させます。 */}
      <p className="mt-2 text-center text-sm">{site.name}</p>
      <br />
      <hr className="w-[80%] mx-auto" />
      <br />
      <p className="w-[80%] mx-auto text-center">
        群馬大学作曲部の公式サイトです。オリジナルアルバムの作品情報・歌詞と、ダウンロードカードの案内を掲載しています。ご連絡はメール(gusakkyoku[@]gmail.com)または公式X(
        <a href="https://x.com/GUsakkyoku" className="site-text-link">
          @GUsakkyoku
        </a>
        )のDMまでお願いします。
      </p>

      <p className="mt-6 text-center">
        <Link href="/download" className="site-text-link font-semibold">
          ダウンロードカードをお持ちの方はこちらから
        </Link>
      </p>

      {latestAlbum && <NewAlbumAnnouncement album={latestAlbum} motionReady={announcementReady} />}

      <br />
      <br />
      <br />
      <br /><br /><br />
      <h1 className="text-[40px] px-[10%] font-serif text-center">作品一覧</h1>
      <br /><br /><br />
      <h1 className="text-[30px] px-[10%] font-serif text-center">作曲部オリジナルアルバム2作目「Horoscope」</h1>
      <br /><br />

      {/* 既存の斜めに重なる演出を再利用し、大きな画面でも画像の幅を一定以内に収めます。 */}
      <AlbumJackets />

      <br />
      <br />
      <div style={{ textAlign: "center" }}>
        <Link href="/Horoscope">
          <button
            style={{
              margin: "0 auto",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
              boxSizing: "border-box",
              border: "2px solid #ccc",
              borderRadius: "80px",
            }}
          >
            <p className="text-[30px] px-[10%] font-serif text-center">
              「Horoscope」の歌詞ページはこちら!
            </p>
          </button>
        </Link>
      </div>
      <br /><br /><br /><br />
      <hr className="w-[80%] mx-auto" />
      <br /><br /><br /><br />
      <h1 className="text-[30px] px-[10%] font-serif text-center">作曲部オリジナルアルバム1作目「虹色memory」</h1>
      <br /><br />
      <Image
            src="/cover31.png"
            alt="虹色memoryのアルバムジャケット"
            width={2160}
            height={2160}
            style={{
              width: "40%",
              height: "auto",
              borderRadius: "12px",
              display: "block",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              margin: "0 auto"
            }}
          />

          <br /><br /><br />

      <div style={{ textAlign: "center" }}>
        <Link href="/Nijiiro">
          <button
            style={{
              margin: "0 auto",
              padding: "0.2rem 0.5rem",
              cursor: "pointer",
              boxSizing: "border-box",
              border: "2px solid #ccc",
              borderRadius: "80px",
            }}
          >
            <p className="text-[30px] px-[10%] font-serif text-center">
              「虹色memory」の歌詞ページはこちら!
            </p>
          </button>
        </Link>
      </div>
      <br /><br /><br />
    </>
  );
};

export default MainPage;
