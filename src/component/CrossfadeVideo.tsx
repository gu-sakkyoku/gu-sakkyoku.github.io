import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { VStack } from "@astryxdesign/core/VStack";
import AppIcon from "./ui/AppIcon";

/**
 * クロスフェードは公開YouTubeを使い、音源配信Worker/R2を経由しません。
 * 自動再生は行わず、16:9の領域を予約して読み込み時の位置ずれを防ぎます。
 * 埋め込みを利用できない環境でも、直下の通常リンクから視聴できます。
 */
export default function CrossfadeVideo({ videoId, albumTitle }: { videoId: string; albumTitle: string }) {
  return (
    <VStack gap={3} className="crossfade-video" data-reveal>
      <div className="crossfade-video-frame">
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
      </div>
      <HStack gap={2} vAlign="center" minHeight={44}>
        <AppIcon name="circlePlay" size="sm" color="accent" />
        <Link href={`https://www.youtube.com/watch?v=${videoId}`} isStandalone hasUnderline>
          YouTubeでクロスフェードを聴く
        </Link>
      </HStack>
    </VStack>
  );
}
