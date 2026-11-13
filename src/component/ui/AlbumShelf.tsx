import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { albums } from "../../data/albums";
import { worldOfYear } from "../../data/worlds";
import World from "../World";
import AppIcon from "./AppIcon";
import Artwork from "./Artwork";
import JacketHandoff from "./JacketHandoff";

/**
 * 作品の一覧です。各カードは、その作品自身のテーマ（色・書体）で表示します。
 * 年度データ（albums.ts）から作るので、新しい年度を追加すれば自動で並びます。
 * exceptYearを指定すると、いま見ている作品を除いた「ほかの作品」になります。
 */
export default function AlbumShelf({ exceptYear }: { exceptYear?: number }) {
  const items = [...albums]
    .sort((a, b) => b.year - a.year)
    .filter((album) => album.detailPath && album.year !== exceptYear);
  return (
    <ul className="album-shelf" data-count={items.length}>
      <JacketHandoff />
      {items.map((album) => {
        const tracks = album.discs.reduce((total, disc) => total + disc.tracks.length, 0);
        return (
          <li key={album.year}>
            <World name={worldOfYear(album.year)}>
              <ClickableCard
                label={`${album.title}の作品・歌詞を見る`}
                href={album.detailPath}
                padding={4}
                elevation="med"
              >
                <div className={`album-shelf-card album-shelf-card--${worldOfYear(album.year)}`}>
                  {album.artwork && (
                    <Artwork
                      src={album.artwork}
                      alt={`${album.title}のアルバムジャケット`}
                      sizes="(max-width: 640px) 40vw, 240px"
                      className="album-shelf-art"
                      jacketHref={album.detailPath}
                    />
                  )}
                  <VStack gap={2}>
                    <Text type="supporting">{album.year}年・{album.discs.length}枚組・全{tracks}曲</Text>
                    <Heading level={3}>{album.title}</Heading>
                    <span className="album-shelf-link">
                      作品・歌詞を見る
                      <AppIcon name="arrowRight" size="sm" color="inherit" />
                    </span>
                  </VStack>
                </div>
              </ClickableCard>
            </World>
          </li>
        );
      })}
    </ul>
  );
}
