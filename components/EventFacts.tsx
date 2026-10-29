import type { ElementType, ReactNode } from "react";
import { MapPin } from "lucide-react";
import { DateBadge } from "./DateBadge";

export type EventFact = {
  /** A DateBadge, or an icon; "pin" draws the map pin. */
  tile: ReactNode | "pin";
  title: ReactNode;
  subtitle?: ReactNode;
  /** The title becomes a link (the venue's map page), with the arrow. */
  href?: string;
  external?: boolean;
};

type Props = {
  facts: EventFact[];
  linkComponent?: ElementType;
  newTabLabel?: string;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/** The facts of an event as tiles (Luma): the date on a calendar tile with
 *  the written date beside it, the place on a pin tile with the venue (a link)
 *  and the city. `DateBadge` is exported for the date tile. */
export function EventFacts({ facts, linkComponent, newTabLabel = "(opens in a new tab)", className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  return (
    <ul className={`flex list-none flex-col gap-4 ${className}`}>
      {facts.map((f, i) => (
        <li key={i} className="flex items-center gap-4">
          {f.tile === "pin" ? (
            <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink/[0.06] text-ink">
              <MapPin size={20} strokeWidth={2} />
            </span>
          ) : (
            f.tile
          )}
          <span className="min-w-0 leading-snug">
            <span className="block font-semibold text-ink">
              {f.href ? (
                <L href={f.href} {...(f.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex items-center gap-1 underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none">
                  {f.title}
                  <ArrowUpRight />
                  {f.external && <span className="sr-only"> {newTabLabel}</span>}
                </L>
              ) : (
                f.title
              )}
            </span>
            {f.subtitle && <span className="mt-0.5 block text-sm text-ink-body">{f.subtitle}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export { DateBadge };
