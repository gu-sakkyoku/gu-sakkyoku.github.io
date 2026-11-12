import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { List, ListItem } from "@astryxdesign/core/List";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import CrossfadeVideo from "./CrossfadeVideo";
import NewAlbumAnnouncement from "./NewAlbumAnnouncement";
import FestivalNotice from "./aramaki/FestivalNotice";
import AlbumShelf from "./ui/AlbumShelf";
import AppIcon, { type AppIconName } from "./ui/AppIcon";
import SectionHeading from "./ui/SectionHeading";
import { albums } from "../data/albums";
import { contactNavigation, downloadNavigation } from "../data/navigation";

// 最新作は年度データから選びます。新しい年度を追加すると、トップの主役も自動で入れ替わります。
const latestAlbum = [...albums].sort((a, b) => b.year - a.year)[0];
const contactIcons: AppIconName[] = ["mail", "atSign", "circlePlay"];

/** トップページの本文です。順番は「最新作 → 試聴 → 作品一覧 → 作曲部について」。 */
export default function MainPage() {
  return (
    <>
      {/* 学園祭など、期間限定の案内（src/data/aramaki2026.ts の showOnHome で出し入れします）。 */}
      <FestivalNotice />

      {/* トップの主役は新作。部の紹介より先に、試聴・歌詞の入口を見せます。 */}
      {latestAlbum && <NewAlbumAnnouncement album={latestAlbum} />}

      {latestAlbum?.crossfadeVideoId && (
        <section aria-labelledby="crossfade" className="site-container site-section">
          <SectionHeading id="crossfade">Crossfade / クロスフェード</SectionHeading>
          <CrossfadeVideo videoId={latestAlbum.crossfadeVideoId} albumTitle={latestAlbum.title} />
        </section>
      )}

      <section aria-labelledby="past-albums" className="site-container site-section">
        <SectionHeading id="past-albums">作品一覧</SectionHeading>
        <AlbumShelf />
      </section>

      <section aria-labelledby="about-club" className="site-container site-section home-about">
        <VStack gap={5} hAlign="start" data-reveal>
          <Heading level={2} id="about-club">群馬大学作曲部について</Heading>
          {/* 以前トップの読み込み画面に出していた、部の言葉です。 */}
          <p className="home-motto">音楽とは、命だ</p>
          <Text as="p">
            群馬大学作曲部の公式サイトです。オリジナルアルバムの作品情報・歌詞と、ダウンロードカードの案内を掲載しています。
          </Text>
          {/* 文が長いので、狭い画面でも途中で切れずに折り返せるリンクにしています。 */}
          <HStack gap={2} vAlign="center" minHeight={44}>
            <AppIcon name="download" color="accent" />
            <Link href={downloadNavigation.href} isStandalone hasUnderline weight="bold">
              ダウンロードカードをお持ちの方はこちらから
            </Link>
          </HStack>
        </VStack>
        <VStack gap={3} className="home-contact" data-reveal>
          <Heading level={3}>作曲部とつながる</Heading>
          <List hasDividers edge="flush" density="spacious">
            {contactNavigation.map((item, index) => (
              <ListItem
                key={item.href}
                href={item.href}
                startContent={<AppIcon name={contactIcons[index]} color="accent" />}
                label={item.label}
                description={item.kind}
              />
            ))}
          </List>
        </VStack>
      </section>
    </>
  );
}
