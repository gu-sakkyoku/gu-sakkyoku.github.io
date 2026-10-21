import type { AlbumEvent } from "../data/album2026";

/** トップと作品ページで出展場所・価格の書き違いが起きないよう、同じ表示を使います。 */
export default function AlbumEventNotice({ event, headingLevel = 2 }: { event: AlbumEvent; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <section aria-label={`${event.name} 出展情報`} className="album-event-notice mx-auto mt-6 max-w-xl font-serif text-base leading-8 sm:text-lg">
      {/* イベント名と「出展情報」をそれぞれまとまりにし、末尾1文字だけの改行を防ぎます。 */}
      <Heading className="text-balance text-xl font-semibold text-blue-900 dark:text-blue-300">
        <span className="inline-block">{event.name}</span>{" "}<span className="inline-block">出展情報</span>
      </Heading>
      <p className="mt-2"><time dateTime={event.date}>{event.dateLabel}</time><br />{event.venue}</p>
      <p className="mt-2 text-balance text-xl font-semibold">{event.space}</p>
      <p>頒布価格：{event.price}</p>
      <a href={event.url} className="site-text-link mt-1 inline-flex min-h-11 items-center rounded">M3公式サイト</a>
    </section>
  );
}
