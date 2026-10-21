"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import type { Album } from "../data/albums";
import AlbumEventNotice from "./AlbumEventNotice";
import CrossfadeVideo from "./CrossfadeVideo";
import { albumMincho, albumRounded } from "../lib/album2026-font";

// ランダム生成せず、SSRとブラウザで同じ装飾を描きます。すべて読み上げ対象外です。
const bubbles = [
  { left: "8%", top: "13%", size: 34 },
  { left: "87%", top: "7%", size: 72 },
  { left: "76%", top: "38%", size: 24 },
  { left: "5%", top: "57%", size: 48 },
  { left: "94%", top: "64%", size: 18 },
];

// 泡の方向は固定値にし、SSRとブラウザで変わらないようにします。音・通信は発生しません。
const popParticles = Array.from({ length: 12 }, (_, index) => ({
  x: Math.cos(index * Math.PI / 6) * (index % 2 ? 120 : 155),
  y: Math.sin(index * Math.PI / 6) * (index % 2 ? 120 : 155),
}));

/**
 * トップと2026年の作品ページで使う新作告知です。作品情報は年度データから受け取ります。
 * ダウンロードを一時停止したときも「配信中」と誤案内せず、コード入力は一覧ページに任せます。
 * 明朝見出し・青いリンクを継承し、2026年だけジャケットに合わせた特別な装飾を使います。
 */
export default function NewAlbumAnnouncement({
  album,
  motionReady,
  context = "home",
}: {
  album: Album;
  motionReady: boolean;
  context?: "home" | "album";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerX, { stiffness: 150, damping: 25 });
  const tiltY = useSpring(pointerY, { stiffness: 150, damping: 25 });
  const [burst, setBurst] = useState(0);
  const burstSequence = useRef(0);
  // 読み込み画面の裏で再生を終えないよう、本文が見える段階から一度だけ告知します。
  // 設定が未確定のSSRでは静止表示。JSなしでも画像・説明・リンクは見えるままです。
  const animateAnnouncement = motionReady && isInView && reducedMotion === false;
  // 2026だけを特別仕様にします。過去作品のページや、将来の別作品へ装飾を強制しません。
  const featured = album.year === 2026;
  const Heading = context === "album" ? "h1" : "h2";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="new-album-title"
      className={featured ? `release-feature ${albumMincho.variable} ${albumRounded.variable}` : "mx-auto mt-12 w-[80%] max-w-4xl border-y border-current py-10 text-center sm:mt-16 sm:py-12"}
    >
      {featured && (
        <div className="release-feature-atmosphere" aria-hidden="true">
          <motion.div
            className="release-feature-mesh"
            initial={false}
            animate={{ x: animateAnnouncement ? [0, 18, 0] : 0, y: animateAnnouncement ? [0, -12, 0] : 0 }}
            transition={{ duration: animateAnnouncement ? 4.6 : 0, ease: "easeInOut" }}
          />
          {bubbles.map((bubble, index) => (
            <motion.span
              key={bubble.left}
              className="release-feature-bubble"
              initial={false}
              style={{ left: bubble.left, top: bubble.top, width: bubble.size, height: bubble.size }}
              animate={{ y: animateAnnouncement ? [0, -30, -8] : 0, opacity: animateAnnouncement ? [0.35, 0.8, 0.45] : 0.45 }}
              transition={{ duration: animateAnnouncement ? 3 : 0, delay: animateAnnouncement ? index * 0.2 : 0, ease: "easeInOut" }}
            />
          ))}
          <span className="release-feature-glint" />
          <span className="release-feature-glint release-feature-glint-second" />
          <span className="release-feature-cloud" />
          <span className="release-feature-cloud release-feature-cloud-second" />
        </div>
      )}
      <div className={featured ? "release-feature-top" : ""}>
        <div className={featured ? "release-feature-copy" : ""}>
          <motion.p
            initial={false}
            animate={{ scale: animateAnnouncement ? [1, 1.04, 1] : 1 }}
            transition={{ duration: animateAnnouncement ? 0.8 : 0, delay: animateAnnouncement ? 0.2 : 0, ease: "easeInOut" }}
            className={featured ? "release-feature-kicker" : "font-serif text-[32px] font-semibold leading-snug text-blue-900 dark:text-blue-300 sm:text-[40px]"}
          >
            New Album!!!
          </motion.p>
          <p className="mt-3 text-sm leading-6 sm:text-base">{album.year}年 オリジナルアルバム</p>
          <Heading id="new-album-title" className={featured ? "release-feature-title font-serif" : "mt-2 font-serif text-[30px] leading-snug sm:text-[36px]"}>
            {album.title}
          </Heading>
        </div>

        <div className={featured ? "release-feature-details" : ""}>
          {album.event && <AlbumEventNotice event={album.event} headingLevel={context === "album" ? 2 : 3} />}

          <div className={featured ? "release-feature-actions" : "mt-7"}>
            {/* 同じ告知を作品ページでも再利用し、そちらでは曲リストへ直接進みます。 */}
            {album.detailPath && (
              <Link href={context === "album" ? "#track-list" : album.detailPath} className={featured ? "release-feature-primary" : "site-text-link inline-flex min-h-12 items-center rounded-full border-2 border-zinc-400 px-6 py-3 font-serif text-lg"}>
                {context === "album" ? "曲リスト・歌詞を見る" : "アルバム詳細・歌詞はこちら"}
              </Link>
            )}
            <Link href={`/download/#album-${album.year}`} className={featured ? "site-text-link inline-flex min-h-12 items-center rounded font-serif" : "site-text-link inline-flex min-h-12 items-center rounded font-serif text-lg"}>
              ダウンロードページへ
            </Link>
          </div>
          <p className="mt-5 text-base leading-7">
            {album.downloadEnabled
              ? "ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。"
              : album.unavailableReason === "paused"
                ? "現在、ダウンロードを一時停止しています。修正版の準備ができ次第、再開します。"
                : "ダウンロードは準備中です。公開までしばらくお待ちください。"}
          </p>
        </div>

        {album.artwork && (
          <motion.div
            initial={false}
            style={featured ? { rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 } : undefined}
            onPointerMove={(event) => {
              // 装飾だけの効果です。タッチ時や「動きを減らす」設定では傾けません。
              if (!featured || reducedMotion !== false || event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              pointerX.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 7);
              pointerY.set((event.clientX - rect.left - rect.width / 2) / rect.width * 7);
            }}
            onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
            // 既存のジャケットの「ゆらゆら」に合わせた短い演出。無限ループ・点滅はしません。
            // 幅や高さは変えず、レイアウトを動かさないtransformだけで約2.6秒揺らします。
            animate={animateAnnouncement
              ? { rotate: [0, -3, 2, -1, 0], y: [0, -8, 0, -3, 0] }
              : { rotate: 0, y: 0 }}
            transition={{ duration: animateAnnouncement ? 2.6 : 0, delay: animateAnnouncement ? 0.2 : 0, ease: "easeInOut" }}
            className={featured ? "release-feature-art" : "mx-auto mt-7 w-full max-w-[340px] sm:max-w-[420px]"}
          >
            {featured && <span className="release-feature-disc" aria-hidden="true" />}
            <div className={featured ? "release-feature-sleeve" : ""}>
            <Image
              src={album.artwork}
              alt={`${album.title}のアルバムジャケット`}
              width={700}
              height={700}
              sizes="(max-width: 640px) 80vw, 460px"
              className="aspect-square w-full rounded-xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            />
            {featured && (
              <motion.span
                aria-hidden="true"
                className="release-feature-shine"
                initial={false}
                animate={{ x: animateAnnouncement ? ["-130%", "260%"] : "-130%", opacity: animateAnnouncement ? [0, 0.5, 0] : 0 }}
                transition={{ duration: animateAnnouncement ? 2.4 : 0, delay: animateAnnouncement ? 0.9 : 0, ease: "easeInOut" }}
              />
            )}
            </div>
            {featured && (
              <p className="release-feature-art-caption">
                <span>{album.year}</span>
                <span>{album.discs.length} DISCS / {album.discs.reduce((total, disc) => total + disc.tracks.length, 0)} TRACKS</span>
              </p>
            )}
            {featured && burst > 0 && (
              <div className="release-feature-pop" aria-hidden="true">
                {popParticles.map((particle, index) => (
                  <motion.span
                    key={`${burst}-${index}`}
                    className={index % 2 ? "release-pop-bubble" : "release-pop-star"}
                    // 動きを減らす場合は、離れた位置に静止した泡をゆっくりフェードするだけにします。
                    style={reducedMotion ? { left: `calc(50% + ${particle.x}px)`, top: `calc(45% + ${particle.y}px)` } : undefined}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 0, y: 0, scale: 0.2 }}
                    animate={reducedMotion ? { opacity: [0, 0.8, 0] } : { x: particle.x, y: particle.y, scale: [0.2, 1.2, 0.8], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.1, delay: index * 0.02, ease: "easeOut" }}
                    onAnimationComplete={index === popParticles.length - 1 ? () => setBurst((current) => current === burst ? 0 : current) : undefined}
                  />
                ))}
              </div>
            )}
            {featured && (
              <button
                type="button"
                className="release-pop-button"
                aria-label="ジャケットの周りに泡をはじかせる"
                onClick={() => setBurst(++burstSequence.current)}
              >
                泡をはじく <span aria-hidden="true">✧</span>
              </button>
            )}
          </motion.div>
        )}
      </div>
      {album.crossfadeVideoId && (
        <div className={featured ? "release-feature-media" : ""}>
          <p className="font-serif text-xl">Crossfade / クロスフェード</p>
          <CrossfadeVideo videoId={album.crossfadeVideoId} albumTitle={album.title} />
        </div>
      )}
    </section>
  );
}
