# Brand guidelines — Cuidado Global family

The rules of each brand, transcribed from the official brand manuals (by
**crismacari.com**) so there is one place to look them up: this guide for people,
and typed data for code.

```ts
import { BRANDS, creeta, contrast } from "@breathe-ds/ui/brand";
creeta.colors.find((c) => c.id === "magenta"); // { hex: "#AB2781", printed: { pantoneCoated: "675 C", … }, source: { file: "creeta-manual.pdf", page: 6 } }
```

| Brand | Module | Manual (file date) | Pages |
|---|---|---|---|
| Cuidado Global (mother brand) | `brand/cuidado-global.ts` | `cuidado-global-manual.pdf` (2023-01-25) | 23 |
| Creeta | `brand/creeta.ts` | `creeta-manual.pdf` (2022-09-15) | 22 |
| TTCAB | `brand/ttcab.ts` | `ttcab-manual.pdf` (2025-09-09) | 22 |
| Método RTA | `brand/rta.ts` | `rta-manual.pdf` (2024-05-21), board of variations only | 1 |
| RTA Mundi 2025 (event) | `brand/rta-mundi.ts` | `rta-mundi-manual.pdf` (2025-02-03) | 15 |

**How to read the data.** Every value has `source: { file, page }` (page of the
PDF). Printed lines (CMYK, RGB, hex, Pantone) are kept **exactly as printed**,
typos included; evident errors of the manual carry a `manualInconsistency`
note and are never corrected. What a manual does not specify is
`{ status: "pending" }`: nothing is filled in by analogy with another brand.
The **reduced** manual PDFs and the logo SVGs are published by the playground
(see [Downloads](#downloads)); the full-size manuals, the `.ai` files, mockups,
photos and font files are **not** in this repo (public), and Gotham and Mouser
are commercial fonts.

**Typography decision (owner, 2026-11-11).** The commercial fonts the manuals
specify (Gotham, Mouser) are kept here only as the reference of the printed
manual. Work for the family uses free Google Fonts, which in the DS are
**Quicksand** (headings) + **Figtree** (text). There is no font-by-font
equivalence table: only what the DS already uses.

`node scripts/validate-brand.mjs` checks the data: every hex against its
printed RGB, and a source on every color, gradient and rule
(`--contrast` prints the contrast tables below).

Contrast (WCAG 2.x, truncated to two decimals): *AAA* ≥ 7, *AA* ≥ 4.5 (normal
text), *AA large/UI* ≥ 3 (large text, icons, borders), *fail* < 3. The dark
reference is the family **petrol `#144753`**, the color every written palette shares.

## Downloads

The playground's "Brand guidelines" section offers, per brand, the manual PDF
and the logo SVGs. The files live in `playground/public/brand/` — **outside the
npm package** (`files` in package.json does not include `playground/`) — and the
list is data: `downloads` in each `brand/*.ts` (paths relative to the
playground's public folder, so they follow the Vite base, `/breathe-ds/` online).
`node scripts/validate-brand.mjs` checks that every listed file exists, that the
manual size matches `bytes`, and that every SVG is vector only (no raster, no
live text or font) and uses only manual or DS-mark colors.

| Folder | What | Where it came from |
|---|---|---|
| `manuals/<brand>-manual.pdf` | reduced manual (same pages, 12.5 MB for the five) | the official manuals, downsampled |
| `svg/creeta/`, `svg/ttcab/`, `svg/rta/` `*-{symbol,wordmark,horizontal,vertical}-{color,white}.svg` | the marks the DS draws, in logo colors and all white | **generated**: `node scripts/export-brand-svg.mjs` reads the paths from `components/marks/*.tsx` and the proportions from `*_LOCKUP` (layout of `Lockup` at size `md`); nothing redrawn |
| `svg/cuidado-global/*` | vertical, horizontal and symbol, as drawn on the board's tiles | cut once from `Cuidado Global_Marca.ai` (Drive folder `Cuidado Global_Marca/Marca`; text in curves) |
| `svg/ttcab/ttcab-*-descriptor-*.svg` | with the descriptor "Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê" | cut once from `TTCAB_Marca.ai` (Drive `TTCAB_Marca/Marca`; text in curves) |
| `svg/rta/rta-*-signature-color.svg` | with the signature "Método Reequilíbrio Toracoabdominal", **manual colors** (`#009AB1`, `#AB2781`, `#9B9B9A`: print) | cut once from `RTA_manual de marca.pdf` (Drive `RTA_Manual de Marca/Marca`); `RTA_Marca.ai` has no PDF-compatible content |

The "official" cuts keep the board's paths and fills untouched: one tile per
file, viewBox tight to the drawing, tile background, clip and metadata removed
(`pdftocairo -svg`, then a one-off script kept outside the repo). The DS files
of Creeta and RTA use the **site** colors of `components/marks` (see "Manual ×
digital" per brand); the Creeta wordmark is `#266675` and the TTCAB wordmark
`#144753`, as in the site files they were copied from.

**Pending:** RTA Mundi has no vector logo (the Drive has only JPG; the manual
draws the line mesh as embedded images and the name as live Montserrat text,
which is not recomposed). Creeta has no official vector with the descriptor.
The Cuidado Global board has no horizontal in logo colors for white, and no
monochrome. Each brand's `downloads.pending` lists these.

---

## Cuidado Global

The **mother brand** ("marca mãe"): owner of the other identities and the source
of their principles (concept, p. 2). Lowercase geometric wordmark in two lines;
the arc under the "o" is the base that holds all services, the dot is the
connection with the other brands.

### Colors

| Color | Role (manual) | Hex | RGB | CMYK (as printed) | Pantone C / U | Page |
|---|---|---|---|---|---|---|
| petrol | primary (cores principais) | `#144753` | 20 71 83 | C:90 M:53 Y:47 K:43 | 3035 C / 3165 U | 6 |
| light cyan | primary | `#62C2D0` | 98 194 208 | C:60 M:0 **U**:20 K:0 ⚠ | 325 C / 630 U | 6 |
| dark gray | complementary (tons complementares) | `#3C3C3C` | 60 60 60 | C:0 M:0 Y:0 K:90 | 179-14 C / 179-14 U | 7 |
| light gray | complementary | `#DADADA` | 218 218 218 | C:0 M:0 Y:0 K:20 | 179-3 C / 179-3 U | 7 |

Complementary tones are for "fundos, transparências e elementos gráficos".
**Gradients** (p. 8): `#3c3c3c → #144753`, `#3c3c3c → #dadada`, `#144753 → #62c2d0`, `#62c2d0 → #dadada`.

| Color | Role | vs white `#FFFFFF` | vs petrol `#144753` |
|---|---|---|---|
| `#144753` petrol | primary | 10.21:1 AAA | — |
| `#62C2D0` light cyan | primary | 2.06:1 fail | 4.93:1 AA |
| `#3C3C3C` dark gray | complementary | 11.03:1 AAA | 1.07:1 fail |
| `#DADADA` light gray | complementary | 1.39:1 fail | 7.30:1 AAA |

### Typography (p. 5)

| Use | Typeface | Weights | Note |
|---|---|---|---|
| Headings and calls (títulos) | **Mouser** | Regular | commercial font |
| Running text (textos em geral) | **Gotham** | Bold, Medium, **Book** (preferred) | commercial font |
| Internet / no main font | **Arial** | Bold, Regular | system font |

No italics, except for expressions in another language ("excetuando-se os casos
de expressões em outro idioma").

### Clear space and minimum size

- **Clear space** (área de não-interferência, p. 10): at least the width of the letters **"glo"** on every side.
- **Minimum size** (limite de redução, p. 11): horizontal **50 mm**, vertical **30 mm** (print).
  May be relaxed in digital media, but must be tested first; every element must stay legible.

### Sub-brands and endorsement

- **Sub-brand architecture** (p. 12): Cuidado Global with its sub-brands (shown: Creeta and RTA) at the
  same visual weight; vertical arrangement (Cuidado Global | rule | sub-brands) or horizontal
  (Cuidado Global over a rule, sub-brands below); keep the clear space.
- **Endorsement** (uso da marca como chancela, p. 13): the brands are independent; when location or
  association must be shown, Cuidado Global goes under the sub-brand as a *chancela*, **always in its
  horizontal version** (shown under the Creeta and RTA vertical marks).

### Variations (p. 14) and monochrome (p. 9)

Vertical (two lines), horizontal (one line) and **symbol only** (the "o" ring with the arc), on white,
petrol, light cyan and dark gray. Monochrome: vertical and horizontal in dark gray on white and white on dark gray.

### Manual × digital

| Manual | DS today | Status |
|---|---|---|
| petrol `#144753` | `ink` / `surface-panel` `#144753` in `tokens/ttcab.css` and `tokens/creeta.css` | same hex (no Cuidado Global palette) |
| light cyan `#62C2D0` | — | no token |
| grays `#3C3C3C`, `#DADADA` | — | no token |
| Mouser (headings) | Quicksand (`--cg-font-heading`) | differs |
| Gotham (text), Arial (internet) | Figtree (`--cg-font-body`) | differs (DS decision 2026-10-28: open-source fonts only) |
| wordmark, symbol | — | no component draws it; official SVGs cut from `Cuidado Global_Marca.ai` in [Downloads](#downloads) |

---

## Creeta

Centro de Reequilíbrio Toracoabdominal. The symbol translates the continuous
movement of breathing (inspiration and expiration); the dot is the RTA identifier
and a stylized person; the initial "C" (concept, pp. 2–3). Construction on the
golden ratio (p. 4).

### Colors

| Color | Role (manual) | Hex | RGB | CMYK (as printed) | Pantone C / U | Page |
|---|---|---|---|---|---|---|
| light cyan | primary | `#62C2D0` | 98 194 208 | C:60 M:0 **U**:20 K:0 ⚠ | 325 C / 630 U | 6 |
| blue | primary | `#009AB1` | 0 154 177 | C:78 M:18 **U**:27 K:2 ⚠ | 320 C / 320 U | 6 |
| dark teal | primary | `#086A79` | 8 106 121 | C:86 M:37 **U**:39 K:23 ⚠ | 322 C / 322 U | 6 |
| magenta | primary | `#AB2781` | 171 39 129 | C:37 M:95 Y:4 K:0 | 675 C / Strong Red U ⚠ | 6 |
| gray | complementary | `#9B9B9A` | 155 155 154 | C:0 M:0 Y:0 K:50 | Cool Gray 7 C / Black 0961 U | 7 |
| light magenta | complementary | `#BE73AE` | 190 115 174 | C:30 M:64 Y:0 K:0 | 681 C / 674 U | 7 |
| petrol | complementary | `#144753` | 20 71 83 | C:90 M:53 Y:47 K:43 | 3035 C / 3165 U | 7 |

"Tom sobre tom" blues; the magenta is the analogous accent for secondary elements.
**Gradients** (p. 8): `#086a79 → #009ab1`, `#009ab1 → #62c2d0`, `#62c2d0 → #ffffff`,
`#009ab1 → #62c2d0` ⚠ (label; the bar is drawn petrol → magenta), `#ab2781 → #be73ae`, `#be73ae → #ffffff`.

| Color | Role | vs white `#FFFFFF` | vs petrol `#144753` |
|---|---|---|---|
| `#62C2D0` light cyan | primary | 2.06:1 fail | 4.93:1 AA |
| `#009AB1` blue | primary | 3.35:1 AA large/UI | 3.04:1 AA large/UI |
| `#086A79` dark teal | primary | 6.27:1 AA | 1.62:1 fail |
| `#AB2781` magenta | primary | 6.28:1 AA | 1.62:1 fail |
| `#9B9B9A` gray | complementary | 2.78:1 fail | 3.67:1 AA large/UI |
| `#BE73AE` light magenta | complementary | 3.35:1 AA large/UI | 3.04:1 AA large/UI |
| `#144753` petrol | complementary | 10.21:1 AAA | — |

### Typography (p. 5)

| Use | Typeface | Weights | Note |
|---|---|---|---|
| Headings and calls | **Quicksand** | **Bold** (preferred), Book, Light | headings big and short, Bold or Book; Light for larger headings and calls |
| Running text | **Gotham** | Bold, Medium, **Book** (preferred) | commercial font |
| Internet / no main font | **Arial** | Bold, Regular | system font |

No italics, except for expressions in another language.

### Clear space and minimum size

- **Clear space** (p. 10): at least the width of the letters **"cre"**.
- **Minimum size** (p. 11), print:

  | | Horizontal | Vertical |
  |---|---|---|
  | With "chancela" (drawn as the descriptor "Centro de Reequilíbrio Toracoabdominal") | **73 mm** | **43 mm** |
  | Without | **50 mm** | **27 mm** |

  May be relaxed in digital media, but must be tested first.

### Partner brands (p. 12)

Partner brands (shown: RTA) at the same visual weight, aligned on the vertical or horizontal limit,
keeping Creeta's clear space. (Creeta under the Cuidado Global endorsement: see Cuidado Global, p. 13.)

### Variations (p. 13) and monochrome (p. 9)

Vertical and horizontal **with** descriptor, vertical and horizontal **without**, **symbol only**,
**wordmark only** ("creeta"), on white, light cyan, dark teal, petrol and magenta. Monochrome: with descriptor,
dark gray on white / white on dark gray.

### Manual × digital

| Manual | DS today (`tokens/creeta.css`, `components/marks/creeta.tsx`) | Status |
|---|---|---|
| magenta `#AB2781` | `action` / `action-line` `#ab2781` | **same** |
| magenta `#AB2781` (the dot) | `CREETA_COLORS.dot` `#A2158A` | differs |
| petrol `#144753` | `ink` / `surface-panel` `#144753` | **same** |
| dark teal `#086A79` (arc, wordmark) | `CREETA_COLORS.arc` `#266675`, token `ink-soft` `#266675` | differs |
| blue `#009AB1` (middle wave) | `CREETA_COLORS.midWave` `#3B9BAF` | differs |
| light cyan `#62C2D0` (light wave) | `CREETA_COLORS.lightWave` `#63CACD` | differs |
| gray `#9B9B9A`, light magenta `#BE73AE` | — | no token |
| Quicksand Bold/Book/Light (headings) | Quicksand (headings at medium in the type scale) | same family, weight differs |
| Gotham (text), Arial (internet) | Figtree | differs (open-source-only decision) |

The symbol colors came from the site's `creeta-simbolo.svg`, not from the manual.

---

## TTCAB

Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê. The symbol is a hand
that wraps and protects, with the baby held in the gesture; solid modern
type against the fluid icon (concept, p. 2).

### Colors

| Color | Role (manual) | Hex | RGB | CMYK (as printed) | Pantone C / U | Page |
|---|---|---|---|---|---|---|
| orange | primary | `#F6A22A` ⚠ | 246 162 43 | C:0 M:43 Y:88 K:0 | 675 C / Strong Red U ⚠ | 4 |
| petrol ("azul profundo") | primary | `#144753` | 20 71 83 | C:90 M:53 Y:47 K:43 | 3035 C / 3165 U | 4 |
| yellow | complementary | `#FBBA00` | 251 186 0 | C:0 M:30 Y:94 K:0 | 7549 C / 116 U | 5 |
| blue | complementary | `#009AB1` | 0 154 177 | C:78 M:18 **U**:27 K:2 ⚠ | 320 C / 320 U | 5 |
| dark teal | complementary | `#086A79` | 8 106 121 | C:86 M:37 **U**:39 K:23 ⚠ | 322 C / 322 U | 5 |
| gray | complementary | `#9B9B9A` | 155 155 154 | C:0 M:0 Y:0 K:50 | Cool Gray 7 C / Black 0961 U | 5 |

**Gradients** (p. 6): `#009ab1 → #086a79` ⚠ (label; the bar starts petrol `#144753`), `#086a79 → #009ab1`,
`#f6a22a → #fbba00`, `#fbba00 → #ffffff`.

| Color | Role | vs white `#FFFFFF` | vs petrol `#144753` |
|---|---|---|---|
| `#F6A22A` orange | primary | 2.07:1 fail | 4.92:1 AA |
| `#144753` petrol | primary | 10.21:1 AAA | — |
| `#FBBA00` yellow | complementary | 1.73:1 fail | 5.89:1 AA |
| `#009AB1` blue | complementary | 3.35:1 AA large/UI | 3.04:1 AA large/UI |
| `#086A79` dark teal | complementary | 6.27:1 AA | 1.62:1 fail |
| `#9B9B9A` gray | complementary | 2.78:1 fail | 3.67:1 AA large/UI |

### Typography (p. 3)

Same rule as Creeta: **Quicksand** for headings (Bold preferred, Book, Light for larger headings),
**Gotham** Bold/Medium/**Book** for text, **Arial** Bold/Regular for internet; no italics except
for expressions in another language.

### Clear space and minimum size

- **Clear space** (p. 8): at least the width of the letters **"TT"**.
- **Minimum size** (p. 9), print:

  | | Vertical | Horizontal |
  |---|---|---|
  | With "chancela" (drawn as the descriptor "Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê") | **36 mm** | **60 mm** |
  | Without | **24 mm** | **38 mm** |
  | Lettering only ("TTCAB") | — | **15 mm** |

### Partner brands (p. 10)

Same rule as Creeta (shown: TTCAB with Creeta).

### Graphic elements (p. 11)

Rounded-corner outline shapes taken from the geometry of the TTCAB letters. Used as photo frames,
outlines or subtle background patterns, or to highlight keywords, data and calls; they can guide the
eye like a visual thread ("fio condutor").

### Variations (p. 12) and monochrome (p. 7)

Vertical (symbol above), horizontal with descriptor (symbol on the right), vertical with descriptor,
**symbol only**, **lettering only**, on white, petrol and orange. Monochrome: horizontal and vertical without
descriptor, dark gray / white.

### Manual × digital

| Manual | DS today (`tokens/ttcab.css`, `components/marks/ttcab.tsx`) | Status |
|---|---|---|
| orange `#F6A22A` | `TTCAB_ORANGE` `#F6A22A` (symbol) | **same** |
| orange `#F6A22A` | `action` `#e8541e` (UI red-orange, white on it 3.67:1) | differs on purpose (documented in `tokens/ttcab.css`) |
| petrol `#144753` | `ink` / `surface-panel` `#144753` | **same** |
| yellow `#FBBA00`, blue `#009AB1`, dark teal `#086A79`, gray `#9B9B9A` | — | no token |
| Quicksand (headings) | Quicksand | same family |
| Gotham (text), Arial (internet) | Figtree | differs (open-source-only decision) |
| full name "Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê" | playground tagline "Torcicolo Congênito e Assimetrias do Bebê" | differs (wording) |

---

## Método RTA

Método Reequilíbrio Toracoabdominal. The manual is **one page**: the board of
mark variations, with the text in outlines and **no written specification**.

### Colors (vector fills)

Read by script from the PDF's color operators and confirmed in the artwork
layer of `rta-marca.ai`. They have **no role, CMYK or Pantone** in this manual.

| Fill | Hex | PDF operator | Where | Page |
|---|---|---|---|---|
| magenta | `#AB2781` | `0.671 0.153 0.506 rg` | "RTA" letters; background tile | 1 |
| blue | `#009AB1` | `0 0.604 0.694 rg` | symbol on light backgrounds; background tile | 1 |
| petrol | `#144753` | `0.08 0.28 0.327 rg` | background tile | 1 |
| gray | `#9B9B9A` | `0.608 0.608 0.604 rg` | signature "Método Reequilíbrio Toracoabdominal" | 1 |
| white | `#FFFFFF` | `0 0 0 0 k` | reversed marks; page | 1 |

The four colors are the same hex the Creeta / RTA Mundi manuals specify (their Pantone references
are not repeated here, since the RTA board does not state them).

| Color | vs white `#FFFFFF` | vs petrol `#144753` |
|---|---|---|
| `#AB2781` magenta | 6.28:1 AA | 1.62:1 fail |
| `#009AB1` blue | 3.35:1 AA large/UI | 3.04:1 AA large/UI |
| `#144753` petrol | 10.21:1 AAA | — |
| `#9B9B9A` gray | 2.78:1 fail | 3.67:1 AA large/UI |

### Variations (p. 1)

Vertical **with signature** "Método Reequilíbrio Toracoabdominal" (blue symbol, magenta "RTA", gray
signature); horizontal with signature (symbol on the left); horizontal and vertical **without**
signature; **symbol only**; **name only** ("RTA"); versions on white, blue, magenta and petrol (white
symbol on magenta/blue, magenta "RTA" on blue/petrol, all white on magenta).

### Pending (not in the board)

Concept · color roles, CMYK and Pantone · typography · clear space · minimum size · monochrome ·
its own chancela rule · credit. (RTA under the Cuidado Global endorsement is shown in the Cuidado Global
manual, p. 13.)

### Manual × digital

| Manual (vector fill) | DS today (`tokens/rta.css`, `components/marks/rta.tsx`) | Status |
|---|---|---|
| magenta `#AB2781` (6.28:1 on white) | `action` / `action-line` / `RTA_COLORS.magenta` `#A7318D` (6.05:1 on white) | differs |
| blue `#009AB1` (3.35:1 on white) | `RTA_COLORS.blue` `#159DB0` (3.23:1 on white) | differs |
| petrol `#144753` | `ink` / `surface-panel` `#154654` | differs |
| gray `#9B9B9A` (signature) | — | not drawn (the DS marks have no signature) |
| typography | Quicksand + Figtree | no manual rule to compare |

The DS values came from the logo of the metodo-rta-2026 site theme (`metodorta-next`), not from the vector board.

**Decision (owner, 2026-11-11):** digital keeps the site values (`#A7318D`, `#159DB0`, `#154654`); the manual values (`#AB2781`, `#009AB1`, `#144753`) are for print.

---

## RTA Mundi 2025

Congresso Mundial de Reequilíbrio Toracoabdominal, an **event** identity organized by
RTA and Cuidado Global; the palette is shared with them on purpose. Its main graphic
element is a mesh of thin organic lines (connection, networking, the lightness of breathing).

### Colors

| Color | Role (manual) | Hex | RGB | CMYK (as printed) | Pantone C / U | Page |
|---|---|---|---|---|---|---|
| petrol | primary | `#144753` | 20 71 83 | C:90 M:53 Y:47 K:43 | 3035 C / 3165 U | 4 |
| blue | primary | `#009AB1` | 0 154 177 | C:78 M:18 **U**:27 K:2 ⚠ | 320 C / 320 U | 4 |
| light cyan | primary | `#62C2D0` | 98 194 208 | C:60 M:0 **U**:20 K:0 ⚠ | 325 C / 630 U | 4 |
| magenta | primary | `#AB2781` | 171 39 129 | C:37 M:95 Y:4 K:0 | 675 C / Strong Red U ⚠ | 4 |

**Gradients** (p. 5): `#144753 → #AB2781`, `#144753 → #009AB1`, `#009AB1 → #62C2D0 → #AB2781`.

| Color | Role | vs white `#FFFFFF` | vs petrol `#144753` |
|---|---|---|---|
| `#144753` petrol | primary | 10.21:1 AAA | — |
| `#009AB1` blue | primary | 3.35:1 AA large/UI | 3.04:1 AA large/UI |
| `#62C2D0` light cyan | primary | 2.06:1 fail | 4.93:1 AA |
| `#AB2781` magenta | primary | 6.28:1 AA | 1.62:1 fail |

### Typography (p. 3)

**Montserrat** for headings and text, every weight allowed (light, regular, medium, semibold, bold,
extrabold, black), "respeitando o contexto do conteúdo". Open-source font.

### Clear space (p. 6)

At least the width of the acronym **"RT"**.

### Variations (p. 7) and graphic elements (p. 8)

One lockup (line-mesh sphere + "RTA MUNDI 2025"): white text on petrol, light cyan and magenta;
petrol text on white. Graphic elements: seven samples of the line mesh in a blue → magenta gradient.

### Pending (not in the manual)

Minimum size · monochrome · chancela / partner-brand rule.

### Manual × digital

No DS palette and no mark in the DS: the colors coincide with the family hex
(`#144753` = TTCAB/Creeta `ink`; magenta `#AB2781` = Creeta `action`).
Montserrat is not used by the DS (Quicksand + Figtree).

---

## Inconsistencies of the manuals themselves

Transcribed as printed, flagged in the data with `manualInconsistency`:

1. **"U:" instead of "Y:" in CMYK** for `#62C2D0`, `#009AB1` and `#086A79` (Cuidado Global p. 6,
   Creeta p. 6, TTCAB p. 5, RTA Mundi p. 4).
2. **Same Pantone pair "675 C / Strong Red U"** printed for the magenta `#AB2781` (Creeta p. 6,
   RTA Mundi p. 4) and for the orange `#F6A22A` (TTCAB p. 4). It cannot describe both.
3. **TTCAB orange: hex ≠ RGB.** Printed hex `#F6A22A`, printed RGB 246 162 43 (= `#F6A22B`), p. 4.
4. **Creeta gradient label ≠ swatch** (p. 8, right column, first bar): labelled `#009ab1 → #62c2d0`,
   drawn dark petrol → magenta.
5. **TTCAB gradient label ≠ swatch** (p. 6, first bar): labelled `#009ab1 → #086a79`, drawn starting
   at petrol `#144753`.
6. **"Chancela" means two things.** In the Cuidado Global manual it is the Cuidado Global endorsement
   under a sub-brand (p. 13); on the Creeta (p. 11) and TTCAB (p. 9) reduction pages "com chancela" is
   drawn as the mark with its descriptor line.
