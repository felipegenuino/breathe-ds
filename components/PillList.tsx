import type { ReactNode } from "react";
import { Button } from "./Button";

export type Pill = { label: ReactNode; href?: string };

type Props = {
  title?: ReactNode;
  items: Pill[];
  /** Link "Ver todos" opcional. */
  seeAll?: { label: ReactNode; href?: string };
};

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 flex-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/**
 * Lista de pills (ex.: "Condições que atendemos"): chips brancos com rótulo +
 * seta, em grade que quebra, e um link "Ver todos". Chip clicável vira `<a>`.
 * Estilo de card discreto do DS (borda + sombra suaves), raio pill.
 */
export function PillList({ title, items, seeAll }: Props) {
  return (
    <div>
      {title && (
        <h2 className="mb-6 font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
      )}
      <ul className="flex flex-wrap gap-2.5">
        {items.map((p, i) => {
          const inner = (
            <>
              <span>{p.label}</span>
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-ink/[0.06] text-ink-soft transition-colors group-hover:bg-ink/[0.1] group-hover:text-ink">
                <ArrowUpRight />
              </span>
            </>
          );
          const cls =
            "group inline-flex items-center gap-3 rounded-pill border border-line bg-surface py-2 pr-2 pl-5 font-heading text-[0.98rem] font-semibold text-ink shadow-[0_2px_10px_rgba(20,71,83,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(20,71,83,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
          return (
            <li key={i}>
              {p.href ? (
                <a href={p.href} className={cls}>
                  {inner}
                </a>
              ) : (
                <span className={cls}>{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
      {seeAll && (
        <div className="mt-6">
          {seeAll.href ? (
            <Button href={seeAll.href} variant="link">{seeAll.label} <ArrowUpRight /></Button>
          ) : (
            <Button variant="link">{seeAll.label} <ArrowUpRight /></Button>
          )}
        </div>
      )}
    </div>
  );
}
