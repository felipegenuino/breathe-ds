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
  /** Small line above the title: the course name ("Basic course"). */
  course?: ReactNode;
  /** "City · ST". */
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
  /** Small note at the foot ("Only physiotherapists can attend."). */
  footnote?: ReactNode;
  /** The call to action: a Button `accent`, the one full-colour element of the card. */
  action?: ReactNode;
  /** No seats left: the pill says so and takes the button's place. */
  soldOut?: boolean;
  headingLevel?: "h2" | "h3";
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const PILL = "inline-flex items-center rounded-pill bg-ink/[0.08] px-2.5 py-0.5 text-xs font-semibold text-ink";

/**
 * Course card of the Cuidado Global family — the class card (ttcab's
 * "Formação", the school's class list), in the family's own vocabulary: the
 * course name as the category line, the city as the title with the seats pill
 * (as the EventRow), the facts as tiles (the DateBadge for the start, the pin
 * for the venue, a clock for the workload, as the EventFacts), who teaches as
 * a Byline, and the Button accent pinned at the foot. By tone: no border, no
 * shadow, no lift.
 */
export function CourseCard({ course, title, start, when, where, workload, seats, instructors, footnote, action, soldOut = false, headingLevel: Title = "h3", linkComponent, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const facts: EventFact[] = [{ tile: <DateBadge month={start.month} day={start.day} />, title: when.title, subtitle: when.subtitle }];
  if (where) facts.push({ tile: "pin", title: where.title, subtitle: where.subtitle, href: where.href, external: where.external });
  if (workload)
    facts.push({
      tile: (
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink/[0.06] text-ink">
          <Clock size={20} strokeWidth={2} />
        </span>
      ),
      title: workload,
    });
  const pill = soldOut ? t.soldOut : seats;

  return (
    <article className={`flex flex-col rounded-[28px] bg-card p-6 md:p-7 ${className}`}>
      {course && <p className="mb-2 text-sm font-semibold text-ink-soft">{course}</p>}
      <Title className="font-heading text-xl font-medium leading-snug text-ink md:text-[1.375rem]">
        {title}
        {pill && <span className={`${PILL} ml-2 translate-y-[-2px] align-middle`}>{pill}</span>}
      </Title>

      <EventFacts className="mt-5" facts={facts} linkComponent={linkComponent} />

      {instructors && instructors.length > 0 && (
        <div className="mt-5 flex items-center gap-3 text-sm text-ink-body">
          <span className="shrink-0 text-ink-soft">{t.with}</span>
          <Byline people={instructors} linkComponent={linkComponent} className="min-w-0" />
        </div>
      )}

      {footnote && <p className="mt-5 text-sm text-ink-soft">{footnote}</p>}

      {/* at the foot: cards side by side align their buttons */}
      {soldOut ? (
        <p className="mt-auto pt-6">
          <span className="inline-flex min-h-11 items-center rounded-pill bg-ink/[0.08] px-5 font-heading font-semibold text-ink">{t.soldOut}</span>
        </p>
      ) : (
        action && <div className="mt-auto pt-6">{action}</div>
      )}
    </article>
  );
}
