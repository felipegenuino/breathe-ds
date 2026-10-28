import type { ReactNode } from "react";

type Props = {
  /** Numeral da seção (ex.: "01"). */
  num?: string;
  children: ReactNode;
};

/**
 * Sobrelinha de seção numerada (ex.: "01 — TRATAMENTO"), padrão da família.
 * Numeral em `action-text`, rótulo em `ink-soft` caixa-alta. Sem dependência.
 */
export function SectionKicker({ num, children }: Props) {
  return (
    <p className="mb-[clamp(20px,3vw,40px)] flex items-center gap-3 font-heading text-[0.82rem] font-bold tracking-[0.18em] uppercase">
      {num && (
        <span className="text-[1.6rem] leading-none font-bold tracking-normal text-action-text">
          {num}
        </span>
      )}
      <span aria-hidden="true" className="h-px w-8 bg-line" />
      <span className="text-ink-soft">{children}</span>
    </p>
  );
}
