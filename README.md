# Breathe

**Breathe** — the design system of the **Cuidado Global family** (the RTA / Mariangela
ecosystem: creeta, ttcab, metodorta…). The sites **inherit** this package and apply
their own palette on top of the same contract.

> npm package: `@breathe-ds/ui` (the technical address). **Breathe** is the system's name.

> **v0.1** — tokens + components (see `components/`) + the sites' brand marks.
> See everything rendered in the playground (below).

## Idea

The family's sites **do not share a palette** (ttcab is teal/cream,
creeta is teal/mist/magenta). What they share are the **token roles** —
`surface`, `ink`, `action`, `line`… — with the same names and structure.
Each site defines the values (`--cg-*`) of its own palette.

A token is never "color X": it is **role + measured contrast**. (Felipe is color-blind;
color decisions are always made by role and contrast, never by eye.)

## Install

```bash
npm i @breathe-ds/ui
```

Public package on npm: https://www.npmjs.com/package/@breathe-ds/ui · source at
https://github.com/felipegenuino/breathe-ds (MIT license). The components ship as TSX source (no
build step): in Next, add `transpilePackages: ["@breathe-ds/ui"]` to `next.config`.

## Usage (Tailwind v4)

In the site's `globals.css`:

```css
@import "tailwindcss";
@import "@breathe-ds/ui/theme.css";
@import "@breathe-ds/ui/tokens/ttcab.css";   /* or define the --cg-* inline */
```

Then Tailwind utilities use the roles: `bg-surface`, `text-ink`,
`border-line`, `bg-action`, `text-action-text`, `rounded-2xl`, etc.

For a site without a ready-made token file, define the roles on `:root` itself:

```css
:root {
  --cg-surface: #fbf5e9;
  --cg-ink: #144753;
  /* … see tokens/ttcab.css for the full list */
}
```

`theme.css` also sets the family's base behaviour: smooth scrolling for anchors
(`html { scroll-behavior: smooth }`, switched off under `prefers-reduced-motion`)
and `scroll-padding` (6rem top, 7rem bottom) so keyboard focus never lands
hidden behind the sticky Header or the BottomNav (WCAG 2.4.11).

## Token roles

| Token (Tailwind) | Role | `--cg-*` |
|---|---|---|
| `surface` | base background | `--cg-surface` |
| `surface-panel` | dark panel (footer, final CTA) | `--cg-surface-panel` |
| `card` | raised surface: cards, pills, menus over the page (white on all three palettes) | `--cg-card` |
| `ink` | primary text / headings | `--cg-ink` |
| `ink-soft` | secondary text | `--cg-ink-soft` |
| `ink-body` | reading body text | `--cg-ink-body` |
| `action` | CTA / highlight — **never plain text** | `--cg-action` |
| `action-text` | text in the action color (AA) | `--cg-action-text` |
| `on-action` | text ON the action color (the accent button) | `--cg-on-action` |
| `action-tint` | highlighted panel or card: a 6% wash of the action color over the surface | `--cg-action-tint` |
| `action-line` | border of a highlighted card (closed tone, 3:1 on the surface; pure ttcab orange is 1.91:1) | `--cg-action-line` |
| `line` | hairlines / borders | `--cg-line` |

**Dose of the action color** (what brands with a hot accent do, Cloudflare orange,
Airbnb red): the action color is the fill of ONE element per block, with
`on-action` text on it; links stay in `ink`/`ink-soft` with an underline; a
highlighted card is `action-tint` + `action-line`, not the full color; the
color as text only as `action-text`. The "Action dose" section of the playground
shows the disciplined and the loud version side by side.
| `font-heading` / `font-body` | typography | `--cg-font-*` |
| `radius-xl/2xl/pill` · `ease-cg` | radius and motion curve | fixed |

## Measured contrast — TTCAB (`tokens/ttcab.css`)

Values from the standard WCAG formula (the same ones `preview/` computes live):

| Pair | Contrast | Level |
|---|---|---|
| surface `#fbf5e9` / ink `#144753` | 9.41:1 | AAA |
| surface `#fbf5e9` / ink-soft `#54707a` | 4.86:1 | AA |
| surface `#fbf5e9` / ink-body `#1e4f5b` | 8.32:1 | AAA |
| surface `#fbf5e9` / action-text `#bd3f0c` | 4.98:1 | AA |
| action `#e8541e` / on-action `#ffffff` (accent button) | 3.67:1 | 3:1 UI component; below AA text, conscious exception |
| surface-panel `#144753` / cream text | 9.41:1 | AAA |

`action` `#e8541e` is a vivid red-orange with white text, the Cloudflare/Airbnb route: 3.67:1 passes the 3:1 of UI components, not the 4.5:1 of normal text. A conscious exception, limited to the accent Button (one per block, same type scale as the other buttons so they never look mismatched); small controls (chips, tabs, segments) use `ink` or `action-tint` + `action-text` instead. The UI orange does not match the logo's `#f6a22a` on purpose. As text, use `action-text`.

## Family typography

Decision (2026-10-28): **open-source fonts only** — no licensed ones (Gotham is out).

| Role | Font | Note |
|---|---|---|
| `font-heading` | **Quicksand** | headings, whole family (Google Fonts) |
| `font-body` | **Figtree** | body, whole family (Google Fonts) |

**Type hierarchy/scale:** use **novo.creeta**'s as the guide (well worked out
and refined). _To be extracted into size/weight/line-height tokens._

## First consumers

**ttcab** and **creeta**. The creeta palette in `tokens/creeta.css` is
illustrative (marked `[conferir]`) — to be finalized when creeta migrates.

## What changes per theme (and what is fixed)

**Changes per theme:** only **colors** and **graphic devices** (ThreadRail, OrganicFrame,
watermark…). Each site/brand in the family has its own color and its own graphic devices.

**Fixed across the whole family:** **typography** (Quicksand for headings + Figtree for
body, in any theme — including Neutral) and the **icons** (lucide). Buttons
use the body font at semibold (Quicksand's 600 renders too light).

## Decision — card style

The DS card language: **subtle borders + subtle shadow** (reference: "Famílias contam" on novo.creeta). No strong borders or heavy shadows. _To become `--shadow-card` + `--border` tokens._

## Decision — hero width

**Wider / full-bleed** heroes, in **novo.creeta**'s proportion (more immersive, less
side margin). Applies to `PageVideoHero` and `PageHero`. ttcab's current hero is more contained
— widen it to the creeta standard when migrating. _Becomes a hero-width token/scale._

## Site brand marks (`components/marks/`)

Each site in the family has its real symbol and wordmark, copied from the brand
files (`public/brand`) in the repositories, split into two components so the
`Curtain` and the `Lockup` can compose the arrangements:

| Site | Symbol | Wordmark | Import |
|---|---|---|---|
| TTCAB | `TtcabSymbol` (mother + baby, orange `#F6A22A`) | `TtcabWordmark` (uppercase, `currentColor`) | `@breathe-ds/ui/components/marks/ttcab` |
| Creeta | `CreetaSymbol` (three waves + dot, brand colors) | `CreetaWordmark` (lowercase, `currentColor`) | `@breathe-ds/ui/components/marks/creeta` |

```tsx
<Curtain logo={<TtcabSymbol />} name={<TtcabWordmark />} wordmarkRatio={TTCAB_LOCKUP.wordmarkPerSymbol} tagline="…" />
<Lockup variant="horizontal" size="md" logo={<CreetaSymbol />} wordmark={<CreetaWordmark />} wordmarkRatio={CREETA_LOCKUP.wordmarkPerSymbol} name="creeta" />
```

**The proportion comes from the brand manual, not from the eye.** Each brand file exports
`*_LOCKUP.wordmarkPerSymbol` (wordmark height ÷ symbol height in the
horizontal logo: TTCAB 0.557 · creeta 0.469) and `symbolSide` (in TTCAB the
symbol sits to the **right** of the name; in creeta and the others, to the left). The `Lockup` and the `Curtain`
pass this to the svg through the `--cg-wordmark` variable; the injected symbol takes the
height of the size (`size`). Measured on the sites (2026-10-29): in both headers the
symbol is **44px** tall — that is the Lockup's `size="md"`. The symbol accepts
`color` for a monochrome version (white on a dark panel). The artwork is never
edited by hand: it is the one from each brand's manual.

`Lockup` with `entrance` (and `entranceDelay` in ms) reproduces the header entrance of
novo.creeta: symbol, then name, then tagline; with reduced motion it becomes
a short fade.

## Typography

The family's scale, from novo.creeta, as components: `Heading` (sizes
`display` 2.5rem→6xl · `hero` · `section` 1.75rem→4xl · `card` · `small`;
Quicksand medium in `ink`) with an optional `accent` — the second sentence of
the same heading on its own line, one tone below in `ink-soft` — and
`SectionHeading` (eyebrow/number line, title + accent, lead). `Text` for
paragraphs (`lead`, `body`, `small`, `eyebrow`, Figtree) and `Prose` for a run
of paragraphs at reading width. Two tones, one element: the hierarchy comes
from color, not from extra markup.

## Navigation

- **Header**: brand (the app passes the link to the home page) · items · item with dropdown
  (icons on sub-items; final link with a → arrow, or ↗ if `external`) · language · CTA.
  Site convention: "Home" is just the house (`icon` + `iconOnly`), with a label for
  screen readers.
- **BottomNav**: on phone/tablet, navigation leaves the header and becomes the
  floating bottom bar. It is the code of novo.creeta's BarraNavegacao (= ttcab's
  BottomNav), made neutral through tokens: it receives ALL pages in order of importance
  (`pages`, with the lucide `Icon`) and shows as many as fit (64px per tab,
  ResizeObserver); the rest and the external exits (`extras`, with the domain spelled out
  and a ↗ arrow) go to the "More" panel, a native popover (Esc, tap outside, no
  JS). Gradient veil behind the bar. `hideFrom` = `md` (creeta) or `lg`
  (ttcab). `labels` for another language. `embedded` for the demo frame.
- **AnchorNav**: floating capsule of page anchors (scroll-spy + sliding
  indicator), extracted from ttcab's TreatmentAnchorNav. Target sections need
  a `scroll-mt-*` compatible with the sticky header.
- **LanguageSwitcher**: the SeletorDeIdioma of novo.creeta — `menu` (button with
  the code, opens the three languages; header) or `list` (plain links; the Footer
  uses it). Same page in the other language, each language written in itself,
  current marked by ✓ and `aria-current`.
- **List**: the family's list with a marker in front of each item (novo.creeta):
  `marker="check"` (24px bubble, "what we assess / what we treat") or
  `marker="arrow"` (corner arrow, one sentence per item, as in the Footer
  notice). An item with `href` is a link: semibold, underline, outbound arrow.
- **Timeline**: the "Como cuidamos" of novo.creeta — ordered steps, each with a
  44px icon bubble, a title and a paragraph; a thin line links the drawings. A
  step may end with a link (strong link + outbound arrow).
- **RowList** / **CollapseRow** / **LinkRow**: the list of equal rows at the foot
  of a card (the Trajectory / Guidance / Instagram block of the ProfessionalCard),
  generic. 48px rows with hairlines; a CollapseRow is a native `<details>` with a
  text or a list of links (`links`, count beside the label); a LinkRow goes
  somewhere (↗ another page, ↓ anchor, `external` for a new tab, `icon` to
  replace the arrow). The ProfessionalCard is built on them.
- **ProfessionalCard** / **ProfessionalModal** / **CaptionBand**: the team card of
  novo.creeta — portrait (plain, living clip on hover, or with the "Presentation"
  chip), name, role, registration (**always**: COFFITO 414/2012) and generic
  `rows` (collapse with text or links, link with arrow or icon — on creeta:
  trajectory, guidance, Instagram); the modal plays the presentation with sound,
  the live caption band (active WebVTT cue) above the name, and the full `bio`.
  Three sizes (`size`): `full` (team page), `medium` (the home's tile — 3:4
  portrait, name, "Meet" badge on hover, a link to the full card; `shortName`,
  `href`) and `micro` (the "who treats" row — 72px photo, name, role, link).
- **Rail** / **RailItem**: novo.creeta's `Trilho` — on the phone a snapping
  horizontal rail with a progress bar underneath (shown only when it scrolls),
  a grid from md (`grid` classes written in full). RailItem presets the phone
  width: `wide` (treatments, videos) or `narrow` (team).
- **Byline** / **PersonChip** / **Avatar**: who signs or explains content
  (novo.creeta) — stacked portraits + eyebrow + linked names, or portrait + name
  + "Watch the video ↗"; the person chip (portrait, name, role · registration,
  arrow bubble when it links to the person's card). No photo → initials bubble.
- **Breadcrumb**: the article trail "← Section › Parent" (current page not listed).
- **FactStrip**: the three facts under the hero of novo.creeta — icon bubble +
  two lines of equal weight per fact, thin dividers between columns (rows on
  phones); the separator between the lines is read by screen readers only.
- **InfoCard**: the white info cards of the clinic page (icon bubble, title,
  lines/address, note, outbound links "Directions ↗ · Waze ↗").
- **MediaCard**: photo or muted clip behind a title, badge top-left, arrow button
  top-right, whole card a link; Ken Burns zoom on hover (mouse only), clip plays
  while visible or on hover; pause hooks exported for a page-level pause button.
  The portrait variant ("Who created the method"): `eyebrow` + title + `linkLabel`
  ("See the team ↗") with `arrowButton={false}`.
- **VideoStoryCard**: the vertical Instagram-style video card (poster, play
  button, duration badge; gradient grows and the lead appears on hover/focus;
  tap plays with sound in place; optional muted hover preview). When the clip
  ends the card returns to the poster with a "Watched" badge (check + word,
  top-right): `watched` sets it from the site, `onWatched` fires once at the end,
  `remember` keeps the set of watched clips in localStorage (by `src`). Exports
  the page-level pause contract (`CARD_VIDEOS_PAUSE_EVENT` / `CARD_VIDEOS_PAUSED_ATTR`).
- **TestimonialCard**: clip with a play button on the left, quote + author +
  outbound link on the right ("Famílias contam").
- **MapCard**: the Mapa of novo.creeta — a still preview fading into the card,
  the address, "View the map" and the outbound "Directions" link; Google is only
  called after the tap (no consent banner, lighter page). Open, the map fills
  the card with the same close bar as the hero video.
- **CtaCard** / **VideoInviteCard**: the final call of a novo.creeta page — white
  card (title, lead, CTA slot) beside a video card: muted loop with the speaker's
  name over it, pause control, play button that plays the full video with sound.
- **CareSteps**: "how the care works" of novo.creeta — a bento mosaic of
  numbered steps (drawing above, text below; the first takes two columns) with
  the invite on the dark panel closing the sequence. The drawings are slots:
  **ChatPreview** (a sample chat, bubble by bubble, the clinic "types"; loops
  while on screen, pause button), **PlanTimeline** (three stages, the line comes
  down and each dot lights up; 6s loop, pause button), **PhotoSequence** (photos
  with fade and a slow zoom, CSS only, paused by a hidden checkbox), or a still
  image. All stand still and whole with reduced motion. `useOnAppear` (animate
  when half on screen, only while on screen) and `PauseButton` (44px, 32px
  circle) are exported for your own drawings.
- **Blog**: creeta's "guidance" area — **PostCard** (the card of the list:
  cover, category, title as the link stretched over the card, excerpt in three
  lines, author · date), **FeaturedPosts** ("in the words of who treats you":
  bento, the first post wide with the cover beside the text, a Byline with the
  speaker and "Watch the video ↗" at the foot) and **PostArticle** (the page:
  trail, title, PersonChip and date, the text with its notice, the video beside
  it sticky from md, the transcript open; children for "other posts" and the
  final call).
- **StoryPanel**: creeta's "origin" block — one dark panel (surface-panel)
  grouping a story: media at the top with a film that fades into the panel, the
  logo at its base, title, lead, three pillars in columns with a hairline above
  each, and the outbound links. For "who we are" and "why us" blocks.
- **Footer**: the site-footer of novo.creeta, by tokens — full width like the
  Header, with the signed brand + sentence, "Pages" (title on the first line, links in two
  columns; with many pages, `pages.groups` — titled columns, up to four side by
  side, so the list gets wider instead of taller), "Where we are" (address, hours,
  "Directions ↗ · Waze ↗"), an optional
  notice band on `surface`, the legal line with the **CNPJ (always required in
  the family)** plus the contact chips, and the languages as plain links.
  `navHiddenFrom` keeps room at the bottom for the BottomNav.

## Playground (see the components)

`cd playground && npm install && npm run dev` → kitchen sink at http://localhost:5177 with the real components rendered (ttcab palette).

## Roadmap

- [x] v0.1 — tokens (preset + ttcab/creeta palettes) + preview
- [x] Accordion (1st component; injectable-deps pattern) — the Perguntas of novo.creeta: white card (`bg-card`), 22px radius, no border
- [x] Family typography (Quicksand + Figtree, free fonts only)
- [ ] **novo.creeta scales** (full reference, approved): **typography** (sizes/weights/line-height)
      **+ spacing/rhythm** (section padding, gaps) **+ default border-radius** → become DS tokens
- [ ] **Icons**: package the lucide set used by the family, so components can
      import/inject it (without each site depending on lucide directly)
- [ ] **MediaCard** (video/image behind + icon badge + title + lead + arrow;
      **horizontal carousel on mobile** variant with progress bar + pause) — approved
- [x] **TestimonialCard** — from novo.creeta (10/29): clip + play on the left, quote/author/link on the right. The "video hero" and "video beside" variants from ttcab are still open
- [x] **VideoStoryCard** — from novo.creeta (10/29): vertical card, play + duration badge, lead on hover/focus, plays with sound in place; "Read the transcript" goes in `children` (Accordion)
- [x] **ProfessionalCard** (team) — from novo.creeta (10/29): small = PersonChip/Byline, big = the card with living portrait, presentation modal + captions. Original note: Two versions: **small** (photo + name, in a row)
      and **big** (photo + name + role + CREFITO + "Trajetória"/"Orientações" accordions).
      **Video** variant: "Apresentação" badge, hover plays the video, and a **modal** (video + bio).
      **Data rule:** every professional MUST have a **CREFITO** attached (COFFITO requirement).
- [x] **Pill / PillList** — the Atalho of novo.creeta (white 44px pill, arrow bubble: ↓ anchor, ↗ other page, optional meta); wrapping row + "See all"
- [x] **AnchorNav** (floating capsule of anchors, scroll-spy + sliding indicator) — extracted from ttcab (10/29)
- [x] **Footer** · **PageVideoHero** (loop, and player from a YouTube id or the site's own mp4) · **Header** (dropdown, house) · **BottomNav** · **Curtain** · **Lockup** (5 arrangements) · **BreatheMark**
- [x] **Site brand marks** (`components/marks/`): real symbol + wordmark for TTCAB and Creeta (10/29)
- [ ] **ThreadRail** (side graphic device — a thread running down the left linking sections) — approved,
      **already exists in ttcab** → extract.
- [ ] **OrganicFrame** (organic, blob-like image crop) — recorded as an **OPTION**
      (not the default for every site). **Already exists in ttcab** → extract as an optional variant.
- [x] Primitives: Button (with link variant), Container, SectionKicker, Card
- [ ] Migrate ttcab and creeta to consume the package + `npm publish`
