import type { Brand } from "./types";

const file = "ttcab-manual.pdf";
const p = (page: number) => ({ file, page });

/** TTCAB — Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê. Manual: 22 pages, file date 2025-09-09. */
export const ttcab: Brand = {
  id: "ttcab",
  name: "TTCAB",
  fullName: "TTCAB — Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê",
  manual: { file, pages: 22, fileDate: "2025-09-09", credit: "crismacari.com", creditSource: p(22) },
  concept: {
    text:
      "O TTCAB é o Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê, uma iniciativa com a missão de oferecer cuidado especializado e o desenvolvimento saudável desde os primeiros meses de vida.\n\n" +
      "Na identidade visual, o símbolo traz a representação de uma mão que envolve e protege, transmitindo cuidado, acolhimento e segurança. De forma estilizada, a criança aparece acomodada nesse gesto, reforçando a essência da marca: suporte profissional aliado ao afeto e à proximidade com as famílias.\n\n" +
      "A tipografia sólida e moderna, em contraste com o ícone fluído, equilibra profissionalismo e sensibilidade. O conjunto reflete a essência do trabalho do TTCAB: unir técnica e cuidado humano no tratamento e prevenção das assimetrias no bebê, além de apoiar o desenvolvimento de profissionais por meio de cursos especializados.",
    source: p(2),
  },
  colors: [
    {
      id: "orange",
      role: "primary",
      hex: "#F6A22A",
      rgb: [246, 162, 43],
      printed: { cmyk: "C:0 M:43 Y:88 K:0", rgb: "R:246 G:162 B:43", hex: "#F6A22A", pantoneCoated: "675 C", pantoneUncoated: "Strong Red U" },
      usage: "symbol — “O laranja traduz calor humano, vitalidade e proximidade”",
      source: p(4),
      manualInconsistency: "(1) The Pantone pair \"675 C / Strong Red U\" is the one printed for the magenta #AB2781 in the Creeta and RTA Mundi manuals; it does not describe an orange. (2) The printed hex #F6A22A and the printed RGB R:246 G:162 B:43 (= #F6A22B) differ by 1 in blue. Both transcribed as printed; `hex` keeps the printed hex (the one the DS symbol already uses).",
    },
    {
      id: "petrol",
      role: "primary",
      hex: "#144753",
      rgb: [20, 71, 83],
      printed: { cmyk: "C:90 M:53 Y:47 K:43", rgb: "R:20 G:71 B:83", hex: "#144753", pantoneCoated: "3035 C", pantoneUncoated: "3165 U" },
      usage: "wordmark and descriptor — “O azul profundo representa segurança, credibilidade e conhecimento técnico”",
      source: p(4),
    },
    {
      id: "yellow",
      role: "complementary",
      hex: "#FBBA00",
      rgb: [251, 186, 0],
      printed: { cmyk: "C:0 M:30 Y:94 K:0", rgb: "R:251 G:186 B:0", hex: "#FBBA00", pantoneCoated: "7549 C", pantoneUncoated: "116 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(5),
    },
    {
      id: "blue",
      role: "complementary",
      hex: "#009AB1",
      rgb: [0, 154, 177],
      printed: { cmyk: "C:78 M:18 U:27 K:2", rgb: "R:0 G:154 B:177", hex: "#009AB1", pantoneCoated: "320 C", pantoneUncoated: "320 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(5),
      manualInconsistency: "CMYK printed with \"U:27\" where the yellow channel (Y) is expected.",
    },
    {
      id: "dark-teal",
      role: "complementary",
      hex: "#086A79",
      rgb: [8, 106, 121],
      printed: { cmyk: "C:86 M:37 U:39 K:23", rgb: "R:8 G:106 B:121", hex: "#086A79", pantoneCoated: "322 C", pantoneUncoated: "322 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(5),
      manualInconsistency: "CMYK printed with \"U:39\" where the yellow channel (Y) is expected.",
    },
    {
      id: "gray",
      role: "complementary",
      hex: "#9B9B9A",
      rgb: [155, 155, 154],
      printed: { cmyk: "C:0 M:0 Y:0 K:50", rgb: "R:155 G:155 B:154", hex: "#9B9B9A", pantoneCoated: "Cool Gray 7 C", pantoneUncoated: "Black 0961 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(5),
    },
  ],
  gradients: [
    {
      stops: ["#009ab1", "#086a79"],
      source: p(6),
      manualInconsistency: "Label and swatch disagree: the label starts at #009ab1, but the bar starts dark petrol (pixel sampled at the left end of a 60 dpi render: about #144854, i.e. #144753) and ends at #086a79.",
    },
    { stops: ["#086a79", "#009ab1"], source: p(6) },
    { stops: ["#f6a22a", "#fbba00"], source: p(6) },
    { stops: ["#fbba00", "#ffffff"], source: p(6) },
  ],
  typography: {
    faces: [
      { role: "headings", family: "Quicksand", weights: ["Bold", "Book", "Light"], preferred: "Bold", rule: "Chamadas e títulos devem ser escritos com a tipografia Quicksand. Os títulos devem ser grandes e curtos, utilizando a versão Bold ou Book. A versão Light deve ser utilizada em casos de títulos e chamadas maiores.", licence: "open", source: p(3) },
      { role: "text", family: "Gotham", weights: ["Bold", "Medium", "Book"], preferred: "Book", rule: "Textos corridos utilizam a tipografia Gotham, nas versões Bold, Medium e Book, preferencialmente utilizar a versão Book.", licence: "commercial", source: p(3) },
      { role: "internet", family: "Arial", weights: ["Bold", "Regular"], rule: "Textos para a internet ou sem a possibilidade da utilização da fonte principal, devem ser utilizadas o Arial e Arial Bold.", licence: "system", source: p(3) },
    ],
    restrictions: ["Não devem ser utilizadas versões italizadas destes tipos gráficos, excetuando-se os casos de expressões em outro idioma."],
    source: p(3),
  },
  clearSpace: {
    unit: "width of the letters “TT”",
    rule: "Para garantir o impacto visual e a legibilidade da marca TTCAB, é preciso resguardar uma área em torno dela equivalente, no mínimo, a largura da junção das letras “TT”.",
    source: p(8),
  },
  reduction: {
    sizes: [
      { layout: "vertical", chancela: "with", mm: 36, source: p(9) },
      { layout: "horizontal", chancela: "with", mm: 60, source: p(9) },
      { layout: "vertical", chancela: "without", mm: 24, source: p(9) },
      { layout: "horizontal", chancela: "without", mm: 38, source: p(9) },
      { layout: "lettering", chancela: "n/a", mm: 15, source: p(9) },
    ],
    rule: "Para assegurar sua legibilidade deve ser respeitada a dimensão mínima de veiculação em materiais gráficos impressos e também na definição do uso ou não da chancela. Esta regra pode ser flexibilizada no caso de utilização em mídias digitais, porém deve ser previamente testada. Em qualquer caso, no entanto, é fundamental atentar para que todos os elementos da marca estejam em perfeita legibilidade.",
    chancelaShownAs: "On this page “com chancela” is drawn as the mark WITH the descriptor “Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê”; “lettering” is the TTCAB wordmark alone.",
    source: p(9),
  },
  monochrome: { summary: "Horizontal and vertical marks (without descriptor) in dark gray on white and in white on dark gray.", source: p(7) },
  lockupRules: [
    {
      title: "uso de marcas parceiras",
      rule: "Quando necessário inserir outras marcas parceiras juntamente com a marca TTCAB é importante estar ciente de utilizar no mesmo peso visual para ambos. Escolha corretamente entre o limite vertical ou horizontal e mantenha a área de proteção indicada para garantir a integridade da marca.",
      summary: "Partner brands (shown: Creeta) at the same visual weight as TTCAB, aligned on the vertical or horizontal limit, with TTCAB's clear space kept.",
      source: p(10),
    },
  ],
  graphicElements: [
    {
      title: "elementos gráficos",
      rule: "Os elementos gráficos da identidade TTCAB foram extraídos da geometria da tipografia, preservando cantos arredondados que transmitem suavidade, cuidado e acolhimento. Funcionam como extensões visuais da marca, podendo ser aplicados de diferentes formas para reforçar a identidade: como molduras para fotos, como contornos ou padrões sutis no background ou como destaque para palavras-chave, dados ou chamadas, garantindo hierarquia e clareza na comunicação. Além disso, essas formas podem guiar o olhar e criar movimento na composição, funcionando quase como um “fio condutor” visual.",
      summary: "Rounded-corner outline shapes taken from the geometry of the TTCAB letters (drawn as orange outlines). Uses: photo frames, outlines or subtle background patterns, highlight for keywords, data or calls; they can guide the eye like a visual thread.",
      source: p(11),
    },
  ],
  variations: [
    { name: "Vertical (symbol above “TTCAB”)", backgrounds: ["white"], ds: "Lockup stacked (TtcabSymbol + TtcabWordmark)", source: p(12) },
    { name: "Horizontal with descriptor (symbol on the right)", backgrounds: ["petrol #144753"], source: p(12) },
    { name: "Horizontal without descriptor (shown in the monochrome page and the reduction limits)", backgrounds: ["white", "dark gray"], ds: "Lockup horizontal (TtcabWordmark + TtcabSymbol, symbol on the right)", source: p(7) },
    { name: "Vertical with descriptor", backgrounds: ["orange #F6A22A", "petrol #144753"], source: p(12) },
    { name: "Symbol only", backgrounds: ["orange #F6A22A (white symbol)", "petrol #144753 (orange symbol)"], ds: "TtcabSymbol", source: p(12) },
    { name: "Lettering only “TTCAB”", backgrounds: ["white"], ds: "TtcabWordmark", source: p(12) },
  ],
  pending: [
    "No construction page in the manual.",
    "The DS has no lockup with the descriptor line drawn from the manual (Lockup takes the tagline as live text).",
    "The graphic elements (outline shapes) are not drawn in the DS.",
  ],
};
