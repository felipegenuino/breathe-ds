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
| `ink` | primary text / headings | `--cg-ink` |
| `ink-soft` | secondary text | `--cg-ink-soft` |
| `ink-body` | reading body text | `--cg-ink-body` |
| `action` | CTA / highlight — **never plain text** | `--cg-action` |
| `action-text` | text in the action color (AA) | `--cg-action-text` |
| `line` | hairlines / borders | `--cg-line` |
| `font-heading` / `font-body` | typography | `--cg-font-*` |
| `radius-xl/2xl/pill` · `ease-cg` | radius and motion curve | fixed |

## Measured contrast — TTCAB (`tokens/ttcab.css`)

Values from the standard WCAG formula (the same ones `preview/` computes live):

| Pair | Contrast | Level |
|---|---|---|
| surface `#fbf5e9` / ink `#144753` | 9.41:1 | AAA |
| surface `#fbf5e9` / ink-soft `#54707a` | 4.86:1 | AA |
| surface `#fbf5e9` / ink-body `#1e4f5b` | 8.32:1 | AAA |
| surface `#fbf5e9` / action-text `#9a5d07` | 4.90:1 | AA |
| surface-panel `#144753` / cream text | 9.41:1 | AAA |

`action` `#f6a22a` is decorative/CTA only — do not use it as text on cream.

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
  44px icon bubble, a title and a paragraph; a thin line links the drawings.
- **Byline** / **PersonChip** / **Avatar**: who signs or explains content
  (novo.creeta) — stacked portraits + eyebrow + linked names, or portrait + name
  + "Watch the video ↗"; the person chip (portrait, name, role · registration,
  arrow bubble when it links to the person's card). No photo → initials bubble.
- **Breadcrumb**: the article trail "← Section › Parent" (current page not listed).
- **CtaCard** / **VideoInviteCard**: the final call of a novo.creeta page — white
  card (title, lead, CTA slot) beside a video card: muted loop with the speaker's
  name over it, pause control, play button that plays the full video with sound.
- **Footer**: the site-footer of novo.creeta, by tokens — full width like the
  Header, with the signed brand + sentence, "Pages" (title on the first line, links in two
  columns), "Where we are" (address, hours, "Directions ↗ · Waze ↗"), an optional
  notice band on `surface`, the legal line with the **CNPJ (always required in
  the family)** plus the contact chips, and the languages as plain links.
  `navHiddenFrom` keeps room at the bottom for the BottomNav.

## Playground (see the components)

`cd playground && npm install && npm run dev` → kitchen sink at http://localhost:5177 with the real components rendered (ttcab palette).

## Roadmap

- [x] v0.1 — tokens (preset + ttcab/creeta palettes) + preview
- [x] Accordion (1st component; injectable-deps pattern)
- [x] Family typography (Quicksand + Figtree, free fonts only)
- [ ] **novo.creeta scales** (full reference, approved): **typography** (sizes/weights/line-height)
      **+ spacing/rhythm** (section padding, gaps) **+ default border-radius** → become DS tokens
- [ ] **Icons**: package the lucide set used by the family, so components can
      import/inject it (without each site depending on lucide directly)
- [ ] **MediaCard** (video/image behind + icon badge + title + lead + arrow;
      **horizontal carousel on mobile** variant with progress bar + pause) — approved
- [ ] **TestimonialCard** — approved. Variants: **quote** (text card),
      **video hero** (full-bleed with overlaid quote), **video beside** ("Famílias contam": video + text).
      Consider a **mix** of the two. **Already exists in ttcab** (TestimonialVideoHero/Card) → extract/generalize.
- [ ] **VideoStoryCard** (short vertical video) — approved. Play + duration badge +
      title + lead + **"Read the transcript"** (collapsible, reuses the Accordion). Pattern of the Videos page.
      _Note: the card can still improve in a future update (fine to leave for later)._
- [ ] **ProfessionalCard** (team) — approved. Two versions: **small** (photo + name, in a row)
      and **big** (photo + name + role + CREFITO + "Trajetória"/"Orientações" accordions).
      **Video** variant: "Apresentação" badge, hover plays the video, and a **modal** (video + bio).
      **Data rule:** every professional MUST have a **CREFITO** attached (COFFITO requirement).
- [x] **Pill / PillList** — the Atalho of novo.creeta (white 44px pill, arrow bubble: ↓ anchor, ↗ other page, optional meta); wrapping row + "See all"
- [x] **AnchorNav** (floating capsule of anchors, scroll-spy + sliding indicator) — extracted from ttcab (10/29)
- [x] **Footer** · **PageVideoHero** (loop and player) · **Header** (dropdown, house) · **BottomNav** · **Curtain** · **Lockup** (5 arrangements) · **BreatheMark**
- [x] **Site brand marks** (`components/marks/`): real symbol + wordmark for TTCAB and Creeta (10/29)
- [ ] **ThreadRail** (side graphic device — a thread running down the left linking sections) — approved,
      **already exists in ttcab** → extract.
- [ ] **OrganicFrame** (organic, blob-like image crop) — recorded as an **OPTION**
      (not the default for every site). **Already exists in ttcab** → extract as an optional variant.
- [x] Primitives: Button (with link variant), Container, SectionKicker, Card
- [ ] Migrate ttcab and creeta to consume the package + `npm publish`
