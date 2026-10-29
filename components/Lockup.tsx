import type { ReactNode } from "react";
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

/* Nome em `font-heading`; símbolo ~1.9× o corpo do nome (o anel é aberto e
   "lê" mais leve, então pede um tamanho a mais pra fechar em harmonia). */
const NAME: Record<Size, string> = { sm: "text-xl", md: "text-[1.75rem]", lg: "text-[2.5rem]" };
const TAG: Record<Size, string> = { sm: "text-[0.72rem]", md: "text-sm", lg: "text-base" };
const MARK: Record<Size, number> = { sm: 38, md: 54, lg: 76 };
const NAME_PX: Record<Size, number> = { sm: 20, md: 28, lg: 40 };
const TILE: Record<Size, string> = { sm: "size-16 text-[0.7rem]", md: "size-24 text-[0.95rem]", lg: "size-32 text-[1.3rem]" };

type Props = {
  variant?: LockupVariant;
  /** Nome da marca (cada site passa o seu). */
  name?: string;
  tagline?: ReactNode;
  /** Símbolo customizado; por padrão o BreatheMark (anel + ponto). */
  logo?: ReactNode;
  size?: Size;
  /** O símbolo "respira"? Padrão `false` — logo de cabeçalho não fica animando. */
  animated?: boolean;
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
  size = "md",
  animated = false,
  className = "",
}: Props) {
  // No horizontal com tagline, o símbolo cobre o bloco inteiro (nome + tagline),
  // virando um "bookend" proporcional — não só a altura do nome.
  const markPx = variant === "horizontal" && tagline ? Math.round(NAME_PX[size] * 2.6) : MARK[size];
  const mark = logo ?? <BreatheMark size={markPx} animated={animated} title={name} />;
  const nameEl = (
    <span className={`font-heading font-bold leading-none tracking-[-0.02em] text-ink ${NAME[size]}`}>
      {name}
    </span>
  );
  const tagEl = tagline ? (
    <span className={`font-body leading-tight text-ink-soft ${TAG[size]}`}>{tagline}</span>
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
      <span className={`inline-flex flex-col ${className}`}>
        {nameEl}
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center text-center ${className}`}>
        {mark}
        <span className="mt-3 flex flex-col items-center">
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

  // horizontal (padrão)
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <span className="flex min-w-0 flex-col">
        {nameEl}
        {tagEl && <span className="mt-0.5">{tagEl}</span>}
      </span>
    </span>
  );
}
