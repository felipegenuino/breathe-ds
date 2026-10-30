"use client";

import { version as REACT_VERSION, useId, useState, type ReactNode } from "react";

const INERT_ON = parseInt(REACT_VERSION, 10) >= 19 ? true : "";

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

type Props = {
  items: AccordionItem[];
  /** id open initially (default: the first). null = all closed. */
  defaultOpenId?: string | null;
  /** true (default): only one open at a time, as on creeta. */
  single?: boolean;
};

/**
 * Accordion / collapse of the Cuidado Global family. Cards in `surface` with
 * `line` border, `ink` title and a chevron that rotates on open. No app
 * dependency: the icon is an inline SVG. Animates height with the grid-rows
 * trick (0fr→1fr), without measuring anything in JS, and respects
 * prefers-reduced-motion.
 *
 * Colors: `ink` text on `surface` (contrast of the role defined by the site).
 * Consumes the tokens via Tailwind classes (surface/ink/line) — see theme.css.
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
            // the Perguntas of novo.creeta: a white card (bg-card), 22px radius, no border — it reads by tone over the page
            className="overflow-hidden rounded-[22px] bg-card px-5 md:px-7"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 py-1 text-left font-heading text-lg font-medium text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <span>{it.title}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 flex-none text-ink transition-transform duration-200 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
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
            {/* grid-rows 0fr→1fr: animates height without measuring in JS */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              // closed panel out of the tab order: React 19 takes `inert` as a boolean (an empty
              // string there means false); React 18 does not know it and needs the empty string
              {...({ inert: isOpen ? undefined : INERT_ON } as Record<string, unknown>)}
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {/* full-width item, reading-width body (max-w-2xl), as the Perguntas of novo.creeta */}
                <div className="max-w-2xl pb-5 leading-relaxed text-ink/80">
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
