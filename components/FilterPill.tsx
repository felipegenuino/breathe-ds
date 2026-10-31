import type { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  /** What is filtered: "Santa Catarina". */
  children: ReactNode;
  onRemove: () => void;
  /** aria-label of the pill ("Remover filtro Santa Catarina"). */
  removeLabel: string;
  className?: string;
};

/**
 * FilterPill — one active filter, removable (the token in a search bar:
 * "Santa Catarina ✕"). The whole pill is the button: a bigger target than a
 * lone ✕, 36px tall inside a 44px row. `ink` fill with `surface` text, the
 * same "on" state as FilterChips (9.41:1 on ttcab), so active filters read the
 * same everywhere. Pair it with a "Clear filters" link when there can be more
 * than one.
 */
export function FilterPill({ children, onRemove, removeLabel, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className={`group/pill inline-flex min-h-9 items-center gap-1.5 rounded-full bg-ink py-1 pr-2 pl-3.5 text-sm font-semibold text-surface transition-colors duration-150 hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <span aria-hidden="true">{children}</span>
      <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-surface/15 transition-colors duration-150 group-hover/pill:bg-surface/25">
        <X size={14} strokeWidth={2.25} />
      </span>
    </button>
  );
}
