"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { Album } from "../data/albums";

/**
 * トップページの新作告知です。タイトル・ジャケット・配信状態は年度データから受け取ります。
 * ダウンロードを一時停止したときも「配信中」と誤案内せず、コード入力は一覧ページに任せます。
 * 既存サイトの明朝見出し・青いリンク・ジャケットの角丸と影を使い、別のテーマは追加しません。
 */
export default function NewAlbumAnnouncement({
  album,
  motionReady,
}: {
  album: Album;
  motionReady: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reducedMotion = useReducedMotion();
  // 読み込み画面の裏で再生を終えないよう、本文が見える段階から一度だけ告知します。
  // 設定が未確定のSSRでは静止表示。JSなしでも画像・説明・リンクは見えるままです。
  const animateAnnouncement = motionReady && isInView && reducedMotion === false;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="new-album-title"
      className="mx-auto mt-12 w-[80%] max-w-4xl border-y border-current py-10 text-center sm:mt-16 sm:py-12"
    >
      <motion.p
        initial={false}
        animate={{ scale: animateAnnouncement ? [1, 1.04, 1] : 1 }}
        transition={{ duration: animateAnnouncement ? 0.8 : 0, delay: animateAnnouncement ? 1.1 : 0, ease: "easeInOut" }}
        className="font-serif text-[32px] font-semibold leading-snug text-blue-900 dark:text-blue-300 sm:text-[40px]"
      >
        New Album!!!
      </motion.p>
      <p className="mt-3 text-sm leading-6 sm:text-base">{album.year}年 オリジナルアルバム</p>
      <h2 id="new-album-title" className="mt-2 font-serif text-[30px] leading-snug sm:text-[36px]">
        {album.title}
      </h2>

      {album.artwork && (
        <motion.div
          initial={false}
          // 既存のジャケットの「ゆらゆら」に合わせた短い演出。無限ループ・点滅はしません。
          // 幅や高さは変えず、レイアウトを動かさないtransformだけで約2.6秒揺らします。
          animate={animateAnnouncement
            ? { rotate: [0, -3, 2, -1, 0], y: [0, -8, 0, -3, 0] }
            : { rotate: 0, y: 0 }}
          transition={{ duration: animateAnnouncement ? 2.6 : 0, delay: animateAnnouncement ? 1.1 : 0, ease: "easeInOut" }}
          className="mx-auto mt-7 w-full max-w-[340px] sm:max-w-[420px]"
        >
          <Image
            src={album.artwork}
            alt={`${album.title}のアルバムジャケット`}
            width={700}
            height={700}
            sizes="(max-width: 640px) 80vw, 420px"
            className="aspect-square w-full rounded-xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
          />
        </motion.div>
      )}

      <p className="mx-auto mt-7 max-w-xl text-base leading-7">
        {album.downloadEnabled
          ? "ダウンロードカードをお持ちの方は、カードのコードで音源を受け取れます。"
          : album.unavailableReason === "paused"
            ? "現在、ダウンロードを一時停止しています。修正版の準備ができ次第、再開します。"
            : "ダウンロードは準備中です。公開までしばらくお待ちください。"}
      </p>
      {/* 固定QRの入口は維持しつつ、告知からは該当する年度へ直接案内します。 */}
      <Link
        href={`/download/#album-${album.year}`}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-zinc-400 px-6 py-3 font-serif text-lg text-blue-700 underline underline-offset-4 transition-colors hover:bg-zinc-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none dark:text-blue-300 sm:w-auto"
      >
        ダウンロードページへ
      </Link>
    </section>
  );
}
