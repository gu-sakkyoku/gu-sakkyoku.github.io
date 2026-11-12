import { Text } from "@astryxdesign/core/Text";
import type { Poster } from "../../data/aramaki2026";
import Artwork from "../ui/Artwork";

/**
 * 作曲部が作ったポスターを、そのまま掲載します。押すと元の大きさの画像が開きます。
 * ポスターの文字（出演者・時刻・価格）はページの本文にも同じ内容があるので、画像が読めない人も困りません。
 * デザインした人が分かっているポスターには、その名前を添えます。
 */
export default function PosterFigure({ poster }: { poster: Poster }) {
  return (
    <figure className="aramaki-poster" data-reveal>
      {/* リンクの読み上げ名は画像の説明文＋「拡大」。同じ行き先のリンクを2つ並べないよう、リンクは1つだけです。 */}
      <a href={poster.src} className="aramaki-poster-link" aria-label={`${poster.alt}（拡大して見る）`}>
        <Artwork src={poster.src} alt="" sizes="(max-width: 1023px) min(90vw, 352px), 320px" />
      </a>
      <figcaption>
        <Text type="supporting" display="block">ポスター（押すと拡大します）</Text>
        {poster.credit && <Text type="supporting" display="block">designed by {poster.credit}</Text>}
      </figcaption>
    </figure>
  );
}
