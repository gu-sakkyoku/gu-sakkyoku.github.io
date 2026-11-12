import type { Metadata } from "next";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import AlbumMotion from "../../component/AlbumMotion";
import ClientWrapper from "../../component/ClientWrapper";
import LiveMark from "../../component/aramaki/LiveMark";
import AppIcon from "../../component/ui/AppIcon";
import Artwork from "../../component/ui/Artwork";
import { albums } from "../../data/albums";
import { aramaki2026 } from "../../data/aramaki2026";

const { outdoorStage, djStage, merch, campus } = aramaki2026;
const title = `${aramaki2026.name}${aramaki2026.year} | 群馬大学作曲部`;
const description = `群馬大学作曲部の${aramaki2026.name}${aramaki2026.year}（${aramaki2026.dateRangeLabel}）の出演・物販情報。${outdoorStage.name}と、${djStage.room}の${djStage.name}のタイムテーブル、アルバムCD・ダウンロードカードの販売のご案内です。`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: aramaki2026.path },
  openGraph: { title, description, url: aramaki2026.path },
  twitter: { title, description },
};

const merchAlbums = merch.albumYears.map((year) => albums.find((album) => album.year === year)!).filter(Boolean);
// 地図は住所で検索するリンクにします（地図の埋め込みや外部の読み込みはしません）。
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${campus.name} ${campus.address}`)}`;

/**
 * 荒牧祭（群馬大学の学園祭）の特設ページです。内容はすべて src/data/aramaki2026.ts から表示します。
 * 見た目は作曲部のポスターに合わせ、DJステージ・物販は群青と黄色、野外ステージは水彩の空色にしています。
 */
export default function AramakiPage() {
  return (
    <ClientWrapper world="aramaki" className="aramaki-main">
      <AlbumMotion>
        <section className="aramaki-hero" aria-labelledby="aramaki-title" data-depth>
          <div className="aramaki-hero-deco" aria-hidden="true">
            <span className="aramaki-star aramaki-star--1" />
            <span className="aramaki-star aramaki-star--2" />
            <span className="aramaki-star aramaki-star--3" />
            <span className="aramaki-grid" />
          </div>
          <div className="site-container aramaki-hero-inner">
            <p className="aramaki-kicker">群馬大学作曲部</p>
            <h1 id="aramaki-title" className="aramaki-title">
              <span>{aramaki2026.name}</span>
              <span className="aramaki-title-year">{aramaki2026.year}</span>
            </h1>
            <p className="aramaki-dates">{aramaki2026.dateRangeLabel}</p>
            <p className="aramaki-campus">{campus.name}</p>
            <HStack as="nav" aria-label="このページの案内" gap={3} wrap="wrap" className="aramaki-hero-actions">
              <Button label="野外ステージ" href="#outdoor-stage" variant="primary" size="lg" endContent={<AppIcon name="arrowRight" />} />
              <Button label="DJステージ" href="#dj-stage" variant="primary" size="lg" endContent={<AppIcon name="arrowRight" />} />
              <Button label="物販" href="#merch" variant="secondary" size="lg" endContent={<AppIcon name="arrowRight" />} />
            </HStack>
          </div>
        </section>

        {/* いつ・どこで、を最初に一覧できるようにします。 */}
        <section aria-labelledby="aramaki-summary" className="site-container site-section">
          <Heading level={2} id="aramaki-summary" className="aramaki-label">日程と場所</Heading>
          <Grid columns={{ minWidth: 260, max: 3 }} gap={4}>
            <Card padding={5} elevation="low" data-reveal>
              <VStack gap={2}>
                <Text type="supporting">{outdoorStage.name}</Text>
                <Text as="p" weight="bold" size="lg">11/14（土） {outdoorStage.start}–{outdoorStage.end}</Text>
                <Link href="#outdoor-stage" isStandalone hasUnderline>タイムテーブル</Link>
              </VStack>
            </Card>
            <Card padding={5} elevation="low" data-reveal>
              <VStack gap={2}>
                <Text type="supporting">{djStage.name}（{djStage.room}）</Text>
                {djStage.days.map((day) => (
                  <Text as="p" weight="bold" size="lg" key={day.date}>
                    {day.date === "2026-11-14" ? "11/14（土）" : "11/15（日）"} {day.start}–{day.end}
                  </Text>
                ))}
                <Link href="#dj-stage" isStandalone hasUnderline>タイムテーブル</Link>
              </VStack>
            </Card>
            <Card padding={5} elevation="low" data-reveal>
              <VStack gap={2}>
                <Text type="supporting">物販（DJステージの会場で販売）</Text>
                {merch.prices.map((price) => (
                  <Text as="p" weight="bold" size="lg" key={price.item}>{price.item} {price.price}</Text>
                ))}
                <Link href="#merch" isStandalone hasUnderline>お得情報</Link>
              </VStack>
            </Card>
          </Grid>
        </section>

        <section aria-labelledby="outdoor-stage" className="aramaki-outdoor site-section">
          <div className="site-container">
            <VStack gap={2} className="aramaki-outdoor-heading" data-reveal>
              <Heading level={2} id="outdoor-stage">{outdoorStage.name}</Heading>
              <HStack gap={3} vAlign="center" wrap="wrap">
                <p className="aramaki-time">
                  {outdoorStage.dateLabel} {outdoorStage.start}-{outdoorStage.end}
                </p>
                <LiveMark date={outdoorStage.date} start={outdoorStage.start} end={outdoorStage.end} />
              </HStack>
            </VStack>
            <Card padding={6} elevation="none" className="aramaki-outdoor-card" data-reveal>
              <VStack gap={4}>
                <Text as="p" weight="bold">タイムテーブル（出演順）</Text>
                <ol className="aramaki-acts">
                  {outdoorStage.acts.map((act, index) => (
                    <li key={act.name}>
                      <span className="aramaki-act-number" aria-hidden="true">{index + 1}</span>
                      <span className="aramaki-act-copy">
                        <Text weight="bold" display="block" size="lg">{act.name}</Text>
                        <Text display="block">『{act.song}』</Text>
                        {act.lyricPath && (
                          <Link href={act.lyricPath} hasUnderline weight="bold">「{act.song}」の歌詞はこちら</Link>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </VStack>
            </Card>
          </div>
        </section>

        <section aria-labelledby="dj-stage" className="site-container site-section">
          <VStack gap={2} className="aramaki-dj-heading" data-reveal>
            <p className="aramaki-caution-strip" aria-hidden="true">CAUTION ⚠ SOUND PRESSURE WARNING</p>
            <Heading level={2} id="dj-stage">{djStage.name}</Heading>
            <Text as="p" weight="bold" size="lg">{campus.name} {djStage.room}</Text>
            <Text as="p">会場では、作曲部のアルバムも販売しています。</Text>
          </VStack>

          <Grid columns={{ minWidth: 300, max: 2 }} gap={6} className="aramaki-days">
            {djStage.days.map((day) => (
              <section key={day.date} aria-labelledby={`dj-${day.date}`} className="aramaki-day" data-reveal>
                <div className="aramaki-day-heading">
                  <h3 id={`dj-${day.date}`}>{day.label}</h3>
                  <p className="aramaki-time">{day.dateLabel} {day.start} - {day.end}</p>
                </div>
                <ol className="aramaki-slots">
                  {day.slots.map((slot) => (
                    <li key={`${slot.start}-${slot.name}`}>
                      <span className="aramaki-slot-time">
                        <time dateTime={`${day.date}T${slot.start}+09:00`}>{slot.start}</time>
                        <span aria-hidden="true"> - </span>
                        <span className="sr-only">から</span>
                        <time dateTime={`${day.date}T${slot.end}+09:00`}>{slot.end}</time>
                      </span>
                      <span className="aramaki-slot-name">{slot.name}</span>
                      <LiveMark date={day.date} start={slot.start} end={slot.end} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </Grid>

          <VStack gap={3} className="aramaki-cautions">
            {djStage.cautions.map((caution) => (
              <Banner key={caution.title} status="warning" title={caution.title} description={caution.text} collapsible={false} />
            ))}
          </VStack>
        </section>

        <section aria-labelledby="merch" className="site-container site-section">
          <VStack gap={2} data-reveal>
            <Heading level={2} id="merch">物販</Heading>
            <Text as="p">{djStage.name}の会場（{djStage.room}）で販売しています。</Text>
          </VStack>
          <Card padding={6} elevation="med" className="aramaki-merch" data-reveal>
            <VStack gap={6}>
              <ul className="aramaki-merch-albums">
                {merchAlbums.map((album) => (
                  <li key={album.year}>
                    {album.artwork && (
                      <Artwork src={album.artwork} alt={`${album.title}のアルバムジャケット`} sizes="(max-width: 640px) 28vw, 180px" />
                    )}
                    <Text type="supporting" display="block">{album.year}年度</Text>
                    {album.detailPath ? (
                      <Link href={album.detailPath} hasUnderline weight="bold">{album.title}</Link>
                    ) : (
                      <Text weight="bold">{album.title}</Text>
                    )}
                  </li>
                ))}
              </ul>
              <dl className="aramaki-prices">
                {merch.prices.map((price) => (
                  <div key={price.item}>
                    <dt>{price.item}</dt>
                    <dd>{price.price}</dd>
                  </div>
                ))}
              </dl>
              <div className="aramaki-deals">
                <p className="aramaki-deals-label">お得情報</p>
                <dl>
                  {merch.deals.map((deal) => (
                    <div key={deal.item}>
                      <dt>{deal.item}</dt>
                      <dd>{deal.price}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <Text as="p" type="supporting">
                ダウンロードカードは、カードに印刷されたコードで
                <Link href="/download/" hasUnderline>ダウンロードページ</Link>
                から音源を受け取れます。
              </Text>
            </VStack>
          </Card>
        </section>

        <section aria-labelledby="access" className="site-container site-section">
          <VStack gap={3} hAlign="start" data-reveal>
            <Heading level={2} id="access">会場</Heading>
            <Text as="p" weight="bold" size="lg">{campus.name}</Text>
            <Text as="p">{campus.address}</Text>
            <Text as="p">DJステージ・物販：{djStage.room}</Text>
            <Link href={mapUrl} isExternalLink isStandalone hasUnderline>地図で場所を見る</Link>
          </VStack>
        </section>
      </AlbumMotion>
    </ClientWrapper>
  );
}
