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
  // 濃い空の帯（MediaTheme dark）の上では、主ボタンを白い泡に、文字を空の濃い青にします。
  onDark: {
    tokens: {
      '--color-accent': '#ffffff',
      '--color-on-accent': '#0b4f94',
      '--color-text-accent': '#ffffff',
      '--focus-outline-color': '#ffffff',
    },
    components: {
      button: {
        'variant:secondary': {backgroundColor: 'transparent', color: '#ffffff', borderColor: 'rgb(255 255 255 / 0.75)'},
      },
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
   * 3作品で同じ名前（stage・band・panel・jacket・album-title・eyebrow・track-number）を使い、
   * 中身の見た目だけを作品ごとに変えます。ページ側は同じ部品の組み合わせのまま、世界観が切り替わります。
   */
  components: {
    section: {
      // ページ最上部の空。ジャケットと同じ、上が濃く下へ白くほどける夏空です。
      'variant:stage': {
        backgroundColor: '#4fa6ee',
        backgroundImage:
          'radial-gradient(ellipse 60% 40% at 50% 0%, rgb(255 255 255 / 0.28), transparent 70%), linear-gradient(180deg, #1568c0 0%, #2a7fd6 28%, #4fa6ee 52%, #a9d9fb 80%, #eef7ff 100%)',
        borderRadius: '0px',
      },
      // 区切りの帯。空のいちばん濃い青。上に白い文字を置きます（MediaTheme dark と組み合わせます）。
      'variant:band': {
        backgroundColor: '#1568c0',
        backgroundImage: 'linear-gradient(165deg, #0f5aad 0%, #1a73cf 50%, #3f98e6 100%)',
        borderRadius: '0px',
      },
      // 曲リストなどをまとめる白い面。泡のように大きく丸めます。
      'variant:panel': {
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-page)',
        boxShadow: 'var(--shadow-med)',
      },
    },
    card: {
      // ジャケットと動画の枠。実物と同じ白いふちのインスタント写真。
      'variant:jacket': {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 32px 64px rgb(15 60 120 / 0.30), 0 6px 14px rgb(15 60 120 / 0.14)',
      },
    },
    heading: {
      // 題字：ジャケットと同じ丸く太い書体に、淡い桃色・薄紫・水色のグラデーションと薄紫のずれた影。
      'type:album-title': {
        fontSize: 'clamp(4rem, 16vw, 10.5rem)',
        lineHeight: '1.02',
        letterSpacing: '0.02em',
        backgroundImage: 'linear-gradient(165deg, #fffbe2 8%, #ffd0e2 46%, #e4dcff 74%, #c9f0ff 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0.045em 0.05em 0 #5953b6)',
      },
    },
    text: {
      // 題字に添える作品情報。本文と同じ丸い書体を、少しだけ字間を空けて太く。
      'type:eyebrow': {
        fontSize: '1rem',
        fontWeight: 'var(--font-weight-bold)',
        letterSpacing: '0.06em',
        lineHeight: '1.6',
      },
      // 曲番号：泡の玉。
      'type:track-number': {
        display: 'inline-grid',
        placeItems: 'center',
        width: '2.5rem',
        height: '2.5rem',
        flexShrink: '0',
        borderRadius: '50%',
        backgroundImage: 'radial-gradient(circle at 32% 28%, #ffffff 0 18%, #cfe9ff 42%, #8cc8f6 100%)',
        boxShadow: 'inset 0 0 0 1.5px #ffffff, 0 4px 10px rgb(31 86 140 / 0.18)',
        color: '#0b4f94',
        fontFamily: 'var(--font-display-pop)',
        fontSize: '0.875rem',
        fontVariantNumeric: 'tabular-nums',
      },
    },
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
