import type { Brand } from "./types";

const file = "rta-mundi-manual.pdf";
const p = (page: number) => ({ file, page });

/** RTA MUNDI 2025 — Congresso Mundial de Reequilíbrio Toracoabdominal (event). Manual: 15 pages, file date 2025-02-03. */
export const rtaMundi: Brand = {
  id: "rta-mundi",
  name: "RTA Mundi",
  fullName: "RTA MUNDI 2025 — Congresso Mundial de Reequilíbrio Toracoabdominal",
  manual: { file, pages: 15, fileDate: "2025-02-03", credit: "crismacari.com", creditSource: p(15) },
  concept: {
    text:
      "A identidade visual do RTA MUNDI, Congresso Mundial de Reequilíbrio Toracoabdominal, foi criada para transmitir os valores centrais do evento e reforçar sua conexão com as marcas organizadoras, RTA e Cuidado Global. A escolha da paleta de cores reflete essa integração, promovendo uma continuidade visual e simbólica com as marcas já estabelecidas, facilitando o reconhecimento e fortalecendo a identidade conjunta.\n\n" +
      "Os elementos gráficos principais incluem uma malha composta por linhas finas e orgânicas. Essas linhas foram projetadas para representar conexão e networking, simbolizando as trocas de conhecimento e a união de profissionais. Além disso, a leveza da malha remete à suavidade e fluidez da respiração, um conceito central no Reequilíbrio Toracoabdominal, trazendo equilíbrio e harmonia à comunicação visual.\n\n" +
      "O resultado é uma identidade visual que une inovação, saúde, colaboração e bem-estar, traduzindo a importância global do evento de maneira elegante e inspiradora.",
    source: p(2),
  },
  colors: [
    {
      id: "petrol",
      role: "primary",
      hex: "#144753",
      rgb: [20, 71, 83],
      printed: { cmyk: "C:90 M:53 Y:47 K:43", rgb: "R:20 G:71 B:83", hex: "#144753", pantoneCoated: "3035 C", pantoneUncoated: "3165 U" },
      source: p(4),
    },
    {
      id: "blue",
      role: "primary",
      hex: "#009AB1",
      rgb: [0, 154, 177],
      printed: { cmyk: "C:78 M:18 U:27 K:2", rgb: "R:0 G:154 B:177", hex: "#009AB1", pantoneCoated: "320 C", pantoneUncoated: "320 U" },
      source: p(4),
      manualInconsistency: "CMYK printed with \"U:27\" where the yellow channel (Y) is expected.",
    },
    {
      id: "light-cyan",
      role: "primary",
      hex: "#62C2D0",
      rgb: [98, 194, 208],
      printed: { cmyk: "C:60 M:0 U:20 K:0", rgb: "R:98 G:194 B:208", hex: "#62C2D0", pantoneCoated: "325 C", pantoneUncoated: "630 U" },
      source: p(4),
      manualInconsistency: "CMYK printed with \"U:20\" where the yellow channel (Y) is expected.",
    },
    {
      id: "magenta",
      role: "primary",
      hex: "#AB2781",
      rgb: [171, 39, 129],
      printed: { cmyk: "C:37 M:95 Y:4 K:0", rgb: "R:171 G:39 B:129", hex: "#AB2781", pantoneCoated: "675 C", pantoneUncoated: "Strong Red U" },
      source: p(4),
      manualInconsistency: "The Pantone pair \"675 C / Strong Red U\" is also printed for the TTCAB orange #F6A22A (ttcab-manual.pdf p. 4).",
    },
  ],
  gradients: [
    { stops: ["#144753", "#AB2781"], source: p(5) },
    { stops: ["#144753", "#009AB1"], source: p(5) },
    { stops: ["#009AB1", "#62C2D0", "#AB2781"], source: p(5) },
  ],
  typography: {
    faces: [
      {
        role: "headings-and-text",
        family: "Montserrat",
        weights: ["light", "regular", "medium", "semibold", "bold", "extrabold", "black"],
        rule: "Montserrat é o padrão tipográfico para o RTA MUNDI, utilizada em títulos e conteúdo de corpo de texto. Essa é uma fonte sem serifa e moderna, projetada para ambientes impressos e digitais. Pode-se utilizar todas suas versões dentro da sua família tipográfica, respeitando o contexto do conteúdo.",
        licence: "open",
        source: p(3),
      },
    ],
    restrictions: [],
    source: p(3),
  },
  clearSpace: {
    unit: "width of the acronym “RT”",
    rule: "Para garantir o impacto visual e a legibilidade da marca da RTA MUNDI é preciso resguardar uma área em torno dela equivalente, no mínimo, a largura da sigla “RT”.",
    source: p(6),
  },
  reduction: { status: "pending", reason: "The RTA Mundi manual has no reduction-limit page." },
  monochrome: { status: "pending", reason: "The RTA Mundi manual has no monochrome page." },
  lockupRules: { status: "pending", reason: "No chancela or partner-brand page; the concept only names RTA and Cuidado Global as the organizing brands." },
  graphicElements: [
    {
      title: "elementos visuais",
      rule: "Os elementos gráficos principais incluem uma malha composta por linhas finas e orgânicas. Essas linhas foram projetadas para representar conexão e networking, simbolizando as trocas de conhecimento e a união de profissionais.",
      summary: "A mesh of thin organic lines in a blue → magenta gradient (seven samples on page 8); the concept text (page 2) explains it as connection/networking and the lightness of breathing.",
      source: p(8),
    },
  ],
  variations: [
    {
      name: "One lockup: line-mesh sphere + “RTA MUNDI 2025” (white text on color, petrol text on white)",
      backgrounds: ["petrol #144753", "light cyan #62C2D0", "magenta #AB2781", "white"],
      source: p(7),
    },
  ],
  pending: [
    "Reduction limits (no page in the manual).",
    "Monochrome version (no page in the manual).",
    "Chancela / partner-brand rule (no page in the manual).",
    "No vector of the RTA Mundi mark in the DS, and no DS palette (it is a 2025 event identity).",
  ],
};
