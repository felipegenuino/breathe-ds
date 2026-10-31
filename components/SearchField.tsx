"use client";

import { useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Search, X } from "lucide-react";

/** The family's field: a white pill on the page colour, warm hairline, the
 *  card's soft shadow. 56px tall, so it reads as the page's main control. */
export const FIELD =
  "w-full min-h-14 rounded-pill border border-line bg-card text-base text-ink shadow-[0_2px_12px_color-mix(in_srgb,var(--color-shadow)_6%,transparent)] transition-[border-color,box-shadow] duration-150 outline-none hover:border-ink/35 focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

/** Label of a field: Figtree semibold in `ink`, sentence case (no uppercase
 *  tracking: the label is read, not scanned). */
export const FIELD_LABEL = "mb-2 block text-sm font-semibold text-ink";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "children"> & {
  id: string;
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  /** aria-label of the clear button ("Limpar busca"). */
  clearLabel?: string;
  /** Short help under the field, linked by aria-describedby. */
  hint?: ReactNode;
  /** Keep the label for screen readers only (when a heading right above already names the field). */
  hideLabel?: boolean;
  className?: string;
};

/**
 * SearchField — the search box of a list page (the professionals directory,
 * a blog). A native `type="search"` input (Esc clears it, the phone keyboard
 * shows "Search"), with the lucide magnifier on the left and a clear button
 * on the right once there is text; clearing puts the focus back in the field.
 * The browser's own cancel glyph is hidden so there is only one ✕.
 *
 * Placeholder in `ink-soft` (#54707a on white: 5.3:1 on ttcab, passes AA):
 * it carries an example, so it has to be legible.
 */
export function SearchField({ id, label, value, onValueChange, clearLabel = "Clear search", hint, hideLabel = false, className = "", ...rest }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : FIELD_LABEL}>
        {label}
      </label>
      <div className="relative">
        <Search aria-hidden="true" size={20} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-ink-soft" />
        <input
          ref={input}
          id={id}
          type="search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby={hintId}
          className={`${FIELD} pr-14 pl-13 placeholder:text-ink-soft [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none`}
          {...rest}
        />
        {value && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              onValueChange("");
              input.current?.focus();
            }}
            className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft transition-colors duration-150 hover:bg-tint hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ink motion-reduce:transition-none"
          >
            <X aria-hidden="true" size={18} />
          </button>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-2 px-5 text-sm text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
