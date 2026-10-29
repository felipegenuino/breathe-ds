"use client";

import { useId, useState, type ReactNode } from "react";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

type Props = {
  items: AccordionItem[];
  /** id aberto inicialmente (padrão: o primeiro). null = todos fechados. */
  defaultOpenId?: string | null;
  /** true (padrão): só um aberto por vez, como no creeta. */
  single?: boolean;
};

/**
 * Accordion / collapse da família Cuidado Global. Cartões em `surface` com
 * borda `line`, título `ink` e chevron que gira ao abrir. Sem dependência de
 * app: o ícone é um SVG inline. Anima a altura pelo truque grid-rows (0fr→1fr),
 * sem medir nada em JS, e respeita prefers-reduced-motion.
 *
 * Cores: texto `ink` sobre `surface` (contraste do papel definido pelo site).
 * Consome os tokens via classes do Tailwind (surface/ink/line) — ver theme.css.
 */
export function Accordion({ items, defaultOpenId, single = true }: Props) {
  const initial =
    defaultOpenId === null
      ? []
      : [defaultOpenId ?? items[0]?.id].filter(Boolean as never as (x: string | undefined) => x is string);
  const [open, setOpen] = useState<string[]>(initial);
  const baseId = useId();

  const toggle = (id: string) => {
    setOpen((cur) => {
      const isOpen = cur.includes(id);
      if (single) return isOpen ? [] : [id];
      return isOpen ? cur.filter((x) => x !== id) : [...cur, id];
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        const btnId = `${baseId}-btn-${it.id}`;
        const panelId = `${baseId}-panel-${it.id}`;
        return (
          <div
            key={it.id}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className="flex w-full items-center justify-between gap-4 px-[clamp(18px,3vw,28px)] py-[clamp(16px,2.4vw,22px)] text-left font-heading text-[1.05rem] font-semibold text-ink transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
              >
                <span>{it.title}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 flex-none text-ink-soft transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </h3>
            {/* grid-rows 0fr→1fr: anima a altura sem medir em JS */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              // React 18 não conhece `inert` como booleano: string vazia liga, undefined desliga (no 19 o booleano funciona igual).
              {...({ inert: isOpen ? undefined : "" } as Record<string, unknown>)}
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-[clamp(18px,3vw,28px)] pt-0 pb-[clamp(18px,2.6vw,26px)] text-ink-body">
                  {it.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
