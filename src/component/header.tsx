"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { site } from "../data/site";
import SodaIcon from "./SodaIcon";

// 常設ボタンとメニューで、行き先・表示名を二重管理しません。
const downloadNavigation = { href: "/download", label: "ダウンロード" };
// PCとスマートフォンで同じリンクを使います。メニュー項目を増やす場合もここだけ変更してください。
const navigation = [
  { href: "/TansanYohou/", label: "炭酸予報" },
  { href: "/Horoscope", label: "Horoscope" },
  { href: "/Nijiiro", label: "虹色memory" },
  downloadNavigation,
  { href: "/", label: "トップページ" },
];
// PCでは常設ボタンと同じリンクを重複させず、スマホの展開メニューには残します。
const desktopNavigation = navigation.filter(({ href }) => href !== downloadNavigation.href);

export default function Cheader() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openMenu) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(false);
        menuButton.current?.focus();
      }
    };
    // Tabで本文へ進んだら閉じます。メニューが本文のフォーカス位置を覆わないためです。
    // Escapeとは違い、移動先のフォーカスをボタンへ戻す必要はありません。
    const closeOnOutsideFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    // PC表示へ広げた後にスマホ幅へ戻しても、以前のメニューが突然開かないようにします。
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpenMenu(false);
    };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("focusin", closeOnOutsideFocus);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("focusin", closeOnOutsideFocus);
    };
  }, [openMenu]);

  return (
    <Sheader ref={header} className="site-header">
      <Sinner>
        <Sbrand href="/" aria-label="群馬大学作曲部 トップページ" className="site-brand">
          <Image
            src={site.logo}
            alt="群馬大学作曲部のロゴ"
            width={site.logoSize}
            height={site.logoSize}
            sizes="(min-width: 1024px) 104px, 96px"
            priority
          />
          {/* ページのh1と区別するため、サイト名は見出しではなくspanにします。 */}
          <span>群馬大学作曲部</span>
        </Sbrand>

        <Snav aria-label="メインメニュー" className="site-nav">
          <ul>
            {desktopNavigation.map(({ href, label }, index) => (
              <li key={href}>
                {index > 0 && <span aria-hidden="true">|</span>}
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </Snav>

        <Sactions>
          {/* ページ移動なのでbuttonではなくLink。メニューを開かず音源の入口へ進めます。 */}
          <SdownloadLink href={downloadNavigation.href} onClick={() => setOpenMenu(false)}>
            <SodaIcon name="download" className="site-download-icon" />
            {downloadNavigation.label}
          </SdownloadLink>
          <Sbutton
            ref={menuButton}
            type="button"
            onClick={() => setOpenMenu((current) => !current)}
            aria-label={openMenu ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={openMenu}
            aria-controls="mobile-navigation"
            $open={openMenu}
            className="site-menu-button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </Sbutton>
        </Sactions>
      </Sinner>

      {/* 本文を覆う全画面モーダルにはせず、ヘッダーの下に開く通常のナビです。 */}
      <SmobileNav
        id="mobile-navigation"
        aria-label="モバイルメニュー"
        aria-hidden={!openMenu}
        inert={!openMenu}
        $open={openMenu}
        className="site-mobile-nav"
      >
        <ul>
          {navigation.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpenMenu(false)}>{label}</Link>
            </li>
          ))}
        </ul>
      </SmobileNav>
    </Sheader>
  );
}

const Sheader = styled.header`
  /* 固定サイズ＋上限付きの中身で、WQHD/4Kでもロゴが巨大化しないようにします。 */
  height: var(--site-header-height);
  position: fixed;
  inset: 0 0 auto;
  z-index: 999;
  background: #fff;
  color: #171717;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding-inline: clamp(1rem, 3vw, 2rem);

  :where(a, button):focus-visible {
    outline: 2px solid #1d4ed8;
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const Sinner = styled.div`
  max-width: 80rem;
  height: 100%;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Sbrand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;

  img {
    /* 支給PNGの大きな透明余白だけを表示領域の外へ出します。
       object-fitで絵柄の縦横比を保ち、元画像自体は切り抜き・上書きしません。 */
    width: 6rem;
    height: 3.25rem;
    object-fit: cover;
    flex-shrink: 0;
  }

  span {
    display: none;
    color: #1e3a8a;
    font-size: 1.5rem;
    font-weight: bold;
    white-space: nowrap;
  }

  @media (min-width: 64rem) {
    img { width: 6.5rem; height: 3.5rem; }
    span { display: inline; }
  }
`;

const Snav = styled.nav`
  display: none;

  @media (min-width: 64rem) {
    display: block;
  }

  /* 区切り線は読み上げ対象から外し、リンクの押せる高さを確保します。 */
  ul { display: flex; align-items: center; }
  li { display: flex; align-items: center; gap: 0.75rem; }
  li + li { margin-left: 0.75rem; }
  a { display: inline-flex; align-items: center; min-height: 2.75rem; white-space: nowrap; }
  a:hover { text-decoration: underline; text-underline-offset: 0.25em; }
`;

const Sactions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const SdownloadLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* ヘッダーを薄くしても、押せる高さ44pxは確保します。 */
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #adc9dc;
  border-radius: 999px;
  background: linear-gradient(120deg, #fff, #eaf5ff, #fff4fb);
  color: #315b77;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
  transition: border-color 180ms ease;

  &:hover { border-color: #315b77; }
  &:active { background: #e3f0fa; }
  /* 320px幅ではラベルを優先し、アイコン追加でメニューを押し出さないようにします。 */
  .site-download-icon { display: none; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Sbutton = styled.button<{ $open: boolean }>`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  span {
    width: 28px;
    height: 2px;
    background: #52525b;
    transition: transform 180ms ease, opacity 180ms ease;
  }
  span:first-child { transform: ${({ $open }) => $open ? "translateY(8px) rotate(45deg)" : "none"}; }
  span:nth-child(2) { opacity: ${({ $open }) => $open ? 0 : 1}; }
  span:last-child { transform: ${({ $open }) => $open ? "translateY(-8px) rotate(-45deg)" : "none"}; }

  @media (min-width: 64rem) { display: none; }
  @media (prefers-reduced-motion: reduce) { span { transition: none; } }
`;

const SmobileNav = styled.nav<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: min(22rem, 100%);
  max-height: calc(100dvh - var(--site-header-height));
  overflow-y: auto;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  padding: 1rem;
  visibility: ${({ $open }) => $open ? "visible" : "hidden"};
  opacity: ${({ $open }) => $open ? 1 : 0};
  transition: opacity 180ms ease;

  /* 閉じるボタンは常にヘッダー内に残るので、ナビに隠されません。 */
  a { display: flex; align-items: center; min-height: 3rem; padding: 0.5rem 0.75rem; }
  a:hover { background: #e2e8f0; }
  @media (min-width: 64rem) { display: none; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
