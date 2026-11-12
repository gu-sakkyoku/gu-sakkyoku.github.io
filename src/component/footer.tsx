import { Divider } from "@astryxdesign/core/Divider";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { albumNavigation, contactNavigation, downloadNavigation } from "../data/navigation";

/**
 * 全ページ共通のフッターです。メニューを開かなくても、作品・ダウンロード・連絡先へ移動できます。
 * JavaScriptが動かない環境でも、ここが全ページへの入口になります。
 */
export default function Cfooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="サイト内の案内" className="site-footer-grid">
        <div>
          <Heading level={2} type="display-3" className="site-footer-heading">作品一覧</Heading>
          <ul>
            {albumNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} isStandalone color="primary">{item.year} {item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Heading level={2} type="display-3" className="site-footer-heading">ダウンロード</Heading>
          <ul>
            <li>
              <Link href={downloadNavigation.href} isStandalone color="primary">アルバムダウンロード</Link>
            </li>
          </ul>
        </div>
        <div>
          <Heading level={2} type="display-3" className="site-footer-heading">作曲部とつながる</Heading>
          <ul>
            {contactNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} isStandalone color="primary">{item.label}</Link>
                <Text type="supporting" display="block">{item.kind}</Text>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Divider />
      <Text as="p" type="supporting" className="site-footer-copyright">
        Copyright © 2025 Gunma University Sakkyoku Club
      </Text>
    </footer>
  );
}
