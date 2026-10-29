import type { ElementType, ReactNode } from "react";
import { Byline, type Person } from "./Byline";

export type CourseRow = {
  /** Small uppercase label ("When", "Where", "Workload"). */
  label: ReactNode;
  /** One or more lines. */
  lines: ReactNode[];
  /** A line in the soft tone ("Venue to be confirmed"). */
  muted?: boolean;
};

type Labels = {
  /** Eyebrow of the instructors' byline ("Who teaches"). */
  instructors: ReactNode;
  /** The pill that takes the button's place when the class is sold out. */
  soldOut: ReactNode;
};
const EN: Labels = { instructors: "Who teaches", soldOut: "Sold out" };

type Props = {
  /** Small line above the year: the name of the course ("Basic RTA course"). */
  course?: ReactNode;
  /** The big number at the top: the year of the class. In action-text, large. */
  year: ReactNode;
  /** "City · ST". */
  title: ReactNode;
  /** Small line under the title ("Limited seats"). */
  note?: ReactNode;
  /** Definition rows with hairlines between them. */
  rows: CourseRow[];
  /** Factual note at the foot, with a dot in the action colour ("Only physiotherapists can attend."). */
  footnote?: ReactNode;
  /** Who teaches the class: stacked portraits and the names (a Byline), each
   *  one a link to the person's card when it has an href. */
  instructors?: Person[];
  /** The call to action: a Button `accent` (one hot element per card). */
  action?: ReactNode;
  /** No seats left: the year goes to the soft tone and a pill takes the
   *  button's place. The information stays readable (no fading). */
  soldOut?: boolean;
  headingLevel?: "h2" | "h3";
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const ROW = "border-t border-ink/10 py-[18px]";
const LABEL = "font-body text-[0.8rem] font-medium tracking-[0.22em] text-ink-soft uppercase";
const VALUE = "mt-1.5 text-base leading-[1.7] text-ink-body";

/**
 * Course card of the Cuidado Global family — the class card of ttcab's
 * "Formação" section, by tokens and by the action-colour dose: the year is
 * the only large thing in the action family (action-text), the rows sit on
 * neutral hairlines, the footnote carries a dot in the action colour and the
 * button is the one full-colour element. The card reads by tone (bg-card):
 * no border, no shadow, no lift.
 */
export function CourseCard({ course, year, title, note, rows, footnote, instructors, action, soldOut = false, headingLevel: Title = "h3", linkComponent, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  return (
    <article className={`flex flex-col rounded-[28px] bg-card p-[clamp(28px,4vw,44px)] ${className}`}>
      {course && <p className="mb-3 font-body text-[0.8rem] font-medium tracking-[0.22em] text-ink-soft uppercase">{course}</p>}
      <Title>
        <span className={`block font-heading text-[clamp(2.7rem,4.5vw,3.5rem)] leading-none font-bold tracking-[-0.02em] ${soldOut ? "text-ink-soft" : "text-action-text"}`}>{year}</span>
        <span className="mt-2.5 block font-heading text-[clamp(1.25rem,1.9vw,1.5rem)] leading-[1.3] font-bold text-ink">{title}</span>
        {note && <span className="mt-2 block font-body text-[0.9rem] leading-[1.5] text-ink-soft">{note}</span>}
      </Title>

      <dl className="mt-7">
        {rows.map((r, i) => (
          <div key={i} className={`${ROW} ${i === rows.length - 1 ? "border-b" : ""}`}>
            <dt className={LABEL}>{r.label}</dt>
            <dd className={`${VALUE} ${r.muted ? "text-ink-soft" : ""}`}>
              {r.lines.map((line, j) => (
                <span key={j} className="block">{line}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {instructors && instructors.length > 0 && (
        <Byline className="mt-6" eyebrow={t.instructors} people={instructors} linkComponent={linkComponent} />
      )}

      {footnote && (
        <p className="mt-6 flex items-baseline gap-2.5 text-base leading-[1.6] text-ink-soft">
          <span aria-hidden="true" className="h-[9px] w-[9px] flex-none translate-y-px rounded-full bg-action" />
          {footnote}
        </p>
      )}

      {/* at the foot: cards side by side align their buttons */}
      {soldOut ? (
        <p className="mt-auto pt-8">
          <span className="inline-flex min-h-11 items-center rounded-pill bg-ink/[0.08] px-5 font-heading font-semibold text-ink">{t.soldOut}</span>
        </p>
      ) : (
        action && <div className="mt-auto pt-8">{action}</div>
      )}
    </article>
  );
}
