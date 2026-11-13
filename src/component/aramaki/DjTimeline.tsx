import type { CSSProperties } from "react";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import type { DjDay } from "../../data/aramaki2026";
import DjPlayhead from "./DjPlayhead";
import LiveMark from "./LiveMark";

const toMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};
const toClock = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
const UNIT = 30; // 目盛り1つ＝30分

/**
 * DJステージのタイムテーブルを、作曲ソフト（DAW）の編集画面のように描きます。
 * 1日を1本のトラックにし、出演枠は時間の長さに比例した「クリップ」として並べます。
 * PC幅では時間が横に流れ、スマホでは2日分のトラックを縦に並べた時間割になります（作品のCSS）。
 *
 * 中身はふつうの順序付きリスト（ol）で、読み上げでは「開始時刻から終了時刻、出演者名」の順に読めます。
 * 位置はデータから計算した値（--start・--span）をCSSに渡して決めます。時刻・名前はポスターの表記のままです。
 * 当日は、日本時間の現在時刻に赤い再生ヘッドが立ちます（DjPlayhead）。
 */
export default function DjTimeline({ days }: { days: DjDay[] }) {
  const rulerStart = Math.min(...days.map((day) => toMinutes(day.start)));
  const rulerEnd = Math.max(...days.map((day) => toMinutes(day.end)));
  const units = Math.ceil((rulerEnd - rulerStart) / UNIT);
  // 目盛りの数字は1時間ごと（ポスターの枠の区切りと同じ「〜:30」）。最後の時刻は右端（スマホでは下端）に置きます。
  const marks = Array.from({ length: Math.floor(units / 2) + 1 }, (_, index) => toClock(rulerStart + index * 60));

  return (
    <VStack gap={0} className="dj-daw" style={{ "--units": units } as CSSProperties}>
      <ol className="dj-ruler" aria-hidden="true">
        {marks.map((mark, index) => (
          <li key={mark} style={{ "--at": index * 2 } as CSSProperties} data-last={index === marks.length - 1 || undefined}>
            {mark}
          </li>
        ))}
      </ol>
      {days.map((day, dayIndex) => (
        <section key={day.date} aria-labelledby={`dj-${day.date}`} className="dj-track" data-track={dayIndex + 1}>
          <VStack gap={1} className="dj-track-head">
            <Heading level={3} id={`dj-${day.date}`} className="dj-track-name">{day.label}</Heading>
            <Text type="time" className="dj-track-date">{day.dateLabel}</Text>
            <Text type="time" className="dj-track-date">{day.start} - {day.end}</Text>
          </VStack>
          <ol className="dj-lane">
            {day.slots.map((slot, slotIndex) => (
              <li
                key={`${slot.start}-${slot.name}`}
                className="dj-clip"
                data-tone={slotIndex % 3}
                style={
                  {
                    "--start": (toMinutes(slot.start) - rulerStart) / UNIT,
                    "--span": (toMinutes(slot.end) - toMinutes(slot.start)) / UNIT,
                  } as CSSProperties
                }
              >
                <Text type="time" className="dj-clip-time">
                  <time dateTime={`${day.date}T${slot.start}+09:00`}>{slot.start}</time>
                  <span aria-hidden="true"> - </span>
                  <span className="sr-only">から</span>
                  <time dateTime={`${day.date}T${slot.end}+09:00`}>{slot.end}</time>
                </Text>
                <Text weight="bold" className="dj-clip-name">{slot.name}</Text>
                <LiveMark date={day.date} start={slot.start} end={slot.end} />
              </li>
            ))}
          </ol>
          <DjPlayhead date={day.date} start={toClock(rulerStart)} end={toClock(rulerEnd)} />
        </section>
      ))}
    </VStack>
  );
}
