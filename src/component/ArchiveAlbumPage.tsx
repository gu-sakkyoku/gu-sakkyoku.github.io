import Image from "next/image";
import Link from "next/link";
import type { ArchiveAlbum } from "../data/archiveAlbums";
import ArchiveArtworkStage from "./ArchiveArtworkStage";
import CrossfadeVideo from "./CrossfadeVideo";
import SodaIcon from "./SodaIcon";

/** 曲目・クレジットは静的HTML。ジャケットを入れ替える操作だけを小さなClient Componentへ分けます。 */
export default function ArchiveAlbumPage({ album }: { album: ArchiveAlbum }) {
  const totalTracks = album.discs.reduce(
    (total, disc) => total + disc.tracks.length,
    0,
  );
  return (
    <>
      <section className="archive-hero" aria-labelledby="archive-album-title">
        <div className="archive-hero-scene" aria-hidden="true" />
        <div className="archive-edition">
          <p>
            {album.year} / {album.ordinal === 1 ? "1st" : "2nd"} album
          </p>
          <p>
            {album.discs.length}枚組・全{totalTracks}曲
          </p>
        </div>
        <div className="archive-hero-copy">
          <p className="archive-artist">群馬大学作曲部</p>
          <h1 id="archive-album-title" className="archive-title">
            {album.theme === "rainbow" ? (
              <>
                <span>虹色</span>
                <span className="archive-title-memory">memory</span>
              </>
            ) : (
              album.title
            )}
          </h1>
        </div>
        <ArchiveArtworkStage
          album={{
            title: album.title,
            theme: album.theme,
            artwork: album.artwork,
          }}
        />
        <nav className="archive-hero-actions" aria-label="アルバムの案内">
          <a href="#archive-crossfade">
            クロスフェード
            <SodaIcon name="arrow" />
          </a>
          <a href="#archive-tracks">
            曲リスト・歌詞
            <SodaIcon name="arrow" />
          </a>
          <Link href={`/download/#album-${album.year}`}>
            ダウンロード
            <SodaIcon name="arrow" />
          </Link>
        </nav>
      </section>

      <section
        className="archive-crossfade"
        aria-labelledby="archive-crossfade"
      >
        <div className="archive-section-heading">
          <h2 id="archive-crossfade">クロスフェード</h2>
        </div>
        <CrossfadeVideo
          videoId={album.crossfadeVideoId}
          albumTitle={album.title}
        />
      </section>

      <section className="archive-tracks" aria-labelledby="archive-tracks">
        <div className="archive-section-heading">
          <h2 id="archive-tracks">曲リスト・歌詞</h2>
        </div>
        <p className="archive-track-guide">
          歌詞のある曲は、リンクから歌詞ページへ進めます。
        </p>
        {album.discs.length > 1 && (
          <nav className="archive-disc-nav" aria-label="ディスクを選ぶ">
            {album.discs.map((disc, index) => (
              <a key={disc.name} href={`#archive-disc-${index + 1}`}>
                {disc.name}
              </a>
            ))}
          </nav>
        )}
        <div className="archive-discs">
          {album.discs.map((disc, discIndex) => (
            <section
              className="archive-disc"
              key={disc.name}
              aria-labelledby={`archive-disc-${discIndex + 1}`}
            >
              <div className="archive-disc-heading">
                <h3 id={`archive-disc-${discIndex + 1}`}>{disc.name}</h3>
                <span>{disc.tracks.length}曲</span>
              </div>
              <ol className="archive-track-list">
                {disc.tracks.map((track, index) => (
                  <li key={track.title}>
                    <span className="archive-track-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="archive-track-copy">
                      <h4>{track.title}</h4>
                      {track.artwork && (
                        <Image
                          className="archive-track-art"
                          src={track.artwork}
                          alt={`${track.title}のイメージ`}
                          width={1280}
                          height={1280}
                          sizes="112px"
                        />
                      )}
                      {track.credits?.map((credit) => (
                        <p className="archive-track-credit" key={credit}>
                          {credit}
                        </p>
                      ))}
                      {track.lyricPath && (
                        <Link
                          className="archive-lyric-link"
                          href={track.lyricPath}
                        >
                          歌詞はこちら
                          <SodaIcon name="arrow" />
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <aside
        className="archive-download-note"
        aria-label="ダウンロードカードのご案内"
      >
        <p>ダウンロードカードをお持ちの方へ</p>
        <Link
          href={`/download/#album-${album.year}`}
          className="archive-primary-link"
        >
          {album.year}年の音源を受け取る
          <SodaIcon name="arrow" />
        </Link>
        <Link className="archive-back-link" href="/">
          トップページへ戻る
        </Link>
      </aside>
    </>
  );
}
