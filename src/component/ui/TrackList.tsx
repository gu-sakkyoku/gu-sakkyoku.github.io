import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { List, ListItem } from "@astryxdesign/core/List";
import { Section } from "@astryxdesign/core/Section";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
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
 *
 * 部品はすべてAstryxです。見た目は作品ごとのテーマが受け持ちます：
 * - ディスクの面は Section の variant="panel"（炭酸予報は白い泡の面、Horoscopeは夜空のガラス、虹色memoryは版ずれの紙）
 * - 曲番号は Text の type="track-number"（泡の玉、星、斜体の数字）
 * 作品のCSS（src/app/worlds/）は、虹の七色の順番など、行ごとに変わる飾りだけを足します。
 */
export default function TrackList({
  discs,
  idPrefix,
  stacked = false,
}: {
  discs: TrackDisc[];
  idPrefix: string;
  /** 狭い列に置くときは、ディスクを横に並べず縦に積みます。 */
  stacked?: boolean;
}) {
  return (
    <Grid columns={discs.length > 1 && !stacked ? { minWidth: 320, max: 2 } : 1} gap={6} align="start" className="track-discs">
      {discs.map((disc, discIndex) => {
        const headingId = `${idPrefix}-${discIndex + 1}`;
        return (
          <Section
            key={disc.name}
            variant="panel"
            padding={5}
            role="region"
            aria-labelledby={headingId}
            className="track-disc"
          >
            <List
              hasDividers
              edge="flush"
              density="spacious"
              header={
                <HStack gap={3} hAlign="between" vAlign="center" className="track-disc-heading">
                  <Heading level={3} id={headingId}>{disc.name}</Heading>
                  <Text type="supporting">{disc.tracks.length}曲</Text>
                </HStack>
              }
            >
              {disc.tracks.map((track, index) => (
                <ListItem
                  key={track.title}
                  href={track.lyricHref}
                  align="start"
                  className={track.lyricHref ? "track-row track-row--lyric" : "track-row"}
                  startContent={<Text type="track-number" className="track-number">{String(index + 1).padStart(2, "0")}</Text>}
                  label={<Text weight="bold" className="track-title">{track.title}</Text>}
                  description={
                    (track.credits?.length || track.lyricHref) && (
                      <VStack gap={1} hAlign="start">
                        {track.credits?.map((credit) => (
                          <Text key={credit} type="supporting" color="secondary">{credit}</Text>
                        ))}
                        {track.lyricHref && (
                          <Text weight="bold" color="accent" className="track-lyric-mark">
                            歌詞はこちら
                            <AppIcon name="arrowRight" size="sm" color="inherit" />
                          </Text>
                        )}
                      </VStack>
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
          </Section>
        );
      })}
    </Grid>
  );
}
