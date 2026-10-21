/**
 * クロスフェードは公開YouTubeを使い、音源配信Worker/R2を経由しません。
 * 自動再生は行わず、16:9の領域を予約して読み込み時の位置ずれを防ぎます。
 * 埋め込みを利用できない環境でも、直下の通常リンクから視聴できます。
 */
export default function CrossfadeVideo({ videoId, albumTitle }: { videoId: string; albumTitle: string }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`${albumTitle} クロスフェード`}
        width="560"
        height="315"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video h-auto w-full rounded-xl border-0 shadow-lg"
      />
      <a href={`https://www.youtube.com/watch?v=${videoId}`} className="site-text-link mt-3 inline-flex min-h-11 items-center rounded text-base">
        YouTubeでクロスフェードを聴く
      </a>
    </div>
  );
}
