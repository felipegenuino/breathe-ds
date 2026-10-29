import type { ReactNode } from "react";

type Props = {
  /** Section numeral (e.g. "01"). */
  num?: string;
  children: ReactNode;
};

/**
 * Numbered section overline (e.g. "01 — TRATAMENTO"), the family's standard.
 * Numeral in `action-text`, uppercase label in `ink-soft`. No dependencies.
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
