#!/usr/bin/env node
/**
 * Exports the marks the DS draws (components/marks/{creeta,ttcab,rta}.tsx) as
 * standalone .svg files for download, into playground/public/brand/svg/<brand>/.
 *   node scripts/export-brand-svg.mjs
 *
 * Nothing is redrawn: the script reads the viewBox and the path `d` strings
 * straight from the .tsx files, the colors from their constants, and the
 * lockup proportions from `*_LOCKUP.wordmarkPerSymbol`. The arrangement follows
 * components/Lockup.tsx at size `md` (symbol 44 px, gap 10 px in horizontal,
 * 16 px between symbol and name in stacked), scaled so the symbol is 100 units high.
 *
 * Per brand: symbol, wordmark, horizontal and vertical (stacked), each in the
 * logo colors (light backgrounds) and all white (dark backgrounds).
 *
 * The other files in that folder (Cuidado Global, and the signed/descriptor
 * variations of TTCAB and RTA) were cut once from the official .ai/.pdf boards
 * and are not produced here: see brand/README.md, "Downloads".
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "playground/public/brand/svg");
const WHITE = "#FFFFFF";

/* Wordmark colors the components leave as `currentColor`: taken from the
   site files the drawings were copied from (creeta-tipo.svg fills #266675,
   TTCAB's ttcab-horizontal-dark.svg fills the letters #144753). */
const BRANDS = [
  { id: "creeta", file: "creeta.tsx", Name: "Creeta", wordmarkColor: "#266675" },
  { id: "ttcab", file: "ttcab.tsx", Name: "Ttcab", wordmarkColor: "#144753" },
  { id: "rta", file: "rta.tsx", Name: "Rta", wordmarkColor: null /* default of the component: RTA_COLORS.magenta */ },
];

/** `export const NAME = "#hex"` and `export const NAME = { key: "#hex", … }`. */
function constants(src) {
  const out = {};
  for (const m of src.matchAll(/export const (\w+) = "(#[0-9A-Fa-f]{6})"/g)) out[m[1]] = m[2];
  for (const m of src.matchAll(/export const (\w+) = \{([\s\S]*?)\} as const/g)) {
    for (const k of m[2].matchAll(/(\w+): "(#[0-9A-Fa-f]{6})"/g)) out[`${m[1]}.${k[1]}`] = k[2];
    for (const k of m[2].matchAll(/(\w+): ([\d.]+)/g)) out[`${m[1]}.${k[1]}`] = Number(k[2]);
    for (const k of m[2].matchAll(/(\w+): "(left|right)"/g)) out[`${m[1]}.${k[1]}`] = k[2];
  }
  return out;
}

/** Reads `export function <name>(…)` up to its closing </svg>. */
function readSvgFn(src, name, consts) {
  const start = src.indexOf(`export function ${name}(`);
  if (start < 0) throw new Error(`${name} not found`);
  const body = src.slice(start, src.indexOf("</svg>", start));
  const vb = /viewBox="([^"]+)"/.exec(body)[1].split(/\s+/).map(Number);
  const def = /\bcolor = ([A-Za-z_.]+|"[^"]+")/.exec(body.slice(0, body.indexOf(") {")))?.[1];
  const defaultColor = def ? (def.startsWith('"') ? def.slice(1, -1) : consts[def]) : null;
  const paths = [...body.matchAll(/<path d="([^"]+)" fill=\{([^}]+)\}/g)].map(([, d, fill]) => {
    const key = /c\("(\w+)"\)/.exec(fill)?.[1];
    const colorConst = Object.keys(consts).find((k) => k.endsWith(`_COLORS.${key}`));
    return { d, fill: key ? consts[colorConst] : defaultColor };
  });
  if (!paths.length) throw new Error(`${name}: no paths`);
  for (const p of paths) if (!/^#[0-9A-Fa-f]{6}$/.test(p.fill ?? "") && p.fill !== "currentColor") throw new Error(`${name}: unresolved fill ${p.fill}`);
  return { vb, paths };
}

const fmt = (n) => String(Math.round(n * 1000) / 1000);

/** A mark placed at (x, y) with height h, as a nested <svg> (keeps the original viewBox). */
function place(mark, x, y, h, color) {
  const [, , w0, h0] = mark.vb;
  const w = (h * w0) / h0;
  const paths = mark.paths.map((p) => `<path d="${p.d}" fill="${color ?? p.fill}"/>`).join("");
  return { w, h, svg: `<svg x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" viewBox="${mark.vb.join(" ")}">${paths}</svg>` };
}

function doc(w, h, inner, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(w)} ${fmt(h)}" width="${fmt(w)}" height="${fmt(h)}" role="img" aria-label="${title}"><title>${title}</title>${inner}</svg>\n`;
}

const S = 100; // symbol height in the lockups
const GAP_H = (10 / 44) * S; // Lockup md: gap-2.5 next to a 44 px symbol
const GAP_V = (16 / 44) * S; // Lockup stacked: mt-4 under a 44 px symbol

let count = 0;
for (const b of BRANDS) {
  const src = readFileSync(join(root, "components/marks", b.file), "utf8");
  const consts = constants(src);
  const symbol = readSvgFn(src, `${b.Name}Symbol`, consts);
  const word = readSvgFn(src, `${b.Name}Wordmark`, consts);
  if (b.wordmarkColor) word.paths.forEach((p) => (p.fill = b.wordmarkColor));
  const lockupKey = Object.keys(consts).find((k) => k.endsWith("_LOCKUP.wordmarkPerSymbol"));
  const ratio = consts[lockupKey];
  const side = consts[lockupKey.replace("wordmarkPerSymbol", "symbolSide")];
  const label = b.id === "rta" ? "Método RTA" : b.id === "ttcab" ? "TTCAB" : "Creeta";
  const dir = join(OUT, b.id);
  mkdirSync(dir, { recursive: true });

  for (const tone of ["color", "white"]) {
    const c = tone === "white" ? WHITE : null;
    const out = {};
    // symbol, wordmark: the drawing alone, its own box
    const sym = place(symbol, 0, 0, S, c);
    out.symbol = doc(sym.w, sym.h, sym.svg, label);
    const wm = place(word, 0, 0, S * ratio, c);
    out.wordmark = doc(wm.w, wm.h, wm.svg, label);
    // horizontal: symbol and name centered on the same line, symbol on `side`
    {
      const wh = S * ratio;
      const s = place(symbol, 0, 0, S, c);
      const W = s.w + GAP_H + (wh * word.vb[2]) / word.vb[3];
      const sx = side === "right" ? W - s.w : 0;
      const wx = side === "right" ? 0 : s.w + GAP_H;
      const parts = place(symbol, sx, 0, S, c).svg + place(word, wx, (S - wh) / 2, wh, c).svg;
      out.horizontal = doc(W, S, parts, label);
    }
    // vertical (stacked): symbol on top, name below, both centered
    {
      const wh = S * ratio;
      const ww = (wh * word.vb[2]) / word.vb[3];
      const sw = (S * symbol.vb[2]) / symbol.vb[3];
      const W = Math.max(sw, ww);
      const parts = place(symbol, (W - sw) / 2, 0, S, c).svg + place(word, (W - ww) / 2, S + GAP_V, wh, c).svg;
      out.vertical = doc(W, S + GAP_V + wh, parts, label);
    }
    for (const [layout, svg] of Object.entries(out)) {
      writeFileSync(join(dir, `${b.id}-${layout}-${tone}.svg`), svg);
      count++;
    }
  }
}
console.log(`export-brand-svg: ${count} files in playground/public/brand/svg/{creeta,ttcab,rta}`);
