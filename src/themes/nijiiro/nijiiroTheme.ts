import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/**
 * 「虹色memory」の世界（2024年の作品・歌詞）。
 * ジャケットの青紫の枠、紫と桃色の髪、虹色の題字と白いふちを元にしています。
 * 影はぼかさず、版がずれた印刷のように色をずらして重ねます。
 * 色を変えたら `npx astryx theme build src/themes/nijiiro/nijiiroTheme.ts` を実行してください。
 */
export const nijiiroTheme = defineTheme({
  name: 'nijiiro',
  extends: neutralTheme,
  color: {accent: '#7436c9', neutralStyle: 'warm'},
  typography: {
    scale: {base: 16, ratio: 1.25},
    body: {
      family: 'var(--font-album-rounded)',
      fallbacks: '"Hiragino Maru Gothic ProN", "Yu Gothic", system-ui, sans-serif',
    },
    // 英数字は「memory」と同じ斜体、日本語は「虹色」と同じ丸く太い書体。
    heading: {
      family: 'var(--font-display-slant)',
      fallbacks: 'var(--font-display-pop), var(--font-album-rounded), sans-serif',
      weight: 'normal',
      weights: {1: 'normal', 2: 'normal', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'normal'},
    },
    code: {family: 'var(--font-display-slant)', fallbacks: 'var(--font-geist-mono), ui-monospace, monospace'},
  },
  radius: {base: 6, multiplier: 1},
  motion: {tempo: 1, character: 'standard'},
  tokens: {
    '--color-accent': '#7436c9', // 髪の紫。白文字とのコントラスト 6.7:1
    '--color-on-accent': '#ffffff',
    '--color-accent-muted': '#ece6ff',
    '--color-background-body': '#fffdf7', // 紙の白
    '--color-background-surface': '#ffffff',
    '--color-background-card': '#ffffff',
    '--color-background-popover': '#ffffff',
    '--color-background-muted': '#f1efff',
    '--color-text-primary': '#2f2438', // 上着の黒紫。紙の白で 14:1
    '--color-text-secondary': '#655872', // 紙の白で 6.5:1
    '--color-text-accent': '#6a2fbd',
    '--color-icon-primary': '#2f2438',
    '--color-icon-secondary': '#655872',
    '--color-icon-accent': '#7436c9',
    '--color-border': '#d9d3f5',
    '--color-border-emphasized': '#8a86d6', // 白地で 3.3:1
    '--color-background-pink': '#ffe3ee',
    '--color-border-pink': '#ff9cc2',
    '--color-text-pink': '#b02a6b',
    '--color-icon-pink': '#e0569a',
    '--color-background-green': '#e3fbe4', // 背景の薄い緑
    '--shadow-low': '2px 2px 0 #a9b1ff',
    '--shadow-med': '4px 4px 0 #a9b1ff',
    '--shadow-high': '7px 7px 0 #a9b1ff',
    '--focus-outline-color': '#2f2438',
    '--radius-inner': '6px',
    '--radius-element': '10px',
    '--radius-container': '14px',
    '--radius-page': '20px',
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
      // ボタンは濃い線で囲み、青紫をずらして重ねます（版ずれした印刷のように）。
      base: {
        fontWeight: 'var(--font-weight-bold)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#2f2438',
        boxShadow: '3px 3px 0 #a9b1ff',
      },
      'variant:secondary': {backgroundColor: '#ffffff', color: '#2f2438'},
    },
  },
});
