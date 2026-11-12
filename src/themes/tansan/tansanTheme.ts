import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

/**
 * 「炭酸予報」の世界（トップ・2026年の作品／歌詞・ダウンロード）。
 * ジャケットの夏空の青、雲とふちの白、題字の桃色・薄紫を元にしています。
 * 色を変えたら `npx astryx theme build src/themes/tansan/tansanTheme.ts` を実行してください。
 * 文字と背景の組み合わせは、コントラスト比4.5:1以上（WCAG AA）を保っています。
 */
export const tansanTheme = defineTheme({
  name: 'tansan',
  extends: neutralTheme,
  // 青を基準に、ホバー時の重なり色などの細かい色を自動生成します。主要な色は下のtokensで指定します。
  color: {accent: '#0f6fc6', neutralStyle: 'cool'},
  typography: {
    scale: {base: 16, ratio: 1.25},
    body: {
      family: 'var(--font-album-rounded)',
      fallbacks: '"Hiragino Maru Gothic ProN", "Yu Gothic", system-ui, sans-serif',
    },
    // 題字と同じ丸く太い書体。太さは1種類だけなので、ブラウザーに太字を合成させません。
    heading: {
      family: 'var(--font-display-pop)',
      fallbacks: 'var(--font-album-rounded), "Hiragino Maru Gothic ProN", sans-serif',
      weight: 'normal',
      weights: {1: 'normal', 2: 'normal', 3: 'normal', 4: 'normal', 5: 'normal', 6: 'normal'},
    },
    code: {family: 'var(--font-geist-mono)', fallbacks: 'ui-monospace, monospace'},
  },
  // 泡のように丸く。ボタンは完全な丸（下のcomponents）。
  radius: {base: 8, multiplier: 1.5},
  // はずむ動き。OSで「視差効果を減らす」を選んだ人には、Astryxが自動で動きを抑えます。
  motion: {tempo: 1, character: 'expressive'},
  tokens: {
    '--color-accent': '#0f6fc6', // 白文字とのコントラスト 5.1:1
    '--color-on-accent': '#ffffff',
    '--color-accent-muted': '#dcedfb',
    '--color-background-body': '#eef7ff',
    '--color-background-surface': '#ffffff',
    '--color-background-card': '#ffffff',
    '--color-background-popover': '#ffffff',
    '--color-background-muted': '#e3f1fd',
    '--color-text-primary': '#22304a', // 髪の紺色。白地で 12.9:1
    '--color-text-secondary': '#4f6079', // 白地で 6.4:1
    '--color-text-accent': '#0b62b3',
    '--color-icon-primary': '#22304a',
    '--color-icon-secondary': '#4f6079',
    '--color-icon-accent': '#0f6fc6',
    '--color-border': '#c5dff3',
    '--color-border-emphasized': '#5a93c4', // 白地で 3.3:1
    // 題字の桃色・薄紫。装飾と「歌詞あり」などの目印に使います。
    '--color-background-pink': '#ffe6f1',
    '--color-border-pink': '#f5a9cb',
    '--color-text-pink': '#a82f68',
    '--color-icon-pink': '#d9558f',
    '--color-background-purple': '#ece8ff',
    '--color-border-purple': '#b7a8f5',
    '--color-text-purple': '#5a45b0',
    '--color-icon-purple': '#7a66d6',
    '--shadow-low': '0 1px 2px rgb(31 86 140 / 0.12)',
    '--shadow-med': '0 8px 24px rgb(31 86 140 / 0.16)',
    '--shadow-high': '0 20px 48px rgb(31 86 140 / 0.22)',
    '--focus-outline-color': '#0b62b3',
    // 丸みは「泡」らしく大きめに。大きな枠ほど丸くします。
    '--radius-inner': '8px',
    '--radius-element': '14px',
    '--radius-container': '20px',
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
      base: {borderRadius: 'var(--radius-full)', fontWeight: 'var(--font-weight-bold)'},
      // 2番目のボタンは、白地に青いふち。空の上でも白いカードの上でも見分けられます。
      'variant:secondary': {
        backgroundColor: '#ffffff',
        color: '#0b62b3',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: '#5a93c4',
      },
    },
  },
});
