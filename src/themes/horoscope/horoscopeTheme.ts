import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/**
 * 「Horoscope」の世界（2025年の作品・歌詞）。
 * ジャケットの群青の宇宙、月の白い光、題字のシアン・マゼンタ・黄のずれを元にしています。
 * 暗いテーマ専用です。色を変えたら `npx astryx theme build src/themes/horoscope/horoscopeTheme.ts` を実行してください。
 */
export const horoscopeTheme = defineTheme({
  name: 'horoscope',
  extends: neutralTheme,
  color: {accent: ['#3b34d6', '#8ee6ff'], neutralStyle: 'cool'},
  typography: {
    scale: {base: 16, ratio: 1.25},
    body: {
      family: 'var(--font-geist-sans)',
      fallbacks: 'var(--font-album-rounded), "Hiragino Sans", "Yu Gothic", system-ui, sans-serif',
    },
    // 英数字は題字と同じ幾何学的な書体、日本語は丸ゴシックの太字。
    heading: {
      family: 'var(--font-display-orbit)',
      fallbacks: 'var(--font-album-rounded), "Hiragino Sans", sans-serif',
      weight: 'bold',
    },
    code: {family: 'var(--font-display-orbit)', fallbacks: 'var(--font-geist-mono), ui-monospace, monospace'},
  },
  // 角はほぼ直角。計器のような硬さを出します。
  radius: {base: 2, multiplier: 1},
  motion: {tempo: 1.1, character: 'crisp'},
  tokens: {
    '--color-accent': '#8ee6ff', // 題字のシアン。濃紺の文字とのコントラスト 13:1
    '--color-on-accent': '#0b0930',
    '--color-accent-muted': '#1d2a6b',
    '--color-background-body': '#0b0930',
    '--color-background-surface': '#131052',
    '--color-background-card': '#191569',
    '--color-background-popover': '#191569',
    '--color-background-muted': '#201b78',
    '--color-text-primary': '#f5f4ff', // 月の白。背景で 17:1
    '--color-text-secondary': '#c0bdf0', // 背景で 10:1
    '--color-text-accent': '#8ee6ff',
    '--color-icon-primary': '#f5f4ff',
    '--color-icon-secondary': '#c0bdf0',
    '--color-icon-accent': '#8ee6ff',
    '--color-border': '#ffffff29',
    '--color-border-emphasized': '#8f8be0',
    // 題字のマゼンタと黄。装飾と目印に使います。
    '--color-background-pink': '#3a1560',
    '--color-border-pink': '#ff6fd8',
    '--color-text-pink': '#ff9be4',
    '--color-icon-pink': '#ff6fd8',
    '--color-background-yellow': '#3a3410',
    '--color-border-yellow': '#fff07a',
    '--color-text-yellow': '#fff07a',
    '--color-icon-yellow': '#fff07a',
    '--shadow-low': '0 0 0 1px #ffffff14',
    '--shadow-med': '0 12px 32px rgb(3 2 30 / 0.55)',
    '--shadow-high': '0 24px 64px rgb(3 2 30 / 0.7)',
    '--focus-outline-color': '#fff07a',
    '--radius-inner': '2px',
    '--radius-element': '3px',
    '--radius-container': '4px',
    '--radius-page': '6px',
  },
  // 夜空の帯（MediaTheme dark）の上でも、題字のシアンと濃紺の組み合わせのままにします。
  onDark: {
    tokens: {
      '--color-accent': '#8ee6ff',
      '--color-on-accent': '#0b0930',
      '--color-text-accent': '#8ee6ff',
      '--focus-outline-color': '#fff07a',
    },
  },
  // 指で操作する端末では、ボタン・切り替え・入力欄の高さを指で押しやすい大きさ（44px以上）にします。
  adaptations: {
    rules: [
      {
        when: {pointer: 'coarse'},
        value: {tokens: {'--size-element-sm': '44px', '--size-element-md': '44px', '--size-element-lg': '48px'}},
      },
    ],
  },
  /*
   * 作品ページの部品の見た目（このテーマの中だけで使える variant / type）。
   * 名前は3作品で共通（stage・band・panel・jacket・album-title・eyebrow・track-number）で、見た目だけ作品ごとに変えます。
   */
  components: {
    section: {
      // ページ最上部の夜空。ジャケットの群青と、月の白・薄紫の光を広げます。
      'variant:stage': {
        backgroundColor: '#0b0930',
        backgroundImage:
          'radial-gradient(ellipse 55% 45% at 18% 8%, rgb(214 208 255 / 0.30), transparent 70%), radial-gradient(ellipse 70% 60% at 92% 88%, rgb(43 34 201 / 0.78), transparent 72%), radial-gradient(ellipse 45% 40% at 62% 30%, rgb(108 76 230 / 0.42), transparent 70%), linear-gradient(180deg, #171399 0%, #120e6e 46%, #0b0930 100%)',
        borderRadius: '0px',
      },
      // 区切りの帯。いちばん深い夜の色に、細い光の線を上下に引きます。
      'variant:band': {
        backgroundColor: '#0e0b3f',
        backgroundImage: 'linear-gradient(180deg, #0b0930 0%, #15106a 50%, #0b0930 100%)',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(142 230 255 / 0.22)',
        borderInlineWidth: '0px',
        borderRadius: '0px',
      },
      // 曲リストの面。夜空が透けて見える、細い枠のガラス。
      'variant:panel': {
        backgroundColor: 'rgb(25 21 105 / 0.55)',
        backdropFilter: 'blur(12px)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(255 255 255 / 0.16)',
        borderRadius: '6px',
        boxShadow: '0 24px 64px rgb(3 2 30 / 0.55)',
      },
    },
    card: {
      // ジャケットと動画の枠。月明かりの細い線と、シアンのにじみ。
      'variant:jacket': {
        backgroundColor: 'rgb(11 9 48 / 0.7)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(255 255 255 / 0.5)',
        borderRadius: '4px',
        boxShadow: '0 0 0 6px rgb(255 255 255 / 0.05), 0 24px 60px rgb(3 2 30 / 0.6)',
      },
    },
    heading: {
      // 題字：白い文字の下に黄色をずらして重ねます（シアンとマゼンタは作品のCSSで重ねます）。
      'type:album-title': {
        fontFamily: 'var(--font-display-orbit)',
        fontSize: 'clamp(2.5rem, 10vw, 6.5rem)',
        fontWeight: '700',
        lineHeight: '1.1',
        letterSpacing: '-0.01em',
        textShadow: '0 0.42em 0 #ffe95c',
      },
    },
    text: {
      // 題字と同じ書体の、シアンの小さな文字（ジャケットの題字に重なるシアンの色）。
      'type:eyebrow': {
        fontFamily: 'var(--font-display-orbit)',
        fontSize: '0.875rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        color: '#8ee6ff',
      },
      // 曲番号：星。題字と同じ版ずれ（マゼンタを右下にずらして重ねる）で、ぼかした光は使いません。
      'type:track-number': {
        display: 'inline-block',
        minWidth: '2.5ch',
        flexShrink: '0',
        color: '#8ee6ff',
        fontFamily: 'var(--font-display-orbit)',
        fontSize: '0.875rem',
        fontWeight: '700',
        letterSpacing: '0.08em',
        fontVariantNumeric: 'tabular-nums',
        textShadow: '0.09em 0.09em 0 rgb(255 95 208 / 0.8)',
      },
    },
    button: {
      base: {letterSpacing: '0.04em', fontWeight: 'var(--font-weight-bold)'},
      // 2番目のボタンは、シアンの細い線だけの枠。計器の表示のように見せます。
      'variant:secondary': {
        backgroundColor: 'transparent',
        color: '#8ee6ff',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#8ee6ff',
      },
    },
  },
});
