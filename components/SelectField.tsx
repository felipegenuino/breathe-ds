import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { FIELD, FIELD_LABEL } from "./SearchField";

export type SelectOption = {
  value: string;
  label: string;
  /** Count shown after the label ("São Paulo (51)"). Native options only take text. */
  count?: number;
};

export type SelectGroup = { label: string; options: SelectOption[] };

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "children"> & {
  id: string;
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  /** The first option, value "": "Todos os estados". */
  placeholder: string;
  /** Flat options, or groups (`<optgroup>`): pass one or the other. */
  options?: SelectOption[];
  groups?: SelectGroup[];
  className?: string;
};

const text = (o: SelectOption) => (o.count === undefined ? o.label : `${o.label} (${o.count})`);

/**
 * SelectField — a native `<select>` dressed as the family's field (same pill,
 * hairline and shadow as SearchField), with a lucide chevron. Native on
 * purpose: on phones it opens the system picker, which is faster and more
 * accessible than any custom listbox for a list of states or cities.
 */
export function SelectField({ id, label, value, onValueChange, placeholder, options, groups, className = "", ...rest }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={`${FIELD} cursor-pointer appearance-none truncate pr-12 pl-5`}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options?.map((o) => (
            <option key={o.value} value={o.value}>
              {text(o)}
            </option>
          ))}
          {groups?.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {text(o)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-ink-soft" />
      </div>
    </div>
  );
}
