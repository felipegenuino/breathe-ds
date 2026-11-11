/** WCAG 2.x relative luminance and contrast ratio, for hex colors (#RGB or #RRGGBB). */

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two colors, e.g. 7.9 for 7.9:1. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** "AAA" ≥ 7, "AA" ≥ 4.5, "AA large/UI" ≥ 3, otherwise "fail". */
export function wcagLevel(ratio: number): "AAA" | "AA" | "AA large/UI" | "fail" {
  const r = Math.floor(ratio * 100) / 100;
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  if (r >= 3) return "AA large/UI";
  return "fail";
}

/** Ratio formatted the way the family docs write it: "7.90:1" (truncated, never rounded up to pass). */
export function formatRatio(ratio: number): string {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}
