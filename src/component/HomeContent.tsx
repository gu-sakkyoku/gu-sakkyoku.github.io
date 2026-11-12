import AlbumMotion from "./AlbumMotion";
import ClientWrapper from "./ClientWrapper";
import Mainpage from "./Mainpage";

/**
 * トップページの外枠です。最新作と同じ「炭酸予報」のテーマで表示します。
 * 以前あった読み込み演出はやめ、開いた瞬間から本文が見えるようにしています。
 */
export default function HomeContent() {
  return (
    <ClientWrapper world="tansan" className="home-main">
      <AlbumMotion>
        <Mainpage />
      </AlbumMotion>
    </ClientWrapper>
  );
}
