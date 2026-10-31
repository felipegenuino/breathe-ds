import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export type Fact = {
  Icon: IconType;
  /** First line, strong ("Monday to Friday"). */
  title: ReactNode;
  /** Second line, lighter ("8 am to 6 pm"). */
  text?: ReactNode;
  /** Read between the two lines by screen readers only, so the sentence
   *  still reads whole (", " or " "). Default: ", ". */
  separator?: string;
};

type Props = {
  facts: Fact[];
  /** aria-label of the list ("How we see patients"). */
  label?: string;
  className?: string;
};

/**
 * Fact strip — the three facts under the hero of novo.creeta ("Monday to
 * Friday / 8 am to 6 pm", "At the clinic / or at home", "Individual care /
 * from babies to the elderly"). Each fact is an icon bubble plus two lines of
 * equal visual weight, so none wraps differently from the others. On desktop
 * a thin line separates the columns; on phones it separates the rows.
 */
export function FactStrip({ facts, label, className = "" }: Props) {
  const cols = facts.length === 2 ? "md:grid-cols-2" : facts.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <ul
      aria-label={label}
      className={`m-0 list-none divide-y divide-ink/10 rounded-2xl bg-card px-6 md:grid ${cols} md:divide-x md:divide-y-0 md:px-0 md:py-7 ${className}`}
    >
      {facts.map(({ Icon, title, text, separator = ", " }, i) => (
        <li key={i} className="flex items-center gap-4 py-5 md:px-8 md:py-0 lg:px-10">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tint text-ink">
            <Icon size={22} strokeWidth={1.75} />
          </span>
          <p className="m-0 leading-snug">
            <span className="block font-heading text-lg font-medium text-ink">{title}</span>
            {text && (
              <>
                <span className="sr-only">{separator}</span>
                <span className="block text-[0.9375rem] text-ink/80">{text}</span>
              </>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
