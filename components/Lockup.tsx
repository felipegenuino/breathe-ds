import type { CSSProperties, ReactNode } from "react";
import { BreatheMark } from "./BreatheMark";

/**
 * Arranjos do logo (sistema de branding flexível da família Cuidado Global).
 * - `stacked`     empilhado: símbolo em cima, nome embaixo — perfis, splash, pôster.
 * - `horizontal`  símbolo + nome lado a lado (+ tagline) — cabeçalho, documento.
 * - `wordmark`    só texto (nome + tagline) — anúncio, quando a leitura é essencial.
 * - `symbol`      só o símbolo — favicon, ícone de app, marca d'água.
 * - `merged`      fundido: símbolo preenchido com o nome dentro — avatar, embalagem.
 */
export type LockupVariant = "stacked" | "horizontal" | "wordmark" | "symbol" | "merged";
type Size = "sm" | "md" | "lg";

/* Nome em `font-heading`; símbolo ~1.3× o corpo do nome (o anel é aberto e
   "lê" mais leve, então pede um tamanho a mais pra fechar em harmonia).
   A caixa do BreatheMark é justa ao glifo: o vão entre símbolo e nome é só o gap.
   `md` = header dos sites (símbolo de 44px, medido no creeta e no ttcab). */
const NAME: Record<Size, string> = { sm: "text-2xl", md: "text-[2.125rem]", lg: "text-[2.7rem]" };
const TAG: Record<Size, string> = { sm: "text-[0.78rem]", md: "text-sm", lg: "text-base" };
const MARK: Record<Size, number> = { sm: 32, md: 44, lg: 56 };
const GAP: Record<Size, string> = { sm: "gap-2", md: "gap-2.5", lg: "gap-3" };
const NAME_PX: Record<Size, number> = { sm: 24, md: 34, lg: 43 };
const TILE: Record<Size, string> = { sm: "size-16 text-[0.7rem]", md: "size-24 text-[0.95rem]", lg: "size-32 text-[1.3rem]" };

type Props = {
  variant?: LockupVariant;
  /** Nome da marca (cada site passa o seu). */
  name?: string;
  tagline?: ReactNode;
  /** Símbolo customizado; por padrão o BreatheMark (anel + ponto). Um <svg>
   *  injetado recebe a altura do tamanho (`size`); a largura segue a proporção. */
  logo?: ReactNode;
  /** Wordmark desenhado (svg) no lugar do nome em texto. `merged` ignora
   *  (lá o nome é texto). */
  wordmark?: ReactNode;
  /** Altura do wordmark como fração da altura do símbolo, do manual da marca
   *  (ex.: `TTCAB_LOCKUP.wordmarkPerSymbol`). Chega ao svg por `--cg-wordmark`. */
  wordmarkRatio?: number;
  /** Lado do símbolo no horizontal. Padrão `left` (creeta e os demais); o TTCAB
   *  é `right` (`TTCAB_LOCKUP.symbolSide`). */
  symbolSide?: "left" | "right";
  size?: Size;
  /** O símbolo "respira"? Padrão `false` — logo de cabeçalho não fica animando. */
  animated?: boolean;
  /** Entrada ao montar, como no header do novo.creeta: o símbolo chega
   *  primeiro, depois o nome, depois a tagline. Respeita prefers-reduced-motion
   *  (vira só um fade curto). Remonte (key) para repetir. */
  entrance?: boolean;
  /** Atraso da entrada em ms (ex.: esperar a Curtain subir). */
  entranceDelay?: number;
  className?: string;
};

/**
 * Lockup — monta o logo da família num dos arranjos acima. Neutro por tokens:
 * nome/símbolo em `ink`, tagline em `ink-soft`; a cor real vem de cada app.
 * Tipografia é fixa da família (Quicksand no nome, Figtree na tagline).
 */
export function Lockup({
  variant = "horizontal",
  name = "Breathe",
  tagline,
  logo,
  wordmark,
  wordmarkRatio = 0.5,
  symbolSide = "left",
  size = "md",
  animated = false,
  entrance = false,
  entranceDelay = 0,
  className = "",
}: Props) {
  const entranceCls = entrance ? " cg-lockup--entrance" : "";
  const entranceStyle = entrance ? ({ "--cg-entrance-delay": `${entranceDelay}ms` } as CSSProperties) : undefined;
  // No horizontal com tagline, o símbolo cobre o bloco inteiro (nome + tagline),
  // virando um "bookend" proporcional — não só a altura do nome.
  const markPx = variant === "horizontal" && tagline && symbolSide !== "right" ? Math.round(NAME_PX[size] * 2.3) : MARK[size];
  const mark = (
    <span className="cg-lockup__mark inline-flex text-ink [&>svg]:h-[var(--mark)] [&>svg]:w-auto" style={{ "--mark": `${markPx}px` } as CSSProperties}>
      {logo ?? <BreatheMark size={markPx} animated={animated} title={name} />}
    </span>
  );
  // O wordmark segue o símbolo-base do tamanho (não o "bookend" do horizontal
  // com tagline), como no logotipo assinado do creeta: nome ≈ 0.26 do símbolo grande.
  const nameEl = (
    <span
      className={`cg-lockup__name font-heading font-bold leading-none tracking-[-0.02em] text-ink ${NAME[size]}`}
      style={wordmark ? ({ "--cg-wordmark": `${Math.round(MARK[size] * wordmarkRatio * 10) / 10}px` } as CSSProperties) : undefined}
    >
      {wordmark ?? name}
    </span>
  );
  // `block`: como item inline, a entrelinha do pai (1.5 do body) mandava na
  // linha e a tagline de duas linhas ficava folgada demais.
  const tagEl = tagline ? (
    <span className={`cg-lockup__tag block font-body leading-[1.3] text-ink-soft ${TAG[size]}`}>{tagline}</span>
  ) : null;

  if (variant === "symbol") {
    return (
      <span className={`inline-flex text-ink ${className}`} role="img" aria-label={name}>
        {mark}
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={`inline-flex flex-col${entranceCls} ${className}`} style={entranceStyle}>
        {entrance && <style>{ENTRANCE_CSS}</style>}
        {nameEl}
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center text-center${entranceCls} ${className}`} style={entranceStyle}>
        {entrance && <style>{ENTRANCE_CSS}</style>}
        {mark}
        <span className="mt-4 flex flex-col items-center">
          {nameEl}
          {tagEl && <span className="mt-1.5">{tagEl}</span>}
        </span>
      </span>
    );
  }

  if (variant === "merged") {
    // Fundido: nome dentro de um disco preenchido (ink). Avatar / ícone de app.
    // Nomes curtos (creeta, ttcab) fecham melhor; nome longo reduz o corpo.
    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-2 text-center font-heading font-bold leading-none tracking-[-0.01em] text-surface ${TILE[size]} ${className}`}
        role="img"
        aria-label={name}
      >
        {name}
      </span>
    );
  }

  // horizontal (padrão). Símbolo à direita (TTCAB): encosta no nome, na mesma
  // linha; a tagline fica embaixo (senão o símbolo iria parar depois da tagline).
  if (symbolSide === "right") {
    return (
      <span className={`inline-flex flex-col items-start${entranceCls} ${className}`} style={entranceStyle}>
        {entrance && <style>{ENTRANCE_CSS}</style>}
        <span className={`inline-flex items-center ${GAP[size]}`}>
          {nameEl}
          {mark}
        </span>
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center ${GAP[size]}${entranceCls} ${className}`} style={entranceStyle}>
      {entrance && <style>{ENTRANCE_CSS}</style>}
      {mark}
      <span className="flex min-w-0 flex-col">
        {nameEl}
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    </span>
  );
}

/* Entrada: símbolo (escala + giro leve) → nome (desliza da esquerda) → tagline.
   Mesmo vocabulário da Curtain; com movimento reduzido fica só um fade curto. */
const ENTRANCE_CSS = `
.cg-lockup--entrance .cg-lockup__mark{ animation: cg-lockup-mark 500ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) var(--cg-entrance-delay,0ms) both; }
.cg-lockup--entrance .cg-lockup__name{ animation: cg-lockup-name 420ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) calc(var(--cg-entrance-delay,0ms) + 420ms) both; }
.cg-lockup--entrance .cg-lockup__tag{ animation: cg-lockup-tag 360ms ease calc(var(--cg-entrance-delay,0ms) + 700ms) both; }
@keyframes cg-lockup-mark{ from{ opacity:0; transform:scale(.6) rotate(-16deg); } }
@keyframes cg-lockup-name{ from{ opacity:0; transform:translateX(-8px); } }
@keyframes cg-lockup-tag{ from{ opacity:0; transform:translateY(4px); } }
@media (prefers-reduced-motion:reduce){
  .cg-lockup--entrance .cg-lockup__mark, .cg-lockup--entrance .cg-lockup__name, .cg-lockup--entrance .cg-lockup__tag{ animation: cg-lockup-fade 240ms ease var(--cg-entrance-delay,0ms) both; }
  @keyframes cg-lockup-fade{ from{ opacity:0; } }
}
`;
