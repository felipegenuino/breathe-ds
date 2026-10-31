import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

type Props = {
  /** What happened, in the product's words: "Ninguém encontrado para “Kirs”". */
  title: ReactNode;
  /** One sentence on why, or what the list contains. */
  children?: ReactNode;
  /** The fastest way out first: a "did you mean" line, a "widen the search" button. */
  recovery?: ReactNode;
  /** Short tips (spelling, fewer words). Rendered as a list. */
  tips?: ReactNode[];
  /** Actions at the foot: clear the filters, talk to the team. */
  actions?: ReactNode;
  /** Replaces the magnifier (an icon at 22px). */
  icon?: ReactNode;
  /** h2 by default; h3 inside a section that already has an h2. */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * EmptyState — what a list shows when nothing matches. Never a dead end: it
 * names what was searched, offers the nearest way out (a corrected spelling,
 * a wider filter), then tips, then a person to ask. A white card (the family's
 * solid card) so the place of the results does not go blank; left aligned,
 * because it is read, not admired.
 *
 * Render it inside an `aria-live="polite"` region (or announce the count
 * elsewhere) so a screen reader hears that the results changed.
 */
export function EmptyState({ title, children, recovery, tips, actions, icon, headingLevel: H = "h2", className = "" }: Props) {
  return (
    <div className={`rounded-[28px] bg-card p-[clamp(24px,4vw,44px)] ${className}`}>
      <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-ink">
        {icon ?? <SearchX size={22} strokeWidth={1.75} />}
      </span>
      <H className="mt-5 font-heading text-[1.375rem] leading-snug font-medium text-balance text-ink md:text-2xl">{title}</H>
      {children && <div className="mt-2 max-w-[60ch] leading-relaxed text-ink-body">{children}</div>}
      {recovery && <div className="mt-5">{recovery}</div>}
      {tips && tips.length > 0 && (
        <ul className="mt-6 max-w-[60ch] list-none space-y-2 border-t border-line pt-5">
          {tips.map((tip, i) => (
            <li key={i} className="relative pl-5 text-sm leading-relaxed text-ink-soft">
              <span aria-hidden="true" className="absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full bg-ink-soft/60" />
              {tip}
            </li>
          ))}
        </ul>
      )}
      {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
