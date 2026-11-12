"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@astryxdesign/core/Button";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { MobileNav } from "@astryxdesign/core/MobileNav";
import { SideNavItem, SideNavSection } from "@astryxdesign/core/SideNav";
import { TopNav, TopNavItem } from "@astryxdesign/core/TopNav";
import { Disc3, Download, House, PartyPopper } from "lucide-react";
import { albumNavigation, downloadNavigation, eventNavigation, homeNavigation, isCurrentPath } from "../data/navigation";
import { site } from "../data/site";
import type { WorldName } from "./World";

/**
 * 全ページ共通のヘッダーです。AstryxのTopNav（PC）とMobileNav（スマホの引き出しメニュー）で組み立てています。
 * - 行き先は src/data/navigation.ts の1か所で管理します。作品は年度データから自動で並びます。
 * - いま見ている作品のメニュー項目は「現在地」として強調されます（歌詞ページでも同じ）。
 * - ダウンロードはメニューを開かなくても押せるよう、常にボタンとして表示します。
 * - 引き出しメニューのEscape・背景クリックで閉じる動作、フォーカスの戻し方はMobileNavが受け持ちます。
 */
export default function Cheader({ world }: { world: WorldName }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // PC幅（64rem以上）へ広げたら、開いたままのスマホ用メニューを閉じます。globals.cssの切り替え幅と揃えること。
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  // 暗い世界（Horoscope）では、支給された白色版のロゴを使います。
  const onDark = world === "horoscope";
  const logo = onDark ? site.logoOnDark : site.logo;
  const logoSize = onDark ? site.logoOnDarkSize : site.logoSize;

  return (
    <header className="site-header">
      <TopNav
        label="メインメニュー"
        heading={
          <a href={homeNavigation.href} aria-label="群馬大学作曲部 トップページ" className="site-brand">
            <Image
              src={logo}
              alt="群馬大学作曲部のロゴ"
              width={logoSize}
              height={logoSize}
              sizes="(min-width: 1024px) 104px, 96px"
              priority
            />
            {/* ページのh1と区別するため、サイト名は見出しではなくspanにします。 */}
            <span>群馬大学作曲部</span>
          </a>
        }
        startContent={
          <HStack gap={1} vAlign="center" className="site-nav-desktop">
            {[...eventNavigation, ...albumNavigation].map((item) => (
              <TopNavItem
                key={item.href}
                label={item.label}
                href={item.href}
                isSelected={isCurrentPath(pathname, item.href)}
              />
            ))}
          </HStack>
        }
        endContent={
          <HStack gap={2} vAlign="center">
            <Button
              label={downloadNavigation.label}
              href={downloadNavigation.href}
              variant={isCurrentPath(pathname, downloadNavigation.href) ? "secondary" : "primary"}
              icon={<Icon icon={Download} />}
            />
            <HStack className="site-nav-menu-button">
              <IconButton
                label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
                icon={<Icon icon="menu" />}
                variant="ghost"
                onClick={() => setMenuOpen(true)}
              />
            </HStack>
          </HStack>
        }
      />

      <MobileNav isOpen={menuOpen} onOpenChange={setMenuOpen} header="メニュー" side="end" width={300}>
        <SideNavItem
          label={homeNavigation.label}
          href={homeNavigation.href}
          icon={House}
          isSelected={isCurrentPath(pathname, homeNavigation.href)}
          onClick={() => setMenuOpen(false)}
        />
        {eventNavigation.map((item) => (
          <SideNavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={PartyPopper}
            isSelected={isCurrentPath(pathname, item.href)}
            onClick={() => setMenuOpen(false)}
          />
        ))}
        <SideNavSection title="作品一覧">
          {albumNavigation.map((item) => (
            <SideNavItem
              key={item.href}
              label={`${item.label}（${item.year}）`}
              href={item.href}
              icon={Disc3}
              isSelected={isCurrentPath(pathname, item.href)}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </SideNavSection>
        <SideNavItem
          label={downloadNavigation.label}
          href={downloadNavigation.href}
          icon={Download}
          isSelected={isCurrentPath(pathname, downloadNavigation.href)}
          onClick={() => setMenuOpen(false)}
        />
      </MobileNav>
    </header>
  );
}
