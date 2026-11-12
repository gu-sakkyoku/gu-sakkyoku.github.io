# AGENTS

Project-specific guidance for AI coding agents.

## このサイトでのAstryxの扱い（下のASTRYXブロックより優先）

- サイト全体をAstryx Design Systemで作っています。設計の全体像は`docs/DESIGN.md`を読んでください。
- 作品ごとに「世界」があります：`tansan`（2026・トップ・ダウンロード）、`horoscope`（2025）、`nijiiro`（2024）、`aramaki`（荒牧祭の特設ページ）。ページは`ClientWrapper`の`world`で世界を選びます。年度と世界の対応は`src/data/worlds.ts`です。
- 色・書体・角の丸さは`src/themes/<世界>/<世界>Theme.ts`。直したら`npx astryx theme build`で作り直します。生成された`.css`・`.js`・`.d.ts`は手で編集しません。
- ジャケット由来の絵・題字・動きは`src/app/worlds/<世界>.css`に置き、セレクターは必ず`.site-world--<世界>`から始めます（テストで確認しています）。下のブロックの「CSSファイルをimportしない」は、この作品の飾りには当てはめません。
- 作品の世界観を共通のテンプレート的な見た目にそろえないでください。ジャケットの実物を根拠にします。頼まれていない宣伝文句や、飾りの番号（「01 クロスフェード」など）は足しません。
- 歌詞本文・改行・曲順・作者表記・URLは変更しません（テストで確認しています）。動きは一度きりで、OSの「動きを減らす」設定を必ず尊重します。

ASTRYXブロックは`npx astryx init --agent-docs-path AGENTS.md`が管理します。ブロックの中は手で編集しないでください。

<!-- ASTRYX:START -->
Astryx v0.7.11 · 174 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — start every page from a template, never from scratch:
1. `astryx build "<idea>"` — names the template to scaffold from and the parts it lacks.
2. `astryx template <name> <path>` — scaffold it; keep its frame, gap and padding; replace the content.
3. `astryx template <Block>` for parts it lacks; `astryx component <Name>` to read props before using one.
Changing an existing page? Keep it: skip step 2 and add blocks/components inside its sections.
Before you deliver a build, run `astryx doctor --built <dir>`; don't deliver it if it fails.

RULES:
- No <div> — components handle all layout and spacing.
- Read `astryx docs layout` before changing a template's frame.
- Dense data = rows (Table, List/Item), not Card-wrapped lists. Badge = counts only.
- Style with component props first, then Tailwind utilities backed by tokens. No raw hex/px.
- Palettes and custom colors go through the theme, never :root overrides. Run `astryx theme add <slug>` to import; `theme eject <slug>` only forks source. See `astryx docs theme`.
- SELF-CHECK: re-read the file; replace any style={{…}}, raw <div>/<span>, imported .css/@apply, or hardcoded/arbitrary value (bg-[#fff], p-[13px]) with the component or a token-backed utility.

`astryx help` lists every command. Key ones beyond the workflow:
  search "<query>"   find any component / hook / doc / template
  discover <words>   integrations you could add
  docs <topic>       getting-started, principles, tokens, theme … (`astryx docs` lists all)
  docs cli           commands and API reference
  docs authoring     build an integration package, and every field it holds
  upgrade --from <old version> --apply   run after a dependency bump
<!-- ASTRYX:END -->
