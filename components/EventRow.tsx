import type { ElementType, ReactNode } from "react";
import { MapPin } from "lucide-react";
import { Avatar } from "./Avatar";
import type { Person } from "./Byline";

type Labels = {
  /** "+34" pill after the stacked portraits. */
  more: (n: number) => string;
  /** Prefix of the organizer line ("By"). */
  by: ReactNode;
};
const EN: Labels = { more: (n) => `+${n}`, by: "By" };

// the hit area of the row: the title's link or button, stretched over it
const STRETCH = "after:absolute after:inset-0 after:rounded-[24px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink";

export type EventRowProps = {
  /** The time line ("09:00 · 12:00 GMT+0", or "3 to 9 Nov · 08:30–17:30"). */
  time: ReactNode;
  /** The end of the time line, in the soft action tone (Luma shows the end
   *  time this way). Optional. */
  timeAccent?: ReactNode;
  title: ReactNode;
  /** The event's page. With `onSelect` instead, the row opens its details in place. */
  href?: string;
  /** Makes the title a button stretched over the row (a SidePanel opens, say). */
  onSelect?: () => void;
  /** Who organizes or teaches: small portrait(s) and the name(s). */
  organizers?: Person[];
  location?: ReactNode;
  /** Who is going (or who teaches, on a course): stacked portraits and "+N". */
  people?: Person[];
  /** How many beyond the portraits shown. */
  peopleMore?: number;
  /** Square cover on the right (1:1). */
  cover?: { src: string; alt?: string };
  /** A small state on the title line ("Sold out", "Online"). */
  badge?: ReactNode;
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

/**
 * Event row of the Cuidado Global family (after Luma and Meetup): the time
 * line, the title (the link, stretched over the whole row), who organizes,
 * where, who is going, and the square cover on the right. Lives in an
 * EventList, under a date heading.
 */
export function EventRow({ time, timeAccent, title, href, onSelect, organizers, location, people, peopleMore, cover, badge, linkComponent, labels, className = "" }: EventRowProps) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  const shown = people?.slice(0, 4) ?? [];
  return (
    <article className={`group relative flex gap-5 rounded-[24px] bg-card p-5 transition-transform duration-200 ease-out active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 md:p-6 ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-sm font-medium text-ink-soft">
          {time}
          {timeAccent && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="font-semibold text-action-text">{timeAccent}</span>
            </>
          )}
        </p>
        <h3 className="mt-1.5 font-heading text-xl font-medium leading-snug text-ink md:text-[1.375rem]">
          {onSelect ? (
            <button type="button" onClick={onSelect} className={`text-left ${STRETCH}`}>
              {title}
            </button>
          ) : (
            <L href={href} className={STRETCH}>
              {title}
            </L>
          )}
          {badge && <span className="ml-2 inline-flex translate-y-[-2px] items-center rounded-pill bg-tint px-2.5 py-0.5 align-middle text-xs font-semibold text-ink">{badge}</span>}
        </h3>
        {organizers && organizers.length > 0 && (
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-body">
            <span className="flex -space-x-1.5">
              {organizers.slice(0, 3).map((p) => (
                <Avatar key={p.name} name={p.name} photo={p.photo} size={20} ring>{p.avatar}</Avatar>
              ))}
            </span>
            <span className="truncate">{t.by} {organizers.map((p) => p.name).join(", ")}</span>
          </p>
        )}
        {location && (
          <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-body">
            <MapPin aria-hidden="true" size={16} strokeWidth={2} className="shrink-0 text-ink-soft" />
            <span className="truncate">{location}</span>
          </p>
        )}
        {shown.length > 0 && (
          <p className="mt-auto flex items-center gap-2 pt-4">
            <span className="flex -space-x-2">
              {shown.map((p) => (
                <Avatar key={p.name} name={p.name} photo={p.photo} size={28} ring>{p.avatar}</Avatar>
              ))}
            </span>
            {peopleMore ? <span className="rounded-pill bg-tint px-2 py-0.5 text-xs font-semibold text-ink">{t.more(peopleMore)}</span> : null}
            <span className="sr-only">{shown.map((p) => p.name).join(", ")}</span>
          </p>
        )}
      </div>
      {cover && (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-tint md:h-36 md:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.src} alt={cover.alt ?? ""} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}
    </article>
  );
}
