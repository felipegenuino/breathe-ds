import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export type TimelineStep = {
  Icon: IconType;
  title: ReactNode;
  body: ReactNode;
};

type Props = {
  steps: TimelineStep[];
  /** Heading level of each step's title (h3 under an h2 section title). */
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * Timeline — the "Como cuidamos" of novo.creeta, by tokens: an ordered
 * sequence of steps, each with its own drawing (a 44px bubble with a lucide
 * icon, decoration) and a title answered by a paragraph. A thin line links
 * one drawing to the next: it is a path, from the first question to the last.
 */
export function Timeline({ steps, headingLevel = "h3", className = "" }: Props) {
  const H = headingLevel;
  return (
    <ol className={`list-none ${className}`}>
      {steps.map(({ Icon, title, body }, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={i} className={`relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 ${last ? "" : "pb-7"}`}>
            {/* the line linking this drawing to the next */}
            {!last && <span aria-hidden="true" className="absolute bottom-1 left-[1.375rem] top-12 w-px -translate-x-1/2 bg-ink/15" />}
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.12] text-ink">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <div>
              <H className="m-0 pt-2 font-heading text-lg font-medium leading-snug text-ink">{title}</H>
              <p className="m-0 mt-1.5 leading-relaxed text-ink/80">{body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
