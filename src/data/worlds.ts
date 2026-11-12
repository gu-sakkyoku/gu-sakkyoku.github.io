/**
 * 年度ごとの「世界」（Astryxのテーマ名）です。
 * 新しい年度を追加するときは、src/themes/ にテーマを作ってから、ここへ1行足します。
 * 未登録の年度は、最新作と同じ炭酸予報のテーマで表示されます。
 */
export type WorldSlug = "tansan" | "horoscope" | "nijiiro";

const worldByYear: Record<number, WorldSlug> = {
  2026: "tansan",
  2025: "horoscope",
  2024: "nijiiro",
};

export function worldOfYear(year: number): WorldSlug {
  return worldByYear[year] ?? "tansan";
}
