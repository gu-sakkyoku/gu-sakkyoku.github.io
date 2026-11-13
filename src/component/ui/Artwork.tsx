import manifest from "../../data/artwork.generated.json";

type ArtworkSource = { width: number; height: number; variants: { width: number; src: string }[] };
const sources = manifest as Record<string, ArtworkSource>;

/**
 * ジャケットなどの絵を、画面に合った大きさの軽いWebPで表示します。
 * 元のPNG（1枚あたり数MB）はそのまま残し、ここでは scripts/generate-artwork.mjs が作った縮小版を使います。
 * 縮小版がない画像を渡した場合は、元の画像をそのまま表示します。
 */
export default function Artwork({
  src,
  alt,
  sizes,
  className,
  priority = false,
  jacketHref,
}: {
  src: string;
  alt: string;
  /** 表示幅の目安。例："(max-width: 640px) 90vw, 448px" */
  sizes: string;
  className?: string;
  /** 最初に見える大きな絵だけtrueにします。それ以外は画面に近づいてから読み込みます。 */
  priority?: boolean;
  /** 作品一覧のジャケットに付ける、その作品のページのURL。ページ移動のときに作品ページのジャケットへつなげます（JacketHandoff）。 */
  jacketHref?: string;
}) {
  const source = sources[src];
  const largest = source?.variants.at(-1);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 静的書き出しのため、ビルド時に作ったsrcsetを自分で指定します。
    <img
      src={largest?.src ?? src}
      srcSet={source?.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ")}
      sizes={source ? sizes : undefined}
      width={source?.width}
      height={source?.height}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      data-jacket-href={jacketHref}
    />
  );
}
