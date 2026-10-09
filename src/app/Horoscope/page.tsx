"use client";

import Image from "next/image";
import ClientWrapper from "../../component/ClientWrapper";
import LyricLink from "../../component/LyricLink";
import AlbumJackets from "../../component/AlbumJackets";



const MainPage = () => {
  return (
    <ClientWrapper>
      <h1 className="text-[30px] px-[10%] font-serif text-center">
        群馬大学作曲部オリジナルアルバム2作目「Horoscope」
      </h1>
      <div className="relative w-[80%] pb-[45%] mx-auto mt-10">
  <iframe
    className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
    src="https://www.youtube.com/embed/iPNjS8T7ZEM?si=50PKUnvctCEoN5KO"
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  ></iframe>
</div>

      <br /><br /><br /><br />
      <hr className="w-[80%] mx-auto" />
      <br /><br /><br /><br />
      <h1 className="text-[30px] px-[10%] font-serif text-center">「Horoscope」曲リスト</h1>
      <br /><br />
      <AlbumJackets />

          <br /><br />
          <br />




          <p className="text-[27px] px-[10%] font-serif text-center">Disc 1</p>
          <br /><br />
          <p className="text-[18px] px-[10%] font-serif text-center">01 フワっと！スペースえすけ～ぷ！！ feat. 知声, 花隈千冬</p>
          <Image
                            src="/gamoji.png"
                            alt="ジャケット画像"
                            width={1280}
                            height={1280}
                            style={{
                              width: "27%",
                              height: "auto",
                              borderRadius: "12px",
                              display: "block",
                              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                              margin: "0 auto"
                            }}
                          />
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/Solar Systems</p>
          <LyricLink href="/Horoscope/fuwa" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">02 流星を詠む</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/創駄</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">03 テザー feat. 花隈千冬</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/ムギスタジオ</p>
          <LyricLink href="/Horoscope/teza" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">04 ブラックホール、午後ティーを添えて</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/♮まき6</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">05 Lift Off!</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/おむすび</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">06 Into the Horoscope</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/コロッケクリームガニ</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">07 Negative Infinite Space</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/C7</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">08 Starlight</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/かたや</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">09 c89de</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/szk</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">10 Assault Star</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/astraire</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">11 沈黙の衛星と虚構における記憶の硝子</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/Noζris</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">12 フェード feat. 音街ウナ</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/おちゃ2</p>
          <LyricLink href="/Horoscope/fead" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">13 星くずの小瓶</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/花曇,Canopus</p>
          <LyricLink href="/Horoscope/hoshikuzu" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">14 Amairo Trail</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/Miriha</p>
          <br /><br /><br /><br />

          <p className="text-[27px] px-[10%] font-serif text-center">Disc 2</p>
          <br />


          <p className="text-[18px] px-[10%] font-serif text-center">01 The signal in the noise</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/Miriha</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">02 can&apos;t ESCAPE!!! feat. 雨歌エル</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/おちゃ2</p>
          <LyricLink href="/Horoscope/cant" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">03 招雷降神、CUCUMBER</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/♮まき6</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">04 弦楽四重奏曲第1番ホ長調-入学祝い-</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/創駄</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">05 青空</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/梨子</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">06 もしもあなたと</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/the endo</p>
          <LyricLink href="/Horoscope/mosimo" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">07 ０３：３９</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music/コロッケクリームガニ</p>
          <br />

          <p className="text-[18px] px-[10%] font-serif text-center">08 ため息は空に溶けた feat. 花隈千冬</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/ムギスタジオ</p>
          <LyricLink href="/Horoscope/tameiki" /><br />

          <p className="text-[18px] px-[10%] font-serif text-center">09 クチグルマジャーニー</p>
          <p className="text-[18px] px-[10%] font-serif text-center">music・lyrics/コロッケクリームガニ</p>
          <p className="text-[18px] px-[10%] font-serif text-center">vocal/Melty kNightmare</p>
          <LyricLink href="/Horoscope/melt" /><br />

          <br />
          <br />


      <br /><br /><br />
    </ClientWrapper>
  );
};

export default MainPage;
