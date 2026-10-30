import type { ElementType, ReactNode } from "react";

export type ListItem = {
  label: ReactNode;
  /** With an href the item is a link: semibold, underlined, with an outbound arrow at the end. */
  href?: string;
  external?: boolean;
};

type Props = {
  items: ListItem[];
  /** `check` (default): bubble with a check — "what we assess", "what we treat".
   *  `arrow`: corner arrow (↳) — one sentence per item, as in the Footer notice. */
  marker?: "check" | "arrow";
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** sr-only after an external link. */
  newTabLabel?: string;
  className?: string;
};

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const CornerDownRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} className="mt-[0.2rem] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 10 5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" /></svg>
);
const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go ml-auto mt-1 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/**
 * The family's list with a marker in front of each item (from novo.creeta:
 * `Lista` on the method page, "O que tratamos aqui" on a treatment page, the
 * notice in the footer).
 * - check: a 24px bubble (ink at 12%) with the check; the marker is
 *   decoration, the <ul> is what says "list".
 * - arrow: the corner arrow, for one sentence per item.
 * - An item with `href` becomes a link: semibold, underline that darkens on
 *   hover, outbound arrow at the end stepping toward where it goes; 44px tap
 *   height without changing the rhythm (negative vertical margin).
 */
export function List({ items, marker = "check", linkComponent, newTabLabel = "(opens in a new tab)", className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const bubble = (
    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.12] text-ink">
      <Check />
    </span>
  );
  const mark = marker === "check" ? bubble : <CornerDownRight />;
  const gap = marker === "check" ? "gap-3" : "gap-2.5";

  // leading-snug (1.375): in a two-line item the lines stay closer than the
  // items are to each other; relaxed leading read as air inside the item (2026-10-29)
  return (
    <ul className={`list-none leading-snug ${marker === "check" ? "space-y-3 text-ink" : "space-y-2.5 text-ink/80"} ${className}`}>
      {items.map((it, i) => (
        <li key={`${i}-${it.href ?? ""}`}>
          {it.href ? (
            <L
              href={it.href}
              {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={`group/item -my-2 flex min-h-11 items-start ${gap} py-2.5 font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
            >
              {mark}
              <span className="underline decoration-ink/40 underline-offset-4 transition-[text-decoration-color] duration-150 group-hover/item:decoration-ink motion-reduce:transition-none">
                {it.label}
                {it.external && <span className="sr-only"> {newTabLabel}</span>}
              </span>
              <ArrowUpRight />
            </L>
          ) : (
            <span className={`flex items-start ${gap}`}>
              {mark}
              <span>{it.label}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

