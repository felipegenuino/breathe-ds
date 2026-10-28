"use client";

import { useState, type ReactNode, type ElementType } from "react";

export type BottomItem = {
  label: ReactNode;
  href?: string;
  icon: ReactNode;
  active?: boolean;
};
export type MoreItem = {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  description?: ReactNode;
  external?: boolean;
};

type Props = {
  items: BottomItem[];
  /** Painel "Mais" (lista extra que não cabe na barra). */
  more?: { label?: ReactNode; items: MoreItem[] };
  linkComponent?: ElementType;
};

function MoreIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  );
}
function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
  );
}

/**
 * Navegação flutuante inferior (mobile/tablet; some no lg+). Barra petróleo
 * arredondada com ícone + rótulo; o item ativo vira uma pílula clara. Um botão
 * "Mais" abre um painel com os itens que não cabem na barra (com ícone,
 * descrição e marcação de link externo). Deps injetáveis (ícones por slot,
 * `Link` por `linkComponent`).
 */
export function BottomNav({ items, more, linkComponent }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const [openMore, setOpenMore] = useState(false);

  const Cell = ({ it }: { it: BottomItem }) => {
    const inner = (
      <>
        <span aria-hidden="true">{it.icon}</span>
        <span className="text-[0.7rem] font-semibold">{it.label}</span>
      </>
    );
    const cls = `flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2.5 py-2 ${
      it.active ? "bg-surface text-ink" : "text-surface/85"
    }`;
    return it.href ? (
      <L href={it.href} aria-current={it.active ? "page" : undefined} className={cls}>
        {inner}
      </L>
    ) : (
      <span className={cls}>{inner}</span>
    );
  };

  return (
    <>
      {/* Painel "Mais" */}
      {more && openMore && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpenMore(false)}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          />
          <div className="fixed inset-x-3 bottom-[88px] z-50 rounded-3xl border border-line bg-surface p-2 shadow-[0_24px_48px_-16px_rgba(20,71,83,0.5)] lg:hidden">
            <ul className="list-none divide-y divide-line">
              {more.items.map((m, i) => (
                <li key={i}>
                  <L
                    href={m.href}
                    onClick={() => setOpenMore(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-ink/[0.05]"
                  >
                    {m.icon && (
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ink/[0.08] text-ink">
                        {m.icon}
                      </span>
                    )}
                    <span className="flex-1">
                      <span className="block font-heading text-[1.05rem] font-semibold text-ink">
                        {m.label}
                      </span>
                      {m.description && (
                        <span className="block text-sm text-ink-soft">{m.description}</span>
                      )}
                    </span>
                    {m.external && <span className="text-ink-soft"><ArrowUpRight /></span>}
                  </L>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Barra */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between gap-1 rounded-3xl bg-ink px-2 py-2 text-surface shadow-[0_18px_40px_-12px_rgba(20,71,83,0.6)] lg:hidden"
      >
        {items.map((it, i) => (
          <Cell key={i} it={it} />
        ))}
        {more && (
          <button
            type="button"
            aria-expanded={openMore}
            onClick={() => setOpenMore((o) => !o)}
            className={`flex min-w-14 flex-col items-center gap-1 rounded-2xl px-2.5 py-2 ${openMore ? "bg-surface text-ink" : "text-surface/85"}`}
          >
            <MoreIcon />
            <span className="text-[0.7rem] font-semibold">{more.label ?? "Mais"}</span>
          </button>
        )}
      </nav>
    </>
  );
}
