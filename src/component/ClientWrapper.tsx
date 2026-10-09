import type { ReactNode } from "react";
import Cheader from "./header";
import Cfooter from "./footer";

/**
 * 既存の名前を保った、全ページ共通の外枠です。
 * 高さの実測をやめ、globals.cssのsite-mainで静的HTMLの段階から余白を確保します。
 * 新しいページもこれで囲めば、ロゴの読み込みや画面幅によってタイトルが隠れません。
 */
export default function ClientWrapper({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <>
      <Cheader />
      <main className={`site-main ${className}`}>{children}</main>
      <Cfooter />
    </>
  );
}
