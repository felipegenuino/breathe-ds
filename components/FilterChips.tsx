import type { ReactNode } from "react";

export type FilterChip = {
  value: string;
  label: ReactNode;
  /** Shown after the label, lighter ("Tratamento 8"). */
  count?: number;
};

type Props = {
  /** Names the group for screen readers ("Filtrar por tema"). */
  label: string;
  chips: FilterChip[];
  /** The selected value; "" is the first chip ("Todos"). */
  value: string;
  onValueChange: (value: string) => void;
  /** `wrap` (default): the chips wrap to new lines. `scroll`: on phones they
   *  stay on one line and scroll sideways (bleeding to the screen edge), so a
   *  long topic list does not push the content down; from `sm` they wrap. */
  layout?: "wrap" | "scroll";
  className?: string;
};

/**
 * FilterChips — one-of-many filter over a list (the topics of a library, the
 * categories of a blog). Toggle buttons with `aria-pressed` in a labelled
 * group: they change what is shown, they do not navigate, so they are not
 * links and not tabs. 44px tall for the finger.
 *
 * Off: the white pill of the family (`card`, soft shadow, `ink` text). On:
 * filled `ink` with `surface` text (9.41:1 on ttcab). A small control never
 * uses the action colour as its fill (see the Action dose rule).
 */
const SCROLL =
  "max-sm:-mx-5 max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:px-5 max-sm:py-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden max-sm:snap-x max-sm:scroll-px-5 [&>button]:shrink-0 [&>button]:snap-start";

export function FilterChips({ label, chips, value, onValueChange, layout = "wrap", className = "" }: Props) {
  return (
    <div role="group" aria-label={label} className={`flex flex-wrap gap-2 ${layout === "scroll" ? SCROLL : ""} ${className}`}>
      {chips.map((c) => {
        const on = c.value === value;
        return (
          <button
            key={c.value || "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onValueChange(c.value)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${
              on
                ? "bg-ink text-surface"
                : "bg-card text-ink shadow-[0_1px_2px_color-mix(in_srgb,var(--color-shadow)_18%,transparent)] hover:bg-tint"
            }`}
          >
            {c.label}
            {c.count !== undefined && (
              <span className={`font-normal tabular-nums ${on ? "text-surface/80" : "text-ink-soft"}`}>{c.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
