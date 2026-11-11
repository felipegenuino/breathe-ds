/**
 * Brand guidelines of the Cuidado Global family, as data.
 *
 * Every value is transcribed from the official brand manual (by crismacari.com)
 * and carries the page it came from (`source`). Nothing is inferred by analogy
 * between brands: what a manual does not specify is `pending`.
 *
 * Printed values are kept exactly as printed, typos included (e.g. "U:" for
 * yellow in CMYK). Evident errors of the manual itself are flagged with a
 * `manualInconsistency` note, never corrected.
 */

export type Source = {
  /** Manual file name (the PDFs are not in this repo). */
  file: string;
  /** 1-based page of the PDF. */
  page: number;
};

/** Something the manual does not specify. Never filled in by analogy. */
export type Pending = { status: "pending"; reason: string };

export const isPending = (v: unknown): v is Pending =>
  typeof v === "object" && v !== null && (v as Pending).status === "pending";

export type ColorRole =
  /** "cores principais" */
  | "primary"
  /** "tons complementares" */
  | "complementary"
  /** RTA only: a fill read from the vector file, no written role in the manual. */
  | "vector-fill";

export type BrandColor = {
  /** Stable id inside the brand (kebab-case, descriptive, not from the manual). */
  id: string;
  role: ColorRole;
  /** Normalized #RRGGBB (uppercase), from the printed hex. */
  hex: string;
  /** Normalized RGB from the printed RGB line, or null if the manual prints none. */
  rgb: [number, number, number] | null;
  /** Lines exactly as printed in the manual (null when the manual prints none). */
  printed: {
    cmyk: string | null;
    rgb: string | null;
    hex: string | null;
    pantoneCoated: string | null;
    pantoneUncoated: string | null;
  };
  /** Where the manual uses it, when it says (in Portuguese when quoted). */
  usage?: string;
  source: Source;
  manualInconsistency?: string;
  note?: string;
};

export type Gradient = {
  /** Stops as printed on the labels, left to right. */
  stops: string[];
  source: Source;
  manualInconsistency?: string;
};

export type TypeRole = "headings" | "text" | "internet" | "headings-and-text";

export type BrandTypeface = {
  role: TypeRole;
  family: string;
  /** Weights as the manual names them ("Book", "Light"…), in the printed order. */
  weights: string[];
  preferred?: string;
  /** Rules for this role, literal Portuguese from the manual. */
  rule: string;
  /** Licence note for the DS (Gotham and Mouser are commercial fonts: never shipped here). */
  licence?: "commercial" | "system" | "open";
  source: Source;
};

export type Typography = {
  faces: BrandTypeface[];
  /** "Não devem ser utilizadas versões italizadas…" when the manual says so. */
  restrictions: string[];
  source: Source;
};

export type ClearSpace = {
  /** The unit, as the manual names it: width of the letters "glo", "cre", "TT", "RT". */
  unit: string;
  /** Literal rule (Portuguese). */
  rule: string;
  source: Source;
};

export type MinSize = {
  /** "horizontal" | "vertical" | "lettering" (wordmark only) — as the manual draws it. */
  layout: "horizontal" | "vertical" | "lettering";
  /** With the "chancela", without it, or the manual does not split. */
  chancela: "with" | "without" | "n/a";
  mm: number;
  source: Source;
};

export type ReductionLimits = {
  sizes: MinSize[];
  /** Literal rule text (Portuguese). */
  rule: string;
  /** What the manual draws as "chancela" on this page, when it is not obvious. */
  chancelaShownAs?: string;
  source: Source;
};

export type Variation = {
  /** What the manual shows (English description). */
  name: string;
  backgrounds?: string[];
  /** Which DS component draws it today, if any. */
  ds?: string;
  source: Source;
};

export type GuidelineText = {
  title: string;
  /** Literal Portuguese from the manual. */
  rule: string;
  /** English summary for the guide. */
  summary: string;
  source: Source;
};

export type Brand = {
  id: "cuidado-global" | "creeta" | "ttcab" | "rta" | "rta-mundi";
  name: string;
  /** Full name / descriptor as the manual prints it. */
  fullName: string;
  manual: {
    file: string;
    pages: number;
    /** From the PDF metadata (CreationDate), ISO date. */
    fileDate: string;
    /** Credit printed in the manual, or pending. */
    credit: string | Pending;
    creditSource?: Source;
  };
  /** Concept text, literal Portuguese. */
  concept: { text: string; keywords?: string[]; source: Source } | Pending;
  construction?: { summary: string; source: Source };
  colors: BrandColor[] ;
  gradients: Gradient[] | Pending;
  typography: Typography | Pending;
  clearSpace: ClearSpace | Pending;
  reduction: ReductionLimits | Pending;
  monochrome: { summary: string; source: Source } | Pending;
  /** Chancela / sub-brand architecture / partner brands. */
  lockupRules: GuidelineText[] | Pending;
  graphicElements: GuidelineText[] | Pending;
  variations: Variation[];
  /** Anything else this brand lacks in the manual, listed for the guide. */
  pending: string[];
};
