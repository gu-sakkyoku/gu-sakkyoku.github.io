"use client";

import Link from "next/link";
import Image from "next/image";
import AlbumJackets from "./AlbumJackets";
import NewAlbumAnnouncement from "./NewAlbumAnnouncement";
import { albums } from "../data/albums";
import { site } from "../data/site";
import SodaIcon from "./SodaIcon";
import AlbumMotion from "./AlbumMotion";

// 新作・過去作品とも年度データから表示し、タイトルや作品URLの二重管理を避けます。
const orderedAlbums = [...albums].sort((a, b) => b.year - a.year);
const latestAlbum = orderedAlbums[0];
const previousAlbums = orderedAlbums.slice(1);

const MainPage = ({ announcementReady = true }: { announcementReady?: boolean }) => {
  return (
    <AlbumMotion theme="soda">
      <div className="home-site-heading">
        <p><SodaIcon name="sparkle" />{site.name}<SodaIcon name="sparkle" /></p>
        <h1>群馬大学作曲部 公式サイト</h1>
      </div>

      {/* トップの主役は新作。部の紹介より先に、M3・試聴・歌詞の入口を見せます。 */}
      {latestAlbum && <NewAlbumAnnouncement album={latestAlbum} motionReady={announcementReady} />}

      <section aria-labelledby="about-club" className="home-about">
        <div className="home-about-intro">
          <p className="home-section-label">About us</p>
          <h2 id="about-club">群馬大学作曲部について</h2>
          <p className="mt-6 text-base leading-9">
            群馬大学作曲部の公式サイトです。<br />
            オリジナルアルバムの作品情報・歌詞と、<br className="hidden sm:block" />
            ダウンロードカードの案内を掲載しています。
          </p>
          <Link href="/download/" className="site-text-link home-album-link mt-6">
            <SodaIcon name="download" />
            ダウンロードカードをお持ちの方はこちらから
          </Link>
        </div>
        <div className="home-contact-note">
          <SodaIcon name="mail" className="home-contact-icon" />
          <h3>作曲部とつながる</h3>
          <p className="mt-5 text-base leading-8">
            お問い合わせは
            <a href="mailto:gusakkyoku@gmail.com" className="site-text-link rounded">gusakkyoku@gmail.com</a>
            または公式X（<a href="https://x.com/GUsakkyoku" className="site-text-link rounded">@GUsakkyoku</a>）のDMまで。
          </p>
          <p className="mt-4 text-base leading-8">
            公式YouTube：
            <a href="https://www.youtube.com/@gusakkyoku" className="site-text-link rounded">群馬大学作曲部のYouTubeチャンネル</a>
          </p>
        </div>
      </section>

      <section aria-labelledby="past-albums" className="home-discography">
        <p className="home-section-label">Discography</p>
        <h2 id="past-albums">作品一覧</h2>
        <div className="home-discography-grid">
          {previousAlbums.map((album) => (
            <article key={album.year} aria-labelledby={`archive-${album.year}`}>
              <p className="home-section-label home-album-year"><SodaIcon name="disc" />{album.year}</p>
              <h3 id={`archive-${album.year}`} className="mt-3 font-serif text-[30px]">{album.title}</h3>
              {/* Horoscopeの斜めに重なる既存ジャケットと、その短い揺れ演出を継承します。 */}
              {album.year === 2025 ? <AlbumJackets /> : album.artwork && (
                <div className="home-archive-art">
                  <Image
                    src={album.artwork}
                    alt={`${album.title}のアルバムジャケット`}
                    width={700}
                    height={700}
                    sizes="(max-width: 640px) 60vw, 280px"
                    className="aspect-square h-auto w-full rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
                  />
                </div>
              )}
              {album.detailPath && (
                <Link href={album.detailPath} className="site-text-link home-album-link">
                  {album.title}の作品・歌詞を見る
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
    </AlbumMotion>
  );
};

export default MainPage;
