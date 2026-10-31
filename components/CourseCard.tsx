import type { ElementType, ReactNode } from "react";
import { Clock } from "lucide-react";
import { Byline, type Person } from "./Byline";
import { EventFacts, DateBadge, type EventFact } from "./EventFacts";

type Labels = {
  /** Prefix before the instructors' names ("With"). */
  with: ReactNode;
  /** The pill on the title line and the one in the button's place when sold out. */
  soldOut: ReactNode;
};
const EN: Labels = { with: "With", soldOut: "Sold out" };

type Props = {
  /** Cover photo at the top (the school's pages always have one), 4:3,
   *  focused near the top for the portrait photos the school uses. */
  cover?: { src: string; alt?: string; position?: string };
  /** The course ("Basic RTA course 2026"): the heading of the card. */
  course?: ReactNode;
  /** The class ("City · ST"): the line under the heading, with the seats pill.
   *  Without `course`, it is the heading itself. */
  title: ReactNode;
  /** The start, for the calendar tile. */
  start: { month: ReactNode; day: ReactNode };
  /** The dates: "3 to 9 November 2026 · 08:30–17:30" and, below, the extra day. */
  when: { title: ReactNode; subtitle?: ReactNode };
  /** The venue (a link to the map when it has an href) and the address. */
  where?: { title: ReactNode; subtitle?: ReactNode; href?: string; external?: boolean };
  /** "69 class hours". */
  workload?: ReactNode;
  /** Seats, as a pill on the title line ("28 seats"). */
  seats?: ReactNode;
  /** Who teaches: portraits and names, each a link when it has an href. */
  instructors?: Person[];
  /** The price beside the button ("R$ 7.280") and a small note ("up to 12 instalments"). */
  price?: { value: ReactNode; note?: ReactNode };
  /** Small note at the foot ("Only physiotherapists can attend."). */
  footnote?: ReactNode;
  /** The call to action: a Button `accent`, the one full-colour element of the card. */
  action?: ReactNode;
  /** No seats left: the pill says so and takes the button's place. */
  soldOut?: boolean;
  /** Makes the card clickable (the title becomes a button stretched over the
   *  card) to open its details, e.g. in a SidePanel. Links inside (the map,
   *  the instructors, the action) keep working on their own. */
  onSelect?: () => void;
  headingLevel?: "h2" | "h3";
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const PILL = "inline-flex items-center rounded-pill bg-tint px-2.5 py-0.5 text-xs font-semibold text-ink";

/**
 * Course card of the Cuidado Global family — the class card (ttcab's
 * "Formação", the school's class list), in the family's own vocabulary: the
 * course name as the category line, the city as the title with the seats pill
 * (as the EventRow), the facts as tiles (the DateBadge for the start, the pin
 * for the venue, a clock for the workload, as the EventFacts), who teaches as
 * a Byline, and the Button accent pinned at the foot. By tone: no border, no
 * shadow, no lift.
 */
export function CourseCard({ cover, course, title, start, when, where, workload, seats, instructors, price, footnote, action, soldOut = false, onSelect, headingLevel: Title = "h3", linkComponent, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const facts: EventFact[] = [{ tile: <DateBadge month={start.month} day={start.day} />, title: when.title, subtitle: when.subtitle }];
  if (where) facts.push({ tile: "pin", title: where.title, subtitle: where.subtitle, href: where.href, external: where.external });
  if (workload)
    facts.push({
      tile: (
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tint text-ink">
          <Clock size={20} strokeWidth={2} />
        </span>
      ),
      title: workload,
    });
  const pill = soldOut ? t.soldOut : seats;

  const foot = soldOut ? (
    <span className="inline-flex min-h-11 items-center rounded-pill bg-tint px-5 font-heading font-semibold text-ink">{t.soldOut}</span>
  ) : (
    action
  );

  return (
    <article className={`relative flex flex-col overflow-hidden rounded-[28px] bg-card ${onSelect ? "transition-transform duration-200 ease-out active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 [&_a]:relative [&_a]:z-10 [&_button]:relative [&_button]:z-10" : ""} ${className}`}>
      {cover && (
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.src} alt={cover.alt ?? ""} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: cover.position ?? "50% 25%" }} />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-7">
      {/* the course is what the person looks for: it is the heading; the city
          is the variant, on the line below with the seats pill (2026-10-29) */}
      <Title className="font-heading text-xl font-medium leading-snug text-ink md:text-[1.375rem]">
        {onSelect ? (
          // the stretched hit area of the card: this button is the exception to [&_button]:z-10 (static, after: covers the card)
          <button type="button" onClick={onSelect} className="static! z-auto! text-left after:absolute after:inset-0 after:z-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink">
            {course ?? title}
          </button>
        ) : (
          course ?? title
        )}
      </Title>
      {(course || pill) && (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
          {course && <span>{title}</span>}
          {pill && <span className={PILL}>{pill}</span>}
        </p>
      )}

      <EventFacts className="mt-5" facts={facts} linkComponent={linkComponent} />

      {instructors && instructors.length > 0 && (
        <div className="mt-5 flex items-center gap-3 text-sm text-ink-body">
          <span className="shrink-0 text-ink-soft">{t.with}</span>
          <Byline people={instructors} linkComponent={linkComponent} className="min-w-0" />
        </div>
      )}

      {footnote && <p className="mt-5 text-sm text-ink-soft">{footnote}</p>}

      {/* at the foot: the price on the left, the button on the right; cards side by side align here */}
      {(foot || price) && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-6">
          {price && (
            <p className="leading-tight">
              <span className="block font-heading text-xl font-semibold text-ink">{price.value}</span>
              {price.note && <span className="block text-sm text-ink-soft">{price.note}</span>}
            </p>
          )}
          {foot}
        </div>
      )}
      </div>
    </article>
  );
}
