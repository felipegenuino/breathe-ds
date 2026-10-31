import type { ComponentType, ElementType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export type TimelineStep = {
  Icon: IconType;
  title: ReactNode;
  body: ReactNode;
  /** Optional link under the body ("See the team ↗"): the family's strong
   *  link, semibold, underlined, with the outbound arrow. `external` opens a new tab. */
  link?: { label: ReactNode; href: string; external?: boolean };
};

type Props = {
  steps: TimelineStep[];
  /** Heading level of each step's title (h3 under an h2 section title). */
  headingLevel?: "h3" | "h4";
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** sr-only after an external link. */
  newTabLabel?: string;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/**
 * Timeline — the "Como cuidamos" of novo.creeta, by tokens: an ordered
 * sequence of steps, each with its own drawing (a 44px bubble with a lucide
 * icon, decoration) and a title answered by a paragraph. A thin line links
 * one drawing to the next: it is a path, from the first question to the last.
 */
export function Timeline({ steps, headingLevel = "h3", linkComponent, newTabLabel = "(opens in a new tab)", className = "" }: Props) {
  const H = headingLevel;
  const L: ElementType = linkComponent ?? "a";
  return (
    <ol className={`list-none ${className}`}>
      {steps.map(({ Icon, title, body, link }, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={i} className={`relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 ${last ? "" : "pb-7"}`}>
            {/* the line linking this drawing to the next */}
            {!last && <span aria-hidden="true" className="absolute bottom-1 left-[1.375rem] top-12 w-px -translate-x-1/2 bg-ink/15" />}
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-ink">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <div>
              <H className="m-0 pt-2 font-heading text-lg font-medium leading-snug text-ink">{title}</H>
              <p className="m-0 mt-1.5 leading-relaxed text-ink/80">{body}</p>
              {link && (
                <L
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  {link.label}
                  <ArrowUpRight />
                  {link.external && <span className="sr-only"> {newTabLabel}</span>}
                </L>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
