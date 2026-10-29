import type { ElementType, ReactNode } from "react";

export type Crumb = { label: ReactNode; href: string };

type Props = {
  /** From the section the page belongs to down to the parent of the current page. */
  items: Crumb[];
  linkComponent?: ElementType;
  /** aria-label of the nav. */
  label?: string;
  className?: string;
};

// trail link: no resting underline (two underlines side by side weighed too much);
// it shows on hover and on focus
const link =
  "inline-flex min-h-11 items-center text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none";

/**
 * Breadcrumb — the trail of a novo.creeta article: "← Section › Parent", so
 * the text starts right away. The first crumb carries the back arrow; the
 * current page is not listed (its title follows).
 */
export function Breadcrumb({ items, linkComponent, label = "Trail", className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  return (
    <nav aria-label={label} className={className}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 p-0 text-sm font-semibold text-ink/80">
        {items.map((c, i) => (
          <li key={`${i}-${c.href}`} className="flex items-center gap-x-2">
            {i > 0 && (
              <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} className="text-ink/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            )}
            <L href={c.href} className={`${link} ${i === 0 ? "gap-1.5" : ""}`}>
              {i === 0 && (
                <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7M19 12H5" /></svg>
              )}
              {c.label}
            </L>
          </li>
        ))}
      </ol>
    </nav>
  );
}
