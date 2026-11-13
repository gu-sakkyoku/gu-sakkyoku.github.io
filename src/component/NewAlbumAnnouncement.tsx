import type { CSSProperties } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import type { Album } from "../data/albums";
import TansanBurst from "./TansanBurst";
import ViewportPlay from "./ViewportPlay";
import AppIcon from "./ui/AppIcon";
import Artwork from "./ui/Artwork";

// ランダム生成せず、SSRとブラウザで同じ装飾を描きます。すべて読み上げ対象外です。
const bubbles = [
  { left: "6%", top: "62%", size: 26 },
  { left: "18%", top: "84%", size: 44 },
  { left: "47%", top: "70%", size: 18 },
  { left: "63%", top: "88%", size: 34 },
  { left: "82%", top: "66%", size: 22 },
  { left: "93%", top: "82%", size: 54 },
];

/**
 * トップページの新作の紹介です。ジャケットの夏空を背景に広げ、題字はジャケットと同じ丸い書体・淡い色のグラデーションにしています。
 * 作品名・年度・曲数・配信状態は年度データから受け取るので、ここに作品情報を直接書きません。
 *
 * 動きは「画面に入ったときに一度だけ」。泡が上がり、題字が1文字ずつ跳ね、ジャケットが一度ゆれて光が走ります。
 * 動き自体はすべてCSS（worlds/tansan.css）で、画面に入った合図だけを ViewportPlay が付けます。
 * OSで動きを減らす設定の人とJavaScriptが動かない環境では、最初から止まった完成形を表示します。
 * 押して反応するのは「泡をはじく」だけで、そこだけを小さな部品（TansanBurst）に分けています。
 */
export default function NewAlbumAnnouncement({ album }: { album: Album }) {
  const tracks = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);

  return (
    <section className="tansan-hero" aria-labelledby="new-album-title" data-depth data-play-on-view="0.15">
      <ViewportPlay />
      <div className="tansan-sky" aria-hidden="true">
        <span className="tansan-sky-bokeh tansan-sky-bokeh--1" />
        <span className="tansan-sky-bokeh tansan-sky-bokeh--2" />
        <span className="tansan-sky-bokeh tansan-sky-bokeh--3" />
        <span className="tansan-sky-spray" />
        {bubbles.map((bubble, index) => (
          <span
            key={bubble.left}
            className="tansan-bubble"
            style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size, "--i": index } as CSSProperties}
          />
        ))}
        <span className="tansan-cloud tansan-cloud--1" />
        <span className="tansan-cloud tansan-cloud--2" />
        <span className="tansan-cloud tansan-cloud--3" />
      </div>

      <div className="tansan-hero-inner site-container">
        <div className="tansan-hero-copy">
          <p className="tansan-kicker">New Album!!!</p>
          <h2 id="new-album-title" aria-label={album.title} className="tansan-title">
            {/* 読み上げは見出しのaria-labelで一語に保ち、文字ごとの演出を重複して読ませません。 */}
            {[...album.title].map((character, index) => (
              <span key={`${character}-${index}`} aria-hidden="true" style={{ "--i": index } as CSSProperties}>
                {character}
              </span>
            ))}
          </h2>

          <div className="tansan-hero-card">
            {/* 年度・曲数はそれぞれまとまりで折り返し、「全18」と「曲」が別の行に分かれないようにします。 */}
            <Text as="p" weight="bold">
              <span className="inline-block">{album.year}年 オリジナルアルバム</span>{" "}
              <span className="inline-block">{album.discs.length}枚組 / 全{tracks}曲</span>
            </Text>
            <div className="tansan-hero-actions">
              {album.detailPath && (
                <Button
                  label="アルバム詳細・歌詞はこちら"
                  href={album.detailPath}
                  variant="primary"
                  size="lg"
                  endContent={<AppIcon name="arrowRight" />}
                />
              )}
              {album.crossfadeVideoId && (
                <Button
                  label="クロスフェードを聴く"
                  href="#crossfade"
                  variant="secondary"
                  size="lg"
                  icon={<AppIcon name="circlePlay" />}
                />
              )}
            </div>
            <Text as="p" type="supporting">
              {album.downloadEnabled
                ? "ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。"
                : album.unavailableReason === "paused"
                  ? "現在、ダウンロードを一時停止しています。修正版の準備ができ次第、再開します。"
                  : "ダウンロードは準備中です。公開までしばらくお待ちください。"}{" "}
              <Link href={`/download/#album-${album.year}`} hasUnderline>ダウンロードページへ</Link>
            </Text>
          </div>
        </div>

        {album.artwork && (
          // スマホでは題字と絵が別々の高さに来るため、絵が見えてからジャケットの演出を始めます。
          <div className="tansan-hero-art" data-tilt data-play-on-view="0.25">
            <TansanBurst>
              <span className="tansan-disc" aria-hidden="true" />
              <div className="tansan-polaroid-frame">
                <Artwork
                  src={album.artwork}
                  alt={`${album.title}のアルバムジャケット`}
                  sizes="(max-width: 640px) 80vw, 448px"
                  priority
                />
                <span aria-hidden="true" className="tansan-shine" />
                <p className="tansan-polaroid-caption">
                  <span>{album.year}</span>
                  <span>{album.discs.length}枚組 / 全{tracks}曲</span>
                </p>
              </div>
            </TansanBurst>
          </div>
        )}
      </div>
    </section>
  );
}
