"use client";

import Link from "next/link";
import Image from "next/image";
import AlbumJackets from "./AlbumJackets";

const MainPage = () => {
  return (
    <>
      <h1 className="text-[30px] px-[10%] font-serif text-center">
        群馬大学作曲部 公式サイト
      </h1>
      <br />
      <hr className="w-[80%] mx-auto" />
      <br />
      <p className="w-[80%] mx-auto text-center">
        群馬大学作曲部の公式サイトです。オリジナルアルバム「Horoscope」「虹色memory」の歌詞・作品情報と、ダウンロードカードの案内を掲載しています。ご連絡はメール(gusakkyoku[@]gmail.com)または公式X(
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

      <br />
      <br />
      <br />
      <br /><br /><br />
      <h1 className="text-[40px] px-[10%] font-serif text-center">作品一覧</h1>
      <br /><br /><br />
      <h1 className="text-[30px] px-[10%] font-serif text-center">作曲部オリジナルアルバム2作目「Horoscope」</h1>
      <br /><br />

      {/* 画像を斜めに重ねるコンテナ */}
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
