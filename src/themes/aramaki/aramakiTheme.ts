import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/**
 * 荒牧祭の世界（2026年 荒牧祭の特設ページ）。
 * 作曲部のDJステージ・物販のポスターを元にしています：白い紙に鮮やかな群青、注意ラベルの黄色、
 * 群青の帯の上に白い縁取りの太い文字を重ねた見出し、方眼の線、四方に伸びる星。
 * 色を変えたら `npx astryx theme build src/themes/aramaki/aramakiTheme.ts` を実行してください。
 */
export const aramakiTheme = defineTheme({
  name: 'aramaki',
  extends: neutralTheme,
  color: {accent: '#1d14d4', neutralStyle: 'cool'},
  typography: {
    scale: {base: 16, ratio: 1.25},
    body: {
      family: 'var(--font-body-kaku)',
      fallbacks: '"Hiragino Sans", "Yu Gothic", system-ui, sans-serif',
    },
    heading: {
      family: 'var(--font-display-block)',
      fallbacks: 'var(--font-body-kaku), "Hiragino Sans", sans-serif',
      weight: 'normal',
      weights: {1: 'normal', 2: 'normal', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'normal'},
    },
    code: {family: 'var(--font-display-condensed)', fallbacks: 'var(--font-geist-mono), ui-monospace, monospace'},
  },
  motion: {tempo: 0.9, character: 'crisp'},
  tokens: {
    '--color-accent': '#1d14d4', // ポスターの群青。白文字とのコントラスト 10:1
    '--color-on-accent': '#ffffff',
    '--color-accent-muted': '#e6e5ff',
    '--color-background-body': '#ffffff',
    '--color-background-surface': '#ffffff',
    '--color-background-card': '#f6f6f8', // 物販ポスターの薄い灰色のカード
    '--color-background-popover': '#ffffff',
    '--color-background-muted': '#eeeef6',
    '--color-text-primary': '#0d0b2b', // 白地で 18:1
    '--color-text-secondary': '#46456a', // 白地で 9:1
    '--color-text-accent': '#1d14d4',
    '--color-icon-primary': '#0d0b2b',
    '--color-icon-secondary': '#46456a',
    '--color-icon-accent': '#1d14d4',
    '--color-border': '#c9c7f2',
    '--color-border-emphasized': '#1d14d4',
    // 注意ラベルの黄色。黒い文字と組み合わせます（コントラスト 17:1）。
    '--color-background-yellow': '#ffe600',
    '--color-border-yellow': '#0d0b2b',
    '--color-text-yellow': '#0d0b2b',
    '--color-icon-yellow': '#0d0b2b',
    '--color-warning': '#ffe600',
    '--color-on-warning': '#0d0b2b',
    '--color-warning-muted': '#fff6a8',
    '--color-on-warning-muted': '#0d0b2b',
    '--shadow-low': '3px 3px 0 #1d14d4',
    '--shadow-med': '6px 6px 0 #1d14d4',
    '--shadow-high': '10px 10px 0 #1d14d4',
    '--focus-outline-color': '#0d0b2b',
    '--radius-inner': '4px',
    '--radius-element': '6px',
    '--radius-container': '16px',
    '--radius-page': '28px',
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
      base: {
        fontWeight: 'var(--font-weight-bold)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#0d0b2b',
        boxShadow: '3px 3px 0 #0d0b2b',
      },
      'variant:secondary': {backgroundColor: '#ffe600', color: '#0d0b2b'},
    },
  },
});
