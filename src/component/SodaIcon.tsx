import type { SVGProps } from "react";

type IconName =
  "music" | "download" | "disc" | "play" | "sparkle" | "arrow" | "mail";

/**
 * 新しい明るいテーマ用の小さな線画です。アイコンライブラリを増やさず、線幅を揃えます。
 * 必ず文字ラベルと一緒に使う装飾なので、二重に読み上げないよう非表示にしています。
 */
export default function SodaIcon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const shapes = {
    music: (
      <>
        <path d="M9 18V5l11-2v13M9 9l11-2" />
        <ellipse cx="5.5" cy="18.5" rx="3.5" ry="2.5" />
        <ellipse cx="16.5" cy="16.5" rx="3.5" ry="2.5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
      </>
    ),
    disc: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" />
        <path d="M5.5 10a7 7 0 0 1 4-4.5M18.5 14a7 7 0 0 1-4 4.5" />
      </>
    ),
    play: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="5" />
        <path d="m10 9 5 3-5 3Z" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6ZM20 2v4m-2-2h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="4" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {shapes[name]}
    </svg>
  );
}
