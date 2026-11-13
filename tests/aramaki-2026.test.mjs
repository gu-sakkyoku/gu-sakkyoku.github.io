import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { album2026 } from "../src/data/album2026.ts";
import { aramaki2026 } from "../src/data/aramaki2026.ts";
import { eventNavigation } from "../src/data/navigation.ts";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// 作曲部のポスター3枚の表記と一致していることを確認します。ポスターが更新されたら、ここも一緒に直してください。
test("野外ステージの日時・出演順・曲名をポスターのとおりに掲載する", () => {
  const stage = aramaki2026.outdoorStage;
  assert.equal(stage.date, "2026-11-14");
  assert.equal(`${stage.start}-${stage.end}`, "14:20-15:20");
  assert.deepEqual(
    stage.acts.map((act) => `${act.name}『${act.song}』`),
    [
      "弦楽隊『弦楽四重奏第二番ロ短調 大学生活』",
      "群馬を副首都にする会『群馬を副首都にするソング』",
      "ぎりぎり^^『ふりのふり』",
      "赤貝『タラレバ』",
      "例えばしめじ『🌸←桜』",
      "言うなれば緑『ほんとはね』",
    ],
  );
});

test("DJステージの場所・2日分のタイムテーブルをポスターのとおりに掲載する", () => {
  const dj = aramaki2026.djStage;
  assert.equal(dj.room, "三号館二階 GC218");
  assert.equal(aramaki2026.campus.address, "群馬県前橋市荒牧町4-2");
  const table = dj.days.map((day) => [day.date, `${day.start}-${day.end}`, day.slots.map((slot) => `${slot.start}-${slot.end} ${slot.name}`)]);
  assert.deepEqual(table, [
    ["2026-11-14", "11:30-17:30", ["11:30-12:30 Howl", "12:30-13:30 Taiyo", "13:30-14:30 37SH a.k.a. 天鴞", "14:30-15:30 体験会", "15:30-16:30 hosi", "16:30-17:30 別部"]],
    ["2026-11-15", "11:30-16:30", ["11:30-12:30 Miriha", "12:30-13:30 ムギスタジオ", "13:30-14:30 na", "14:30-15:30 astraire", "15:30-16:30 NΛЯURU"]],
  ]);
  for (const day of dj.days) {
    for (const slot of day.slots) assert.ok(slot.start < slot.end, `${day.date} ${slot.name}`);
  }
  assert.deepEqual(dj.cautions.map((caution) => caution.title), ["音量注意", "光刺激に関する注意"]);
  assert.ok(dj.cautions[0].text.includes("耳栓"));
  assert.ok(dj.cautions[1].text.includes("光過敏性発作"));
});

test("物販の価格とお得情報をポスターのとおりに掲載する", () => {
  const { merch } = aramaki2026;
  assert.deepEqual(merch.albumYears, [2024, 2025, 2026]);
  assert.deepEqual(merch.prices, [
    { item: "アルバムCD", price: "500円" },
    { item: "ダウンロードカード", price: "200円" },
  ]);
  assert.deepEqual(merch.deals, [
    { item: "DLカード3種類購入で", price: "500円" },
    { item: "CD3種類購入で", price: "1000円" },
  ]);
});

test("歌詞へのリンクは実在する歌詞ページだけを指す", async () => {
  const linked = aramaki2026.outdoorStage.acts.filter((act) => act.lyricPath);
  assert.deepEqual(linked.map((act) => act.lyricPath), ["/TansanYohou/tarareba/"]);
  const slugs = album2026.discs.flatMap((disc) => disc.tracks).flatMap((track) => (track.lyricSlug ? [track.lyricSlug] : []));
  assert.ok(slugs.includes("tarareba"));
});

test("特設ページは検索対象・サイトマップに含め、トップとメニューから入れる", async () => {
  const page = await source("src/app/aramakisai2026/page.tsx");
  assert.match(page, /world="aramaki"/);
  assert.match(page, /alternates: \{ canonical: aramaki2026\.path \}/);
  assert.doesNotMatch(page, /index: false/);
  // 出演者や価格をページへ直接書かず、データから表示します。
  assert.doesNotMatch(page, /Howl|500円|GC218/);
  await access(new URL("../src/app/aramakisai2026/page.tsx", import.meta.url));
  assert.ok((await source("public/sitemap.xml")).includes(`<loc>https://gu-sakkyoku.github.io${aramaki2026.path}</loc>`));
  assert.deepEqual(eventNavigation, aramaki2026.showOnHome ? [{ href: aramaki2026.path, label: "荒牧祭" }] : []);
  assert.match(await source("src/component/Mainpage.tsx"), /<FestivalNotice \/>/);
  assert.match(await source("src/component/aramaki/FestivalNotice.tsx"), /if \(!aramaki2026\.showOnHome\) return null;/);
});

test("「いま」の印と再生ヘッドは日本時間で判定し、画面を動かさない", async () => {
  assert.match(await source("src/lib/tokyo-now.ts"), /timeZone: "Asia\/Tokyo"/);
  const live = await source("src/component/aramaki/LiveMark.tsx");
  assert.match(live, /tokyoNow\(\)/);
  assert.match(live, /now\.date === date && now\.time >= start && now\.time < end/);
  assert.match(live, /clearInterval/);
  const playhead = await source("src/component/aramaki/DjPlayhead.tsx");
  assert.match(playhead, /tokyoNow\(\)/);
  assert.match(playhead, /now\.date === date/);
  assert.match(playhead, /clearInterval/);
  assert.match(playhead, /aria-hidden="true"/);
  for (const license of ["dela-gothic-one", "oswald", "zen-kaku-gothic-new"]) {
    assert.match(await source(`public/licenses/${license}-OFL.txt`), /SIL OPEN FONT LICENSE Version 1.1/);
  }
});

test("ポスター3枚を各区切りに掲載し、デザインした人の表記はDJステージと物販だけに付ける", async () => {
  const posters = [aramaki2026.outdoorStage.poster, aramaki2026.djStage.poster, aramaki2026.merch.poster];
  assert.deepEqual(posters.map((poster) => poster.src), [
    "/aramaki2026/poster-stage.jpg",
    "/aramaki2026/poster-dj.png",
    "/aramaki2026/poster-merch.png",
  ]);
  assert.deepEqual(posters.map((poster) => poster.credit), [undefined, "鯨の卵", "鯨の卵"]);
  const manifest = JSON.parse(await source("src/data/artwork.generated.json"));
  for (const poster of posters) {
    await access(new URL(`../public${poster.src}`, import.meta.url));
    assert.ok(manifest[poster.src], `${poster.src} の軽量版がありません`);
    assert.ok(poster.alt.length > 10);
  }
  const page = await source("src/app/aramakisai2026/page.tsx");
  assert.equal((page.match(/<PosterFigure /g) || []).length, 3);
  assert.match(await source("src/component/aramaki/PosterFigure.tsx"), /designed by \{poster\.credit\}/);
});

test("DJのタイムラインは出演枠をデータから並べ、時刻・名前を順に読めるリストにする", async () => {
  const timeline = await source("src/component/aramaki/DjTimeline.tsx");
  assert.match(timeline, /<ol className="dj-lane">/);
  assert.match(timeline, /day\.slots\.map/);
  assert.match(timeline, /<span className="sr-only">から<\/span>/);
  assert.match(timeline, /<LiveMark /);
  // 位置はデータから計算します。ページにも部品にも、出演者名や時刻を直接書きません。
  assert.doesNotMatch(timeline, /Howl|NΛЯURU|11:30/);
  const css = await source("src/app/worlds/aramaki.css");
  assert.match(css, /grid-column: calc\(var\(--start\) \+ 1\) \/ span var\(--span\)/);
  assert.match(css, /grid-row: calc\(var\(--start\) \+ 1\) \/ span var\(--span\)/);
});
