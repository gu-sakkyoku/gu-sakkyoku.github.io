"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * トップとHoroscopeで使っていた同じジャケット演出を共通化しています。
 * 斜めに重ねる見た目は維持し、幅の上限はglobals.cssのalbum-jacketsで管理します。
 */
export default function AlbumJackets() {
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 10, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" as const };

  return (
    <div className="album-jackets">
      <motion.div
        className="album-jackets-front"
        animate={reducedMotion ? { rotate: -8, y: 0 } : { rotate: [-8, -10, -8, -6, -8], y: [0, -4, 0, 4, 0] }}
        transition={transition}
      >
        <Image src="/cover1.png" alt="Horoscopeのアルバムジャケット" width={1500} height={1500} sizes="(min-width: 1200px) 396px, 33vw" />
      </motion.div>
      <motion.div
        className="album-jackets-back"
        animate={reducedMotion ? { rotate: 8, y: 0 } : { rotate: [8, 10, 8, 6, 8], y: [0, 6, 0, -6, 0] }}
        transition={transition}
      >
        <Image src="/cover2.png" alt="Horoscopeのもう一つのジャケット画像" width={1500} height={1500} sizes="(min-width: 1200px) 420px, 35vw" />
      </motion.div>
    </div>
  );
}
