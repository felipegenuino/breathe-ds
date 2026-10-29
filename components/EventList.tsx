import type { ReactNode } from "react";
import { EventRow, type EventRowProps } from "./EventRow";

export type EventGroup = {
  /** The day ("6 Nov"). */
  date: ReactNode;
  /** The weekday, one tone below ("Friday"). */
  weekday?: ReactNode;
  /** ISO date for the <time>. */
  iso?: string;
  events: EventRowProps[];
};

type Props = {
  groups: EventGroup[];
  /** aria-label of the list. */
  label?: string;
  className?: string;
};

/**
 * Events grouped by day, down a dotted rail (Luma): each day has a dot on the
 * rail, the date and the weekday, and its rows below. One <ol> per day keeps
 * the order for the screen reader.
 */
export function EventList({ groups, label = "Events", className = "" }: Props) {
  return (
    <div aria-label={label} role="list" className={`relative ${className}`}>
      {/* the rail: a dotted line down the left */}
      <span aria-hidden="true" className="absolute bottom-6 left-[5px] top-3 w-px border-l-2 border-dotted border-ink/15" />
      {groups.map((g, i) => (
        <section key={i} role="listitem" className="relative pl-9 pb-8 last:pb-0">
          <span aria-hidden="true" className="absolute left-0 top-[7px] h-3 w-3 rounded-full bg-ink/20" />
          <h2 className="font-heading text-lg font-semibold text-ink">
            {g.iso ? <time dateTime={g.iso}>{g.date}</time> : g.date}
            {g.weekday && <span className="ml-2 font-body text-base font-normal text-ink-soft">{g.weekday}</span>}
          </h2>
          <ol className="mt-4 flex list-none flex-col gap-3">
            {g.events.map((e, j) => (
              <li key={j}>
                <EventRow {...e} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
