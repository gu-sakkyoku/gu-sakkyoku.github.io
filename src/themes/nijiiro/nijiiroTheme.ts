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
  /*
   * 作品ページの部品の見た目（このテーマの中だけで使える variant / type）。
   * 名前は3作品で共通（stage・band・panel・jacket・album-title・eyebrow・track-number）で、見た目だけ作品ごとに変えます。
   */
  components: {
    section: {
      // ページ最上部。ジャケットと同じ青紫の地に、薄い緑と桃色の色面を斜めに重ねます。
      'variant:stage': {
        backgroundColor: '#a9b1ff',
        backgroundImage:
          'linear-gradient(115deg, transparent 0 62%, #dffbe0 62% 100%), linear-gradient(200deg, #ffc9dd 0 30%, transparent 30% 100%)',
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#2f2438',
        borderRadius: '0px',
      },
      // 区切りの帯。青紫の地に細い方眼（ノートの紙）。
      'variant:band': {
        backgroundColor: '#eceaff',
        backgroundImage:
          'linear-gradient(rgb(143 140 255 / 0.18) 1px, transparent 1px), linear-gradient(90deg, rgb(143 140 255 / 0.18) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        borderBlockWidth: '3px',
        borderBlockStyle: 'solid',
        borderBlockColor: '#2f2438',
        borderRadius: '0px',
      },
      // 曲リストの面。濃い線で囲み、青紫をずらして重ねます（版ずれした印刷）。
      'variant:panel': {
        backgroundColor: '#ffffff',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: '#2f2438',
        borderRadius: '14px',
        boxShadow: '8px 8px 0 #a9b1ff',
      },
    },
    card: {
      // ジャケットと動画の枠。白いふちと濃い線、ぼかさない影。
      'variant:jacket': {
        backgroundColor: '#ffffff',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: '#2f2438',
        borderRadius: '4px',
        boxShadow: '12px 12px 0 #2f2438',
      },
    },
    heading: {
      // 題字：ジャケットと同じ虹色のグラデーション。白いふちを付け、濃い紫をずらして重ねます。
      'type:album-title': {
        // 欧文（memory）は斜体の書体、和文（虹色）はその書体にない文字なので丸く太い書体で表示されます。
        fontFamily: 'var(--font-display-slant), var(--font-display-pop)',
        fontSize: 'clamp(4rem, 17vw, 10rem)',
        lineHeight: '1.05',
        letterSpacing: '0.02em',
        backgroundImage: 'linear-gradient(95deg, #ff5fa2 0%, #12b3a0 22%, #8a4dff 45%, #2f8fff 64%, #ffa81f 84%, #ff5fa2 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter:
          'drop-shadow(0.02em 0 0 #ffffff) drop-shadow(-0.02em 0 0 #ffffff) drop-shadow(0 0.02em 0 #ffffff) drop-shadow(0 -0.02em 0 #ffffff) drop-shadow(0.055em 0.055em 0 #2f2438)',
      },
    },
    text: {
      // 白い紙に濃い線で囲んだ、貼り付けたラベルのような小さな文字。
      'type:eyebrow': {
        display: 'inline-block',
        paddingBlock: '0.25rem',
        paddingInline: '0.75rem',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#2f2438',
        backgroundColor: '#ffffff',
        color: '#2f2438',
        boxShadow: '3px 3px 0 #2f2438',
        fontFamily: 'var(--font-display-slant)',
        fontSize: '0.875rem',
        letterSpacing: '0.04em',
      },
      // 曲番号：「memory」と同じ斜体の数字。色は曲ごとに虹の七色を順番に（作品のCSSで指定）。
      'type:track-number': {
        display: 'inline-block',
        minWidth: '2.25ch',
        flexShrink: '0',
        fontFamily: 'var(--font-display-slant)',
        fontSize: '1.75rem',
        lineHeight: '1',
        fontVariantNumeric: 'tabular-nums',
        color: '#2f2438',
      },
    },
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
