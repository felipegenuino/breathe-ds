import type { ReactNode } from "react";

export type CourseRow = {
  /** Small uppercase label ("When", "Where", "Workload"). */
  label: ReactNode;
  /** One or more lines. */
  lines: ReactNode[];
  /** A line in the soft tone ("Venue to be confirmed"). */
  muted?: boolean;
};

type Props = {
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
  /** The call to action: a Button `accent` (one hot element per card). */
  action?: ReactNode;
  headingLevel?: "h2" | "h3";
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
export function CourseCard({ year, title, note, rows, footnote, action, headingLevel: Title = "h3", className = "" }: Props) {
  return (
    <article className={`flex flex-col rounded-[28px] bg-card p-[clamp(28px,4vw,44px)] ${className}`}>
      <Title>
        <span className="block font-heading text-[clamp(2.7rem,4.5vw,3.5rem)] leading-none font-bold tracking-[-0.02em] text-action-text">{year}</span>
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

      {footnote && (
        <p className="mt-6 flex items-baseline gap-2.5 text-base leading-[1.6] text-ink-soft">
          <span aria-hidden="true" className="h-[9px] w-[9px] flex-none translate-y-px rounded-full bg-action" />
          {footnote}
        </p>
      )}

      {action && <div className="mt-8">{action}</div>}
    </article>
  );
}
