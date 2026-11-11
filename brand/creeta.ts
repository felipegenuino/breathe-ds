import type { Brand } from "./types";

const file = "creeta-manual.pdf";
const p = (page: number) => ({ file, page });

/** Creeta — Centro de Reequilíbrio Toracoabdominal. Manual: 22 pages, file date 2022-09-15. */
export const creeta: Brand = {
  id: "creeta",
  name: "Creeta",
  fullName: "creeta — Centro de Reequilíbrio Toracoabdominal",
  manual: { file, pages: 22, fileDate: "2022-09-15", credit: "crismacari.com", creditSource: p(22) },
  concept: {
    text:
      "A Creeta é o Centro de Reequilíbrio Toracoabdominal que atende com tratamentos e auxilia na performance do sistema respiratório utilizando a abordagem do método RTA, esta técnica é uma identidade extensiva da marca institucional Creeta.\n\n" +
      "A criação da marca foi traduzida do movimento contínuo de como consiste a respiração, a sincronia fluída entre a inspiração e a expiração, juntamente com o círculo interligado ao ponto, este que simboliza o identificador RTA e a representação humana estilizada.\n\n" +
      "Os conceitos presentes na marca tem a finalidade de enaltecer o cuidado, como a curvatura que abraça os elementos, mostrando assim nas formas orgânicas uma identidade moderna e com uma mistura de movimento e leveza.",
    keywords: [
      "inspiração e expiração",
      "identificador do método RTA",
      "inicial letra C",
      "movimento de fluidez respiratória",
      "representação estilizada de pessoa",
      "movimento do sistema muscular",
    ],
    source: p(2),
  },
  construction: { summary: "“construção e proporção áurea”: the symbol is built from circles inside a golden-ratio rectangle (page 4, drawing only, no written rule).", source: p(4) },
  colors: [
    {
      id: "light-cyan",
      role: "primary",
      hex: "#62C2D0",
      rgb: [98, 194, 208],
      printed: { cmyk: "C:60 M:0 U:20 K:0", rgb: "R:98 G:194 B:208", hex: "#62C2D0", pantoneCoated: "325 C", pantoneUncoated: "630 U" },
      usage: "light wave of the symbol",
      source: p(6),
      manualInconsistency: "CMYK printed with \"U:20\" where the yellow channel (Y) is expected.",
    },
    {
      id: "blue",
      role: "primary",
      hex: "#009AB1",
      rgb: [0, 154, 177],
      printed: { cmyk: "C:78 M:18 U:27 K:2", rgb: "R:0 G:154 B:177", hex: "#009AB1", pantoneCoated: "320 C", pantoneUncoated: "320 U" },
      usage: "middle wave of the symbol",
      source: p(6),
      manualInconsistency: "CMYK printed with \"U:27\" where the yellow channel (Y) is expected.",
    },
    {
      id: "dark-teal",
      role: "primary",
      hex: "#086A79",
      rgb: [8, 106, 121],
      printed: { cmyk: "C:86 M:37 U:39 K:23", rgb: "R:8 G:106 B:121", hex: "#086A79", pantoneCoated: "322 C", pantoneUncoated: "322 U" },
      usage: "outer arc of the symbol and the “creeta” wordmark",
      source: p(6),
      manualInconsistency: "CMYK printed with \"U:39\" where the yellow channel (Y) is expected.",
    },
    {
      id: "magenta",
      role: "primary",
      hex: "#AB2781",
      rgb: [171, 39, 129],
      printed: { cmyk: "C:37 M:95 Y:4 K:0", rgb: "R:171 G:39 B:129", hex: "#AB2781", pantoneCoated: "675 C", pantoneUncoated: "Strong Red U" },
      usage: "the dot (“identificador do método RTA”)",
      source: p(6),
      manualInconsistency: "The Pantone pair \"675 C / Strong Red U\" is also printed for the TTCAB orange #F6A22A (ttcab-manual.pdf p. 4): two very different colors share the same Pantone references, so at least one of them is wrong.",
    },
    {
      id: "gray",
      role: "complementary",
      hex: "#9B9B9A",
      rgb: [155, 155, 154],
      printed: { cmyk: "C:0 M:0 Y:0 K:50", rgb: "R:155 G:155 B:154", hex: "#9B9B9A", pantoneCoated: "Cool Gray 7 C", pantoneUncoated: "Black 0961 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(7),
    },
    {
      id: "light-magenta",
      role: "complementary",
      hex: "#BE73AE",
      rgb: [190, 115, 174],
      printed: { cmyk: "C:30 M:64 Y:0 K:0", rgb: "R:190 G:115 B:174", hex: "#BE73AE", pantoneCoated: "681 C", pantoneUncoated: "674 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(7),
    },
    {
      id: "petrol",
      role: "complementary",
      hex: "#144753",
      rgb: [20, 71, 83],
      printed: { cmyk: "C:90 M:53 Y:47 K:43", rgb: "R:20 G:71 B:83", hex: "#144753", pantoneCoated: "3035 C", pantoneUncoated: "3165 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(7),
    },
  ],
  gradients: [
    { stops: ["#086a79", "#009ab1"], source: p(8) },
    { stops: ["#009ab1", "#62c2d0"], source: p(8) },
    { stops: ["#62c2d0", "#ffffff"], source: p(8) },
    {
      stops: ["#009ab1", "#62c2d0"],
      source: p(8),
      manualInconsistency: "Label and swatch disagree: the label says #009ab1 → #62c2d0 (the same pair as the bar on its left), but the bar is drawn dark petrol → magenta (pixels sampled at the ends of a 60 dpi render: about #34405d → #982b7b).",
    },
    { stops: ["#ab2781", "#be73ae"], source: p(8) },
    { stops: ["#be73ae", "#ffffff"], source: p(8) },
  ],
  typography: {
    faces: [
      { role: "headings", family: "Quicksand", weights: ["Bold", "Book", "Light"], preferred: "Bold", rule: "Chamadas e títulos devem ser escritos com a tipografia Quicksand. Os títulos devem ser grandes e curtos, utilizando a versão Bold ou Book. A versão Light deve ser utilizada em casos de títulos e chamadas maiores.", licence: "open", source: p(5) },
      { role: "text", family: "Gotham", weights: ["Bold", "Medium", "Book"], preferred: "Book", rule: "Textos corridos utilizam a tipografia Gotham, nas versões Bold, Medium e Book, preferencialmente utilizar a versão Book.", licence: "commercial", source: p(5) },
      { role: "internet", family: "Arial", weights: ["Bold", "Regular"], rule: "Textos para a internet ou sem a possibilidade da utilização da fonte principal, devem ser utilizadas o Arial e Arial Bold.", licence: "system", source: p(5) },
    ],
    restrictions: ["Não devem ser utilizadas versões italizadas destes tipos gráficos, excetuando-se os casos de expressões em outro idioma."],
    source: p(5),
  },
  clearSpace: {
    unit: "width of the letters “cre”",
    rule: "Para garantir o impacto visual e a legibilidade da marca Creeta, é preciso resguardar uma área em torno dela equivalente, no mínimo, a largura da junção das letras “cre”.",
    source: p(10),
  },
  reduction: {
    sizes: [
      { layout: "horizontal", chancela: "with", mm: 73, source: p(11) },
      { layout: "vertical", chancela: "with", mm: 43, source: p(11) },
      { layout: "horizontal", chancela: "without", mm: 50, source: p(11) },
      { layout: "vertical", chancela: "without", mm: 27, source: p(11) },
    ],
    rule: "Para assegurar sua legibilidade deve ser respeitada a dimensão mínima de veiculação em materiais gráficos impressos e também na definição do uso ou não da chancela. Esta regra pode ser flexibilizada no caso de utilização em mídias digitais, porém deve ser previamente testada. Em qualquer caso, no entanto, é fundamental atentar para que todos os elementos da marca estejam em perfeita legibilidade.",
    chancelaShownAs: "On this page “com chancela” is drawn as the mark WITH the descriptor “Centro de Reequilíbrio Toracoabdominal” (not with the Cuidado Global endorsement of the Cuidado Global manual).",
    source: p(11),
  },
  monochrome: { summary: "Horizontal and vertical marks with descriptor, in dark gray on white and in white on dark gray.", source: p(9) },
  lockupRules: [
    {
      title: "uso de marcas parceiras",
      rule: "Quando necessário inserir outras marcas parceiras juntamente com a marca Creeta é importante estar ciente de utilizar no mesmo peso visual para ambos. Escolha corretamente entre o limite vertical ou horizontal e mantenha a área de proteção indicada para garantir a integridade da marca.",
      summary: "Partner brands (shown: RTA) at the same visual weight as Creeta, aligned on the vertical or horizontal limit, with Creeta's clear space kept.",
      source: p(12),
    },
  ],
  graphicElements: { status: "pending", reason: "The manual has no graphic elements page." },
  variations: [
    { name: "Vertical with descriptor “Centro de Reequilíbrio Toracoabdominal”", backgrounds: ["white"], source: p(13) },
    { name: "Horizontal with descriptor", backgrounds: ["white"], source: p(13) },
    { name: "Vertical without descriptor (symbol + “creeta”)", backgrounds: ["white", "dark teal #086A79", "light cyan #62C2D0", "magenta #AB2781"], ds: "Lockup stacked (CreetaSymbol + CreetaWordmark)", source: p(13) },
    { name: "Horizontal without descriptor", backgrounds: ["petrol #144753"], ds: "Lockup horizontal (CreetaSymbol + CreetaWordmark)", source: p(13) },
    { name: "Symbol only", backgrounds: ["magenta #AB2781", "petrol #144753", "dark teal #086A79"], ds: "CreetaSymbol", source: p(13) },
    { name: "Wordmark only “creeta”", backgrounds: ["light cyan #62C2D0", "dark teal #086A79", "magenta #AB2781"], ds: "CreetaWordmark", source: p(13) },
  ],
  downloads: {
    manual: { file: "brand/manuals/creeta-manual.pdf", bytes: 5844479 },
    svgs: [
      { file: "brand/svg/creeta/creeta-symbol-color.svg", name: "Symbol, logo colors", layout: "symbol", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/creeta/creeta-wordmark-color.svg", name: "Wordmark, logo colors", layout: "wordmark", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/creeta/creeta-horizontal-color.svg", name: "Horizontal, logo colors", layout: "horizontal", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/creeta/creeta-vertical-color.svg", name: "Vertical, logo colors", layout: "vertical", tone: "color", background: "#FFFFFF", origin: "ds" },
      { file: "brand/svg/creeta/creeta-symbol-white.svg", name: "Symbol, white", layout: "symbol", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/creeta/creeta-wordmark-white.svg", name: "Wordmark, white", layout: "wordmark", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/creeta/creeta-horizontal-white.svg", name: "Horizontal, white", layout: "horizontal", tone: "white", background: "#144753", origin: "ds" },
      { file: "brand/svg/creeta/creeta-vertical-white.svg", name: "Vertical, white", layout: "vertical", tone: "white", background: "#144753", origin: "ds" },
    ],
    pending: [
      "Official files with the descriptor \"Centro de Reequilíbrio Toracoabdominal\": no vector in the Drive (folder CREETA_Marca has no .ai).",
    ],
  },
  pending: [
    "No graphic elements page in the manual.",
    "The DS has no lockup with the descriptor line drawn from the manual (Lockup takes the tagline as live text).",
  ],
};
