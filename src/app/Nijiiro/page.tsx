import type { Metadata } from "next";
import ClientWrapper from "../../component/ClientWrapper";
import ArchiveAlbumPage from "../../component/ArchiveAlbumPage";
import AlbumMotion from "../../component/AlbumMotion";
import { archiveAlbums } from "../../data/archiveAlbums";

const album = archiveAlbums[2024];
const title = "虹色memory | 群馬大学作曲部 1stアルバム";
const description =
  "群馬大学作曲部の2024年アルバム「虹色memory」。全11曲の曲目、歌詞、クロスフェード、ダウンロードカードの案内を掲載しています。";

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

export default function NijiiroPage() {
  return (
    <ClientWrapper className="archive-album-main">
      <AlbumMotion theme={album.theme}><ArchiveAlbumPage album={album} /></AlbumMotion>
    </ClientWrapper>
  );
}
