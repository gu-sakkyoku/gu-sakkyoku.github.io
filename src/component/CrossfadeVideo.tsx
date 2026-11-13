import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/VStack";
import AppIcon from "./ui/AppIcon";

/**
 * クロスフェードは公開YouTubeを使い、音源配信Worker/R2を経由しません。
 * 自動再生は行わず、16:9の領域（AspectRatio）を予約して読み込み時の位置ずれを防ぎます。
 * 枠は作品ごとのテーマの Card variant="jacket"（ジャケットと同じ枠：白いふちの写真、月明かりの線、版ずれの紙）です。
 * 埋め込みを利用できない環境でも、直下の通常リンクから視聴できます。
 */
export default function CrossfadeVideo({ videoId, albumTitle }: { videoId: string; albumTitle: string }) {
  return (
    <VStack gap={3} className="crossfade-video">
      <Card variant="jacket" padding={3} className="crossfade-video-frame">
        <AspectRatio ratio={16 / 9} fit="cover">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={`${albumTitle} クロスフェード`}
            width="560"
            height="315"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-video h-auto w-full border-0"
          />
        </AspectRatio>
      </Card>
      <HStack gap={2} vAlign="center" minHeight={44}>
        <AppIcon name="circlePlay" size="sm" color="accent" />
        <Link href={`https://www.youtube.com/watch?v=${videoId}`} isStandalone hasUnderline>
          YouTubeでクロスフェードを聴く
        </Link>
      </HStack>
    </VStack>
  );
}
