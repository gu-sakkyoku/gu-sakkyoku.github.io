"use client";

import type { ComponentProps } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  AtSign,
  CirclePlay,
  Disc3,
  Download,
  House,
  ListMusic,
  Mail,
  Sparkles,
} from "lucide-react";

// このサイトで使うアイコンの一覧です。増やすときはここへ1行足します（絵柄はlucide-reactのもの）。
const icons = {
  arrowLeft: ArrowLeft,
  arrowLeftRight: ArrowLeftRight,
  arrowRight: ArrowRight,
  atSign: AtSign,
  circlePlay: CirclePlay,
  disc: Disc3,
  download: Download,
  house: House,
  listMusic: ListMusic,
  mail: Mail,
  sparkles: Sparkles,
};

export type AppIconName = keyof typeof icons;

/**
 * アイコンを名前で指定して表示します。色と大きさはAstryxのIconと同じ指定方法です。
 * 文字ラベルと一緒に使う飾りなので、読み上げ対象にはなりません（labelを渡した場合を除く）。
 */
export default function AppIcon({ name, ...props }: { name: AppIconName } & Omit<ComponentProps<typeof Icon>, "icon">) {
  return <Icon icon={icons[name]} {...props} />;
}
