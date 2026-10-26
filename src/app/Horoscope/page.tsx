import type { Metadata } from "next";
import ClientWrapper from "../../component/ClientWrapper";
import ArchiveAlbumPage from "../../component/ArchiveAlbumPage";
import AlbumMotion from "../../component/AlbumMotion";
import { archiveAlbums } from "../../data/archiveAlbums";

const album = archiveAlbums[2025];
const title = "Horoscope | 群馬大学作曲部 2ndアルバム";
const description =
  "群馬大学作曲部の2025年アルバム「Horoscope」。2枚組・全23曲の曲目、クレジット、歌詞、クロスフェードを掲載しています。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: album.detailPath },
  openGraph: {
    title,
    description,
    url: album.detailPath,
    images: [album.artwork],
  },
  twitter: { title, description, images: [album.artwork] },
};

export default function HoroscopePage() {
  return (
    <ClientWrapper className="archive-album-main">
      <AlbumMotion theme={album.theme}><ArchiveAlbumPage album={album} /></AlbumMotion>
    </ClientWrapper>
  );
}
