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
  // 群青の帯（MediaTheme dark）の上では、主ボタンを注意ラベルの黄色にします。
  onDark: {
    tokens: {
      '--color-accent': '#ffe600',
      '--color-on-accent': '#0d0b2b',
      '--color-text-accent': '#ffe600',
      '--focus-outline-color': '#ffe600',
    },
  },
  /*
   * 特設ページの部品の見た目（このテーマの中だけで使える variant / type）。すべてポスターの実物から取っています。
   */
  components: {
    section: {
      // ポスターの紙。白より少しだけ灰色がかった地。
      'variant:stage': {
        backgroundColor: '#f4f4f6',
        borderRadius: '0px',
      },
      // 群青の帯（DJステージのポスターの右の列、注意書きの地）。
      'variant:band': {
        backgroundColor: '#1d14d4',
        borderRadius: '0px',
      },
      // 白い紙に濃い線、群青をずらして重ねた面（物販ポスターのカード）。
      'variant:panel': {
        backgroundColor: '#ffffff',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#0d0b2b',
        borderRadius: '6px',
        boxShadow: '6px 6px 0 #1d14d4',
      },
      // 野外ステージのポスターの、淡い水色の水彩。
      'variant:sky': {
        backgroundColor: '#e3f3fd',
        backgroundImage:
          'radial-gradient(ellipse 50% 40% at 15% 20%, rgb(159 211 243 / 0.75), transparent 70%), radial-gradient(ellipse 45% 50% at 85% 75%, rgb(120 190 238 / 0.55), transparent 72%), radial-gradient(ellipse 35% 30% at 60% 10%, rgb(255 255 255 / 0.8), transparent 70%)',
        borderRadius: '0px',
      },
    },
    heading: {
      // 題字：黒い太字に白い縁取り、後ろに明るい群青の帯（ポスターの題字と同じ作り）。
      'type:festival-title': {
        display: 'block',
        width: 'fit-content',
        maxWidth: '100%',
        paddingInline: '0.08em',
        fontSize: 'clamp(4.5rem, 21vw, 12rem)',
        lineHeight: '1.08',
        // 群青の帯（白い文字の面）の上に置いても黒い文字のままにします。
        WebkitTextFillColor: '#0d0b2b',
        backgroundImage: 'linear-gradient(transparent 16%, #4e46ff 16% 84%, transparent 84%)',
        WebkitTextStroke: '0.035em #ffffff',
        paintOrder: 'stroke fill',
        textShadow: '0.05em 0.05em 0 #ffffff',
      },
      // 区切りの見出し：題字と同じ作りを小さく。
      'type:poster-heading': {
        display: 'block',
        width: 'fit-content',
        maxWidth: '100%',
        paddingInline: '0.1em',
        fontSize: 'clamp(2.25rem, 7vw, 3.75rem)',
        lineHeight: '1.15',
        // 群青の帯（白い文字の面）の上に置いても黒い文字のままにします。
        WebkitTextFillColor: '#0d0b2b',
        backgroundImage: 'linear-gradient(transparent 22%, #c9c7f2 22% 86%, transparent 86%)',
        WebkitTextStroke: '0.04em #ffffff',
        paintOrder: 'stroke fill',
      },
    },
    text: {
      // 注意ラベルの黄色い札。
      'type:eyebrow': {
        display: 'inline-block',
        paddingBlock: '0.2rem',
        paddingInline: '0.75rem',
        backgroundColor: '#ffe600',
        color: '#0d0b2b',
        fontFamily: 'var(--font-display-block)',
        fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
        letterSpacing: '0.04em',
      },
      // 時刻・日付：ポスターのタイムテーブルと同じ縦長の書体。
      'type:time': {
        fontFamily: 'var(--font-display-condensed)',
        fontWeight: '700',
        letterSpacing: '0.04em',
        fontVariantNumeric: 'tabular-nums',
      },
      // 出演順の番号：縦長の太い数字。
      'type:track-number': {
        display: 'inline-block',
        minWidth: '1.5ch',
        flexShrink: '0',
        color: '#1d14d4',
        fontFamily: 'var(--font-display-condensed)',
        fontSize: '2.5rem',
        fontWeight: '700',
        lineHeight: '1',
      },
    },
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
