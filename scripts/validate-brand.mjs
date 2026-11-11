#!/usr/bin/env node
/**
 * Validates brand/*.ts (Node 22.18+ strips the TypeScript types natively).
 *   node scripts/validate-brand.mjs             checks, exits 1 on any error
 *   node scripts/validate-brand.mjs --contrast  also prints the contrast tables used in brand/README.md
 *
 * Checks: every hex equals the RGB printed in the manual (or read from the
 * vector, for RTA); the printed hex normalizes to the same hex; every color,
 * gradient and rule has a source { file, page }; gradient stops are hex;
 * every download exists in playground/public (manual size = `bytes`), and every
 * SVG has a viewBox, no raster image, no live text or font, no foreign fill.
 */
import { cuidadoGlobal } from "../brand/cuidado-global.ts";
import { creeta } from "../brand/creeta.ts";
import { ttcab } from "../brand/ttcab.ts";
import { rta } from "../brand/rta.ts";
import { rtaMundi } from "../brand/rta-mundi.ts";
import { contrast, formatRatio, wcagLevel, rgbToHex } from "../brand/contrast.ts";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Downloads live in the playground's public folder (not in the npm package). */
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), "../playground/public");

const BRANDS = [cuidadoGlobal, creeta, ttcab, rta, rtaMundi];
const PETROL = "#144753";
const errors = [];
const mismatches = [];
let colors = 0;
let downloads = 0;
/* Colors the DS marks use (components/marks), which differ from the manuals:
   documented in brand/README.md, "Manual × digital". */
const DS_FILLS = {
  creeta: { midWave: "#3B9BAF", arc: "#266675", lightWave: "#63CACD", dot: "#A2158A" },
  rta: { blue: "#159DB0", magenta: "#A7318D" },
};

const isPending = (v) => v && typeof v === "object" && v.status === "pending";
const hasSource = (o) => o && o.source && typeof o.source.file === "string" && Number.isInteger(o.source.page) && o.source.page > 0;
const parseRgb = (s) => {
  const m = /R:\s*(\d+)\s+G:\s*(\d+)\s+B:\s*(\d+)/.exec(s);
  return m ? [+m[1], +m[2], +m[3]] : null;
};

for (const b of BRANDS) {
  for (const c of b.colors) {
    colors++;
    const where = `${b.id}/${c.id}`;
    if (!hasSource(c)) errors.push(`${where}: color without source`);
    if (!/^#[0-9A-F]{6}$/.test(c.hex)) errors.push(`${where}: hex not normalized (${c.hex})`);
    if (c.printed.hex && c.printed.hex.toUpperCase() !== c.hex) errors.push(`${where}: printed hex ${c.printed.hex} ≠ ${c.hex}`);
    if (c.printed.rgb) {
      const p = parseRgb(c.printed.rgb);
      if (!p) errors.push(`${where}: printed RGB not parseable (${c.printed.rgb})`);
      else if (p.join() !== (c.rgb ?? []).join()) errors.push(`${where}: rgb field ${c.rgb} ≠ printed ${c.printed.rgb}`);
    }
    if (c.rgb) {
      const fromRgb = rgbToHex(c.rgb);
      if (fromRgb !== c.hex) mismatches.push(`${where}: hex ${c.hex} ≠ RGB ${c.rgb.join(",")} (${fromRgb}) [p. ${c.source.page}]`);
    } else if (c.role !== "vector-fill") {
      errors.push(`${where}: no RGB`);
    }
  }
  if (!isPending(b.gradients)) for (const g of b.gradients) {
    if (!hasSource(g)) errors.push(`${b.id}: gradient without source`);
    for (const s of g.stops) if (!/^#[0-9a-fA-F]{6}$/.test(s)) errors.push(`${b.id}: gradient stop ${s} is not a hex`);
  }
  for (const key of ["typography", "clearSpace", "reduction", "monochrome", "concept"]) {
    const v = b[key];
    if (!isPending(v) && !hasSource(v)) errors.push(`${b.id}: ${key} without source`);
  }
  if (!isPending(b.typography)) for (const f of b.typography.faces) if (!hasSource(f)) errors.push(`${b.id}: typeface ${f.family} without source`);
  if (!isPending(b.reduction)) for (const s of b.reduction.sizes) if (!hasSource(s)) errors.push(`${b.id}: size ${s.mm}mm without source`);
  for (const key of ["lockupRules", "graphicElements"]) if (!isPending(b[key])) for (const r of b[key]) if (!hasSource(r)) errors.push(`${b.id}: ${key} "${r.title}" without source`);
  for (const v of b.variations) if (!hasSource(v)) errors.push(`${b.id}: variation "${v.name}" without source`);

  const dl = b.downloads;
  if (!dl) { errors.push(`${b.id}: no downloads`); continue; }
  const man = join(PUBLIC, dl.manual.file);
  if (!existsSync(man)) errors.push(`${b.id}: manual ${dl.manual.file} missing`);
  else if (statSync(man).size !== dl.manual.bytes) errors.push(`${b.id}: manual ${dl.manual.file} is ${statSync(man).size} bytes, data says ${dl.manual.bytes}`);
  if (dl.manual.file.split("/").pop() !== b.manual.file) errors.push(`${b.id}: download ${dl.manual.file} ≠ manual.file ${b.manual.file}`);
  for (const f of dl.svgs) {
    downloads++;
    const path = join(PUBLIC, f.file);
    if (!/^#[0-9A-F]{6}$/.test(f.background)) errors.push(`${f.file}: background not #RRGGBB (${f.background})`);
    if (f.origin === "official" && !f.from) errors.push(`${f.file}: official file without \`from\``);
    if (!existsSync(path)) { errors.push(`${f.file}: missing`); continue; }
    const svg = readFileSync(path, "utf8");
    if (!/<svg[^>]*viewBox="/.test(svg)) errors.push(`${f.file}: no viewBox`);
    if (/<image|<text|@font-face|font-family/.test(svg)) errors.push(`${f.file}: raster image or live text/font`);
    const fills = new Set([...svg.matchAll(/fill="([^"]+)"/g)].map((m) => m[1].toUpperCase()));
    const allowed = new Set([...b.colors.map((c) => c.hex), "#FFFFFF", ...Object.values(DS_FILLS[b.id] ?? {})]);
    for (const x of fills) if (!allowed.has(x)) errors.push(`${f.file}: fill ${x} is neither a manual color nor a DS mark color`);
  }
}

console.log(`brand: ${BRANDS.length} brands, ${colors} colors checked`);
console.log(mismatches.length ? `hex ≠ RGB:\n  ${mismatches.join("\n  ")}` : "hex ≠ RGB: none (every hex matches its RGB)");
console.log(`downloads: ${BRANDS.length} manuals, ${downloads} SVG files checked in playground/public`);
console.log(errors.length ? `errors:\n  ${errors.join("\n  ")}` : "errors: none (every color, gradient and rule has a source)");

if (process.argv.includes("--contrast")) {
  for (const b of BRANDS) {
    console.log(`\n### ${b.name}\n\n| Color | Role | vs white #FFFFFF | vs petrol ${PETROL} |\n|---|---|---|---|`);
    for (const c of b.colors) {
      if (c.hex === "#FFFFFF") continue;
      const w = contrast(c.hex, "#FFFFFF");
      const p = contrast(c.hex, PETROL);
      const pCell = c.hex === PETROL ? "— (same color)" : `${formatRatio(p)} ${wcagLevel(p)}`;
      console.log(`| \`${c.hex}\` ${c.id} | ${c.role} | ${formatRatio(w)} ${wcagLevel(w)} | ${pCell} |`);
    }
  }
}

process.exit(errors.length ? 1 : 0);
