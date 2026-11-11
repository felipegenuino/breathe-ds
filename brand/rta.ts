import type { Brand } from "./types";

const file = "rta-manual.pdf";
const p = (page: number) => ({ file, page });
const noPrint = { cmyk: null, rgb: null, hex: null, pantoneCoated: null, pantoneUncoated: null };
const AI = "Same fill in rta-marca.ai (Illustrator 28.5, 2024-05-21), artwork layer decoded by script.";

/**
 * Método RTA — Método Reequilíbrio Toracoabdominal.
 * The "manual" is one page: the board of mark variations, text in outlines,
 * no written specification (file date 2024-05-21). The colors below are the
 * real vector fills, read from the PDF's color operators (`rg`) and confirmed
 * in the .ai; they have no role, CMYK or Pantone in this manual.
 */
export const rta: Brand = {
  id: "rta",
  name: "Método RTA",
  fullName: "RTA — Método Reequilíbrio Toracoabdominal",
  manual: { file, pages: 1, fileDate: "2024-05-21", credit: { status: "pending", reason: "No credit printed on the one-page board." } },
  concept: { status: "pending", reason: "The RTA board has no concept text." },
  colors: [
    {
      id: "magenta",
      role: "vector-fill",
      hex: "#AB2781",
      rgb: [171, 39, 129],
      printed: noPrint,
      usage: "the “RTA” letters; background tile",
      source: p(1),
      note: `PDF operator "0.671 0.153 0.506 rg". ${AI} Same hex as the Creeta and RTA Mundi manual magenta.`,
    },
    {
      id: "blue",
      role: "vector-fill",
      hex: "#009AB1",
      rgb: [0, 154, 177],
      printed: noPrint,
      usage: "the symbol on light backgrounds; background tile",
      source: p(1),
      note: `PDF operator "0 0.604 0.694 rg". ${AI} Same hex as the Creeta/TTCAB/RTA Mundi manual blue.`,
    },
    {
      id: "petrol",
      role: "vector-fill",
      hex: "#144753",
      rgb: [20, 71, 83],
      printed: noPrint,
      usage: "background tile",
      source: p(1),
      note: `PDF operator "0.08 0.28 0.327 rg". ${AI} Same hex as the family petrol of the other manuals.`,
    },
    {
      id: "gray",
      role: "vector-fill",
      hex: "#9B9B9A",
      rgb: [155, 155, 154],
      printed: noPrint,
      usage: "the signature “Método Reequilíbrio Toracoabdominal”",
      source: p(1),
      note: `PDF operator "0.608 0.608 0.604 rg". ${AI} Same hex as the Creeta/TTCAB complementary gray.`,
    },
    {
      id: "white",
      role: "vector-fill",
      hex: "#FFFFFF",
      rgb: [255, 255, 255],
      printed: noPrint,
      usage: "reversed marks on color; page background",
      source: p(1),
      note: "PDF operator \"0 0 0 0 k\" (CMYK white).",
    },
  ],
  gradients: { status: "pending", reason: "No gradients in the RTA board." },
  typography: { status: "pending", reason: "The RTA board has no typography specification (all text is in outlines)." },
  clearSpace: { status: "pending", reason: "The RTA board has no clear-space rule." },
  reduction: { status: "pending", reason: "The RTA board has no reduction limits." },
  monochrome: { status: "pending", reason: "The RTA board shows reversed (white) marks on color, but no monochrome page." },
  lockupRules: { status: "pending", reason: "No chancela rule in the RTA board. (The Cuidado Global manual, p. 13, shows RTA with the Cuidado Global endorsement; see that brand.)" },
  graphicElements: { status: "pending", reason: "No graphic elements in the RTA board." },
  variations: [
    { name: "Vertical with signature “Método Reequilíbrio Toracoabdominal” (blue symbol, magenta “RTA”, gray signature)", backgrounds: ["white"], source: p(1) },
    { name: "Horizontal with signature (symbol on the left)", backgrounds: ["white"], source: p(1) },
    { name: "Horizontal without signature (symbol + “RTA”)", backgrounds: ["petrol #144753"], ds: "Lockup horizontal (RtaSymbol + RtaWordmark)", source: p(1) },
    { name: "Vertical without signature (symbol above “RTA”)", backgrounds: ["petrol #144753", "white", "blue #009AB1", "magenta #AB2781"], ds: "Lockup stacked (RtaSymbol + RtaWordmark)", source: p(1) },
    { name: "Symbol only", backgrounds: ["magenta #AB2781 (white)", "blue #009AB1 (white)", "petrol #144753 (blue)"], ds: "RtaSymbol", source: p(1) },
    { name: "Name only “RTA”", backgrounds: ["blue #009AB1 (magenta)", "petrol #144753 (magenta)", "magenta #AB2781 (white)"], ds: "RtaWordmark", source: p(1) },
  ],
  downloads: {
    manual: { file: "brand/manuals/rta-manual.pdf", bytes: 54953 },
    svgs: [
      { file: "brand/svg/rta/rta-symbol-color.svg", name: "Symbol, logo colors", layout: "symbol", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/rta/rta-wordmark-color.svg", name: "Wordmark, logo colors", layout: "wordmark", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/rta/rta-horizontal-color.svg", name: "Horizontal, logo colors", layout: "horizontal", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/rta/rta-vertical-color.svg", name: "Vertical, logo colors", layout: "vertical", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/rta/rta-symbol-white.svg", name: "Symbol, white", layout: "symbol", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/rta/rta-wordmark-white.svg", name: "Wordmark, white", layout: "wordmark", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/rta/rta-horizontal-white.svg", name: "Horizontal, white", layout: "horizontal", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/rta/rta-vertical-white.svg", name: "Vertical, white", layout: "vertical", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/rta/rta-vertical-signature-color.svg", name: "Vertical with signature, manual colors (print)", layout: "vertical", tone: "color", background: "#FFFFFF", origin: "official", from: "RTA_manual de marca.pdf (Drive, RTA_Manual de Marca/Marca)" },
      { file: "brand/svg/rta/rta-horizontal-signature-color.svg", name: "Horizontal with signature, manual colors (print)", layout: "horizontal", tone: "color", background: "#FFFFFF", origin: "official", from: "RTA_manual de marca.pdf (Drive, RTA_Manual de Marca/Marca)" },
    ],
    pending: [],
  },
  pending: [
    "Concept text.",
    "Color roles, CMYK and Pantone (only the vector fills are known).",
    "Typography (headings, text, internet).",
    "Clear space (área de não-interferência).",
    "Reduction limits (with/without signature).",
    "Monochrome version.",
    "Chancela / partner-brand rule of its own.",
    "Manual credit.",
  ],
};
