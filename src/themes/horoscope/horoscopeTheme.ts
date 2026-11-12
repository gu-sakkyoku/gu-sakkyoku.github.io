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
  // 指で操作する端末では、ボタン・切り替え・入力欄の高さを指で押しやすい大きさ（44px以上）にします。
  adaptations: {
    rules: [
      {
        when: {pointer: 'coarse'},
        value: {tokens: {'--size-element-sm': '44px', '--size-element-md': '44px', '--size-element-lg': '48px'}},
      },
    ],
  },
  components: {
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
