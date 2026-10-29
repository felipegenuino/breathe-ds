"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";

/**
 * Rows — the list of equal rows at the foot of a card (the Trajectory /
 * Guidance / Instagram block of novo.creeta's ProfessionalCard), made generic.
 *
 * `RowList` draws the hairlines; each child is a `CollapseRow` (opens in place:
 * a text, or a list of links with the count beside the label) or a `LinkRow`
 * (goes somewhere). The arrow follows the family's Pill: ↗ another page, ↓ an
 * anchor on this page; `external` only adds the new tab. Every row is 48px
 * tall for the finger, label in `ink` on `card` (creeta's petrol on white: 10.2:1).
 */

/** One row: label left, glyph right, 48px tall. */
export const ROW =
  "flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden";

const OPEN_CHEVRON =
  "shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none";

/** What appears out of nowhere (the content of a <details>) fades in briefly
 *  instead of jumping on screen: `@starting-style` via Tailwind's `starting:`
 *  variant, no JavaScript. Browsers without support show it at once. */
export const FADE_IN = "transition-[opacity,translate] duration-[220ms] ease-[var(--ease-cg)] starting:opacity-0 starting:-translate-y-1";

const ROW_LINK_ITEM =
  "flex min-h-11 items-center justify-between gap-3 py-1.5 text-sm leading-snug text-ink-soft underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none";

export type RowListProps = ComponentPropsWithoutRef<"div">;

/** The hairlines: a line above the first row and between rows. */
export function RowList({ className = "", ...rest }: RowListProps) {
  return <div className={`divide-y divide-ink/10 border-t border-ink/10 ${className}`} {...rest} />;
}

export type RowLink = {
  label: ReactNode;
  href: string;
  /** ↗ another page (default) or ↓ an anchor on this page. */
  arrow?: "go" | "down";
  /** Opens in a new tab (target=_blank). The arrow stays ↗. */
  external?: boolean;
};

function Arrow({ arrow = "go", size }: { arrow?: "go" | "down"; size: number }) {
  return arrow === "down" ? (
    <ArrowDown aria-hidden="true" size={size} className="cg-arrow-down shrink-0" />
  ) : (
    <ArrowUpRight aria-hidden="true" size={size} className="cg-arrow-go shrink-0" />
  );
}

export type CollapseRowProps = Omit<ComponentPropsWithoutRef<"details">, "children"> & {
  label: ReactNode;
  /** Read by screen readers right after the label (e.g. " of Person name"). */
  srLabel?: ReactNode;
  /** Number beside the label. With `links` it defaults to their count. */
  count?: number;
  /** A list of links as the content: one row per link, with the arrow. */
  links?: RowLink[];
  /** Link component of the app for `links` (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** Free content (a string becomes one paragraph). Ignored with `links`. */
  children?: ReactNode;
};

/** A row that opens in place: a native <details>, no JavaScript. */
export function CollapseRow({ label, srLabel, count, links, linkComponent, children, className = "", ...rest }: CollapseRowProps) {
  const L: ElementType = linkComponent ?? "a";
  const n = count ?? links?.length;
  return (
    <details className={`group ${className}`} {...rest}>
      <summary className={ROW}>
        <span>
          {label}
          {srLabel && <span className="sr-only">{srLabel}</span>}
          {n !== undefined && <span className="ml-2 font-normal text-ink/80">{n}</span>}
        </span>
        <ChevronDown aria-hidden="true" size={18} className={OPEN_CHEVRON} />
      </summary>
      {links ? (
        <ul className={`${FADE_IN} pb-2`}>
          {links.map((g, i) => (
            <li key={`${i}-${g.href}`}>
              <L href={g.href} className={ROW_LINK_ITEM} {...(g.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {g.label}
                <Arrow arrow={g.arrow} size={16} />
              </L>
            </li>
          ))}
        </ul>
      ) : typeof children === "string" ? (
        <p className={`${FADE_IN} pb-4 text-sm leading-relaxed text-ink/80`}>{children}</p>
      ) : (
        <div className={`${FADE_IN} space-y-3 pb-4 text-sm leading-relaxed text-ink/80`}>{children}</div>
      )}
    </details>
  );
}

export type LinkRowProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  label: ReactNode;
  href: string;
  /** Read by screen readers right after the label (e.g. " of Person name (opens in a new tab)"). */
  srLabel?: ReactNode;
  /** ↗ another page (default) or ↓ an anchor on this page. */
  arrow?: "go" | "down";
  /** Opens in a new tab (target=_blank). The arrow stays ↗. */
  external?: boolean;
  /** Replaces the arrow (an 18px glyph; the slot is `ink-soft`). */
  icon?: ReactNode;
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
};

/** A row that goes somewhere: the label and, on the right, the arrow or an icon. */
export function LinkRow({ label, href, srLabel, arrow, external = false, icon, linkComponent, className = "", ...rest }: LinkRowProps) {
  const L: ElementType = linkComponent ?? "a";
  return (
    <L href={href} className={`${ROW} ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      <span>
        {label}
        {srLabel && <span className="sr-only">{srLabel}</span>}
      </span>
      <span className="flex shrink-0 text-ink-soft">{icon ?? <Arrow arrow={arrow} size={18} />}</span>
    </L>
  );
}
