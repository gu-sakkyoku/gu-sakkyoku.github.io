import { Heading } from "@astryxdesign/core/Heading";
import { List, ListItem } from "@astryxdesign/core/List";
import { Text } from "@astryxdesign/core/Text";
import AppIcon from "./AppIcon";
import Artwork from "./Artwork";

export type TrackRow = {
  title: string;
  /** 作者・ボーカルなどの表記。データに書かれた文字列を、そのまま1行ずつ表示します。 */
  credits?: string[];
  /** 歌詞ページがある曲だけ指定します。行全体が歌詞ページへのリンクになります。 */
  lyricHref?: string;
  artwork?: { src: string; alt: string };
};
export type TrackDisc = { name: string; tracks: TrackRow[] };

/**
 * 全年度共通の曲リストです。曲順・曲名・作者表記はデータの順番と文字のまま表示します。
 * 歌詞のある曲は、行のどこを押しても歌詞ページへ進めます。リンクだと分かるよう
 * 「歌詞はこちら」の文字と矢印を必ず表示します（色だけに頼りません）。
 * 見た目（番号の書体、区切り線、色）は作品ごとのテーマとCSSで変わります。
 */
export default function TrackList({ discs, idPrefix }: { discs: TrackDisc[]; idPrefix: string }) {
  return (
    <div className="track-discs" data-discs={discs.length}>
      {discs.map((disc, discIndex) => (
        <section key={disc.name} className="track-disc" aria-labelledby={`${idPrefix}-${discIndex + 1}`} data-reveal>
          <div className="track-disc-heading">
            <Heading level={3} id={`${idPrefix}-${discIndex + 1}`}>{disc.name}</Heading>
            <Text type="supporting">{disc.tracks.length}曲</Text>
          </div>
          <List hasDividers edge="flush" density="spacious">
            {disc.tracks.map((track, index) => (
              <ListItem
                key={track.title}
                href={track.lyricHref}
                align="start"
                startContent={<span className="track-number">{String(index + 1).padStart(2, "0")}</span>}
                label={<span className="track-title">{track.title}</span>}
                description={
                  (track.credits?.length || track.lyricHref) && (
                    <span className="track-meta">
                      {track.credits?.map((credit) => (
                        <span key={credit} className="track-credit">{credit}</span>
                      ))}
                      {track.lyricHref && (
                        <span className="track-lyric-mark">
                          歌詞はこちら
                          <AppIcon name="arrowRight" size="sm" color="inherit" />
                        </span>
                      )}
                    </span>
                  )
                }
                endContent={
                  track.artwork && (
                    <Artwork src={track.artwork.src} alt={track.artwork.alt} sizes="72px" className="track-artwork" />
                  )
                }
              />
            ))}
          </List>
        </section>
      ))}
    </div>
  );
}
