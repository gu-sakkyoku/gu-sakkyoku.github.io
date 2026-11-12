import { aramaki2026 } from "../../data/aramaki2026";
import AppIcon from "../ui/AppIcon";

/**
 * トップページの最上部に出す、荒牧祭の特設ページへの案内です。
 * 学園祭が終わったら src/data/aramaki2026.ts の showOnHome を false にすると消えます。
 */
export default function FestivalNotice() {
  if (!aramaki2026.showOnHome) return null;
  return (
    <a href={aramaki2026.path} className="festival-notice">
      <span className="festival-notice-label">{aramaki2026.name}</span>
      <span className="festival-notice-text">
        <span className="inline-block">{aramaki2026.dateRangeLabel}</span>{" "}
        <span className="inline-block">作曲部の出演・物販情報</span>
      </span>
      <AppIcon name="arrowRight" color="inherit" />
    </a>
  );
}
