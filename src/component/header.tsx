"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";

// PCとスマートフォンで同じリンクを使います。メニュー項目を増やす場合もここだけ変更してください。
const navigation = [
  { href: "/Horoscope", label: "Horoscope" },
  { href: "/Nijiiro", label: "虹色memory" },
  { href: "/download", label: "ダウンロード" },
  { href: "/", label: "トップページ" },
];

export default function Cheader() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!openMenu) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(false);
        menuButton.current?.focus();
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
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openMenu]);

  return (
    <Sheader>
      <Sinner>
        <Sbrand href="/" aria-label="群馬大学作曲部 トップページ">
          <Image
            src="/sakkyokukyara.png"
            alt="群馬大学作曲部のロゴ"
            width={1280}
            height={1280}
            sizes="(min-width: 1024px) 64px, 48px"
          />
          {/* ページのh1と区別するため、サイト名は見出しではなくspanにします。 */}
          <span>群馬大学作曲部</span>
        </Sbrand>

        <Snav aria-label="メインメニュー">
          <ul>
            {navigation.map(({ href, label }, index) => (
              <li key={href}>
                {index > 0 && <span aria-hidden="true">|</span>}
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </Snav>

        <Sbutton
          ref={menuButton}
          type="button"
          onClick={() => setOpenMenu((current) => !current)}
          aria-label={openMenu ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={openMenu}
          aria-controls="mobile-navigation"
          $open={openMenu}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </Sbutton>
      </Sinner>

      {/* 本文を覆う全画面モーダルにはせず、ヘッダーの下に開く通常のナビです。 */}
      <SmobileNav
        id="mobile-navigation"
        aria-label="モバイルメニュー"
        aria-hidden={!openMenu}
        inert={!openMenu}
        $open={openMenu}
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
  gap: 1.5rem;
`;

const Sbrand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;

  img {
    /* 親の25%・画像の50%という割合指定をやめ、必ず正方形のまま収めます。 */
    width: 3rem;
    height: 3rem;
    object-fit: contain;
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
    img { width: 4rem; height: 4rem; }
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

const Sbutton = styled.button<{ $open: boolean }>`
  width: 3rem;
  height: 3rem;
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
