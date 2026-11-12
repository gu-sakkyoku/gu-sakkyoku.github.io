"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { ArrowRight, CirclePlay, Sparkles } from "lucide-react";
import type { Album } from "../data/albums";
import { site } from "../data/site";
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

// 泡の方向は固定値にし、SSRとブラウザで変わらないようにします。音・通信は発生しません。
const popParticles = Array.from({ length: 12 }, (_, index) => ({
  x: Math.cos((index * Math.PI) / 6) * (index % 2 ? 120 : 155),
  y: Math.sin((index * Math.PI) / 6) * (index % 2 ? 120 : 155),
}));

/**
 * 最新作のヒーロー（ページ最上部の大きな紹介）です。トップと作品ページの両方で使います。
 * ジャケットの夏空を背景に広げ、題字はジャケットと同じ丸い書体・淡い色のグラデーションにしています。
 * 作品名・年度・曲数・配信状態は年度データから受け取るので、ここに作品情報を直接書きません。
 * 動きは「画面に入ったときに一度だけ」。OSで動きを減らす設定の人には静止表示にします。
 */
export default function NewAlbumAnnouncement({
  album,
  context = "home",
}: {
  album: Album;
  context?: "home" | "album";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const artworkInView = useInView(artworkRef, { once: true, amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const [burst, setBurst] = useState(0);
  const burstSequence = useRef(0);
  // 設定が未確定のSSRでは静止表示。JSなしでも画像・説明・リンクは見えるままです。
  const animate = isInView && reducedMotion === false;
  // スマホでは題字と絵が別々の高さに来るため、絵が見えてからジャケットの演出を始めます。
  const animateArtwork = artworkInView && reducedMotion === false;
  const Title = context === "album" ? "h1" : "h2";
  const tracks = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);

  return (
    <section ref={sectionRef} className="tansan-hero" aria-labelledby="new-album-title" data-depth>
      <div className="tansan-sky" aria-hidden="true">
        <span className="tansan-sky-bokeh tansan-sky-bokeh--1" />
        <span className="tansan-sky-bokeh tansan-sky-bokeh--2" />
        <span className="tansan-sky-bokeh tansan-sky-bokeh--3" />
        <span className="tansan-sky-spray" />
        {bubbles.map((bubble, index) => (
          <motion.span
            key={bubble.left}
            className="tansan-bubble"
            initial={false}
            style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size }}
            animate={{ y: animate ? [0, -90, -40] : 0, opacity: animate ? [0.4, 0.95, 0.7] : 0.7 }}
            transition={{ duration: animate ? 4 : 0, delay: animate ? index * 0.18 : 0, ease: "easeInOut" }}
          />
        ))}
        <span className="tansan-cloud tansan-cloud--1" />
        <span className="tansan-cloud tansan-cloud--2" />
        <span className="tansan-cloud tansan-cloud--3" />
      </div>

      <div className="tansan-hero-inner site-container">
        <div className="tansan-hero-copy">
          {context === "home" && (
            <div className="tansan-hero-site">
              <p>{site.name}</p>
              <h1>群馬大学作曲部 公式サイト</h1>
            </div>
          )}
          <motion.p
            className="tansan-kicker"
            initial={false}
            animate={{ rotate: animate ? [-3, 2, -3] : -3, scale: animate ? [1, 1.06, 1] : 1 }}
            transition={{ duration: animate ? 0.9 : 0, delay: animate ? 0.25 : 0, ease: "easeInOut" }}
          >
            New Album!!!
          </motion.p>
          <Title id="new-album-title" aria-label={album.title} className="tansan-title">
            {/* 読み上げは見出しのaria-labelで一語に保ち、文字ごとの演出を重複して読ませません。 */}
            {[...album.title].map((character, index) => (
              <motion.span
                key={`${character}-${index}`}
                aria-hidden="true"
                initial={false}
                // 題字は動かしても薄くはしません。途中で止まっても必ず読めるようにするためです。
                animate={animate ? { y: [26, -6, 0], rotate: [-6, 2, 0] } : { y: 0, rotate: 0 }}
                transition={{ duration: animate ? 0.85 : 0, delay: animate ? index * 0.09 : 0, ease: "easeOut" }}
              >
                {character}
              </motion.span>
            ))}
          </Title>

          <div className="tansan-hero-card">
            {/* 年度・曲数はそれぞれまとまりで折り返し、「全18」と「曲」が別の行に分かれないようにします。 */}
            <Text as="p" weight="bold">
              <span className="inline-block">{album.year}年 オリジナルアルバム</span>{" "}
              <span className="inline-block">{album.discs.length}枚組 / 全{tracks}曲</span>
            </Text>
            <div className="tansan-hero-actions">
              {/* 同じ紹介を作品ページでも再利用し、そちらでは曲リストへ直接進みます。 */}
              {album.detailPath && (
                <Button
                  label={context === "album" ? "曲リスト・歌詞を見る" : "アルバム詳細・歌詞はこちら"}
                  href={context === "album" ? "#track-list" : album.detailPath}
                  variant="primary"
                  size="lg"
                  endContent={<Icon icon={ArrowRight} />}
                />
              )}
              {album.crossfadeVideoId && (
                <Button
                  label="クロスフェードを聴く"
                  href="#crossfade"
                  variant="secondary"
                  size="lg"
                  icon={<Icon icon={CirclePlay} />}
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
          <div className="tansan-hero-art" ref={artworkRef} data-tilt>
            <motion.div
              className="tansan-polaroid"
              initial={false}
              // ジャケットの「ゆらゆら」は一度だけ。幅や高さは変えず、レイアウトを動かさないtransformだけです。
              animate={animateArtwork ? { rotate: [3, -2, 5, 2, 3], y: [0, -10, 0, -4, 0] } : { rotate: 3, y: 0 }}
              transition={{ duration: animateArtwork ? 2.6 : 0, delay: animateArtwork ? 0.2 : 0, ease: "easeInOut" }}
            >
              <span className="tansan-disc" aria-hidden="true" />
              <div className="tansan-polaroid-frame">
                <Artwork
                  src={album.artwork}
                  alt={`${album.title}のアルバムジャケット`}
                  sizes="(max-width: 640px) 80vw, 448px"
                  priority
                />
                <motion.span
                  aria-hidden="true"
                  className="tansan-shine"
                  initial={false}
                  animate={{ x: animateArtwork ? ["-130%", "260%"] : "-130%", opacity: animateArtwork ? [0, 0.6, 0] : 0 }}
                  transition={{ duration: animateArtwork ? 2.4 : 0, delay: animateArtwork ? 0.9 : 0, ease: "easeInOut" }}
                />
                <p className="tansan-polaroid-caption">
                  <span>{album.year}</span>
                  <span>{album.discs.length} DISCS / {tracks} TRACKS</span>
                </p>
              </div>
              {burst > 0 && (
                <div className="tansan-pop" aria-hidden="true">
                  {popParticles.map((particle, index) => (
                    <motion.span
                      key={`${burst}-${index}`}
                      className={index % 2 ? "tansan-pop-bubble" : "tansan-pop-star"}
                      // 動きを減らす場合は、離れた位置に静止した泡をゆっくりフェードするだけにします。
                      style={reducedMotion ? { left: `calc(50% + ${particle.x}px)`, top: `calc(45% + ${particle.y}px)` } : undefined}
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 0, y: 0, scale: 0.2 }}
                      animate={reducedMotion ? { opacity: [0, 0.8, 0] } : { x: particle.x, y: particle.y, scale: [0.2, 1.2, 0.8], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.1, delay: index * 0.02, ease: "easeOut" }}
                      onAnimationComplete={index === popParticles.length - 1 ? () => setBurst((current) => (current === burst ? 0 : current)) : undefined}
                    />
                  ))}
                </div>
              )}
            </motion.div>
            <div className="tansan-pop-button">
              <Button
                label="泡をはじく"
                size="sm"
                variant="secondary"
                icon={<Icon icon={Sparkles} />}
                onClick={() => setBurst(++burstSequence.current)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
