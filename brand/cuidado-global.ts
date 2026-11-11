import type { Brand } from "./types";

const file = "cuidado-global-manual.pdf";
const p = (page: number) => ({ file, page });

/** Cuidado Global — the "mother" brand. Manual: 23 pages, file date 2023-01-25. */
export const cuidadoGlobal: Brand = {
  id: "cuidado-global",
  name: "Cuidado Global",
  fullName: "cuidado global",
  manual: { file, pages: 23, fileDate: "2023-01-25", credit: "crismacari.com", creditSource: p(23) },
  concept: {
    text:
      "Empresa que conecta cursos e eventos na área da saúde com credibilidade na habilitação de profissionais. A Cuidado Global é a marca “mãe” e proprietária de outras identidades, onde é dela que se define os princípios essenciais e como o conteúdo forma a base de toda a comunicação.\n\n" +
      "A construção do design com uma tipografia estilizada, sem serifa e onde as linhas retas contrastam com as bordas arredondadas, traz um conceito moderno e minimalista, capaz de construir relação de confiança e agregar com a versatilidade de uso independente ou a versão de chancela nas submarcas.\n\n" +
      "O símbolo da curvatura traduz a base que engloba todos os serviços prestados, já o ponto representa a conexão e contato com as demais marcas, e juntamente com a paleta de tons sóbrios, a identidade ao todo reforça a autoridade e referência no mercado.",
    keywords: [
      "conexão e contato com as demais marcas",
      "contraste das linhas retas com bordas arredondadas",
      "fonte geométrica e caixa baixa traz proximidade",
      "base que engloba todos os serviços prestados",
    ],
    source: p(2),
  },
  construction: { summary: "Construction grid of the two-line lowercase wordmark; the arc under the \"o\" of \"global\" is drawn from circles (page 4, drawing only, no written rule).", source: p(4) },
  colors: [
    {
      id: "petrol",
      role: "primary",
      hex: "#144753",
      rgb: [20, 71, 83],
      printed: { cmyk: "C:90 M:53 Y:47 K:43", rgb: "R:20 G:71 B:83", hex: "#144753", pantoneCoated: "3035 C", pantoneUncoated: "3165 U" },
      usage: "wordmark letters",
      source: p(6),
    },
    {
      id: "light-cyan",
      role: "primary",
      hex: "#62C2D0",
      rgb: [98, 194, 208],
      printed: { cmyk: "C:60 M:0 U:20 K:0", rgb: "R:98 G:194 B:208", hex: "#62c2d0", pantoneCoated: "325 C", pantoneUncoated: "630 U" },
      usage: "the dot of the \"i\" and the arc under the \"o\"",
      source: p(6),
      manualInconsistency: "CMYK printed with \"U:20\" where the yellow channel (Y) is expected.",
    },
    {
      id: "dark-gray",
      role: "complementary",
      hex: "#3C3C3C",
      rgb: [60, 60, 60],
      printed: { cmyk: "C:0 M:0 Y:0 K:90", rgb: "R:60 G:60 B:60", hex: "#3c3c3c", pantoneCoated: "179-14 C", pantoneUncoated: "179-14 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(7),
    },
    {
      id: "light-gray",
      role: "complementary",
      hex: "#DADADA",
      rgb: [218, 218, 218],
      printed: { cmyk: "C:0 M:0 Y:0 K:20", rgb: "R:218 G:218 B:218", hex: "#dadada", pantoneCoated: "179-3 C", pantoneUncoated: "179-3 U" },
      usage: "“fundos, transparências e elementos gráficos”",
      source: p(7),
    },
  ],
  gradients: [
    { stops: ["#3c3c3c", "#144753"], source: p(8) },
    { stops: ["#3c3c3c", "#dadada"], source: p(8) },
    { stops: ["#144753", "#62c2d0"], source: p(8) },
    { stops: ["#62c2d0", "#dadada"], source: p(8) },
  ],
  typography: {
    faces: [
      { role: "headings", family: "Mouser", weights: ["Regular"], rule: "Chamadas e títulos devem ser escritos com a tipografia Mouser.", licence: "commercial", source: p(5) },
      { role: "text", family: "Gotham", weights: ["Bold", "Medium", "Book"], preferred: "Book", rule: "Textos corridos utilizam a tipografia Gotham, nas versões Bold, Medium e Book, preferencialmente utilizar a versão Book.", licence: "commercial", source: p(5) },
      { role: "internet", family: "Arial", weights: ["Bold", "Regular"], rule: "Textos para a internet ou sem a possibilidade da utilização da fonte principal, devem ser utilizadas o Arial e Arial Bold.", licence: "system", source: p(5) },
    ],
    restrictions: ["Não devem ser utilizadas versões italizadas destes tipos gráficos, excetuando-se os casos de expressões em outro idioma."],
    source: p(5),
  },
  clearSpace: {
    unit: "width of the letters “glo”",
    rule: "Para garantir o impacto visual e a legibilidade da marca Cuidado Global, é preciso resguardar uma área em torno dela equivalente, no mínimo, a largura da junção das letras “glo”.",
    source: p(10),
  },
  reduction: {
    sizes: [
      { layout: "horizontal", chancela: "n/a", mm: 50, source: p(11) },
      { layout: "vertical", chancela: "n/a", mm: 30, source: p(11) },
    ],
    rule: "Para assegurar sua legibilidade deve ser respeitada a dimensão mínima de veiculação em materiais gráficos impressos e também na definição do uso ou não da chancela. Esta regra pode ser flexibilizada no caso de utilização em mídias digitais, porém deve ser previamente testada. Em qualquer caso, no entanto, é fundamental atentar para que todos os elementos da marca estejam em perfeita legibilidade.",
    source: p(11),
  },
  monochrome: { summary: "Vertical and horizontal wordmark in dark gray on white, and in white on dark gray.", source: p(9) },
  lockupRules: [
    {
      title: "uso da arquitetura das submarcas",
      rule: "Quando necessário inserir as submarcas juntamente com a identidade Cuidado Global é importante estar ciente de utilizar no mesmo peso visual para ambas as submarcas. Escolha corretamente entre o limite vertical ou horizontal e mantenha a área de proteção para garantir a integridade da marca.",
      summary: "Cuidado Global next to its sub-brands (shown: Creeta and RTA): same visual weight for every sub-brand; pick the vertical or the horizontal arrangement (vertical: Cuidado Global, a vertical rule, then the sub-brands; horizontal: Cuidado Global above a horizontal rule, sub-brands below) and keep the clear space.",
      source: p(12),
    },
    {
      title: "uso da marca como chancela",
      rule: "A marca da Cuidado Global e as submarcas atuam de forma independente uma das outras, porém quando houver a necessidade de informar a localização ou reforçar a associação entre elas, a Cuidado Global pode ser utilizada como chancela para reforçar a hierarquia. A versão a ser utilizada como chancela será sempre a horizontal.",
      summary: "The brands are independent. When the association must be shown, Cuidado Global goes under the sub-brand as an endorsement (chancela), always in its horizontal version (shown under the Creeta and RTA vertical marks).",
      source: p(13),
    },
  ],
  graphicElements: { status: "pending", reason: "The manual has no graphic elements page." },
  variations: [
    { name: "Vertical (two lines: “cuidado” / “global”)", backgrounds: ["white", "petrol #144753", "light cyan #62C2D0", "dark gray #3C3C3C"], source: p(14) },
    { name: "Horizontal (one line)", backgrounds: ["petrol #144753", "light cyan #62C2D0", "dark gray #3C3C3C"], source: p(14) },
    { name: "Symbol only (the “o” ring with the arc under it)", backgrounds: ["light cyan #62C2D0", "dark gray #3C3C3C", "petrol #144753", "white"], source: p(14) },
  ],
  pending: [
    "No vector of the Cuidado Global wordmark or symbol in the DS (needs the official .ai/.svg; not redrawn).",
    "No DS palette (tokens) for Cuidado Global.",
    "No graphic elements page in the manual.",
  ],
};
