"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";

export type TicketOption = {
  id: string;
  label: ReactNode;
  /** "6 left", as a small pill after the label. */
  remaining?: ReactNode;
  /** "Free", "R$ 1.900". */
  price: ReactNode;
  disabled?: boolean;
};

type Props = {
  /** The strip at the top ("Registration"). */
  title: ReactNode;
  /** The sentence above the options ("Hi! Choose your ticket:"). */
  intro?: ReactNode;
  options: TicketOption[];
  /** Selected option id (controlled); without it, the first enabled one. */
  value?: string;
  onChange?: (id: string) => void;
  /** The button at the foot (a Button `accent`, or `solid`); receives nothing: read the selection through onChange. */
  action: ReactNode;
  /** Small line under the button ("Only physiotherapists can attend."). */
  footnote?: ReactNode;
  /** Name of the radio group, for the form. */
  name?: string;
  className?: string;
};

/**
 * Registration box of an event (Luma): a strip with the title, a sentence,
 * the ticket options as a radio group (the chosen one gets the ring and the
 * check), the price on the right, and the one button at the foot. By tone:
 * the box is a surface card inside the page's card.
 */
export function RegistrationBox({ title, intro, options, value, onChange, action, footnote, name = "ticket", className = "" }: Props) {
  const first = options.find((o) => !o.disabled)?.id;
  const [inner, setInner] = useState(first);
  const selected = value ?? inner;
  const choose = (id: string) => {
    setInner(id);
    onChange?.(id);
  };
  return (
    <section className={`overflow-hidden rounded-[24px] bg-surface ${className}`}>
      <h2 className="border-b border-ink/10 px-5 py-3 text-sm font-semibold text-ink-soft">{title}</h2>
      <div className="p-5">
        {intro && <p className="mb-4 text-ink">{intro}</p>}
        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">{title}</legend>
          <div className="flex flex-col gap-2">
            {options.map((o) => {
              const on = o.id === selected;
              return (
                <label
                  key={o.id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-4 py-2.5 transition-colors duration-150 motion-reduce:transition-none ${on ? "bg-card shadow-[inset_0_0_0_2px_var(--color-ink)]" : "bg-card/60 hover:bg-card"} ${o.disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <input type="radio" name={name} value={o.id} checked={on} disabled={o.disabled} onChange={() => choose(o.id)} className="sr-only" />
                  <span aria-hidden="true" className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${on ? "bg-ink text-surface" : "border-2 border-ink/25"}`}>
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2 font-semibold text-ink">
                    {o.label}
                    {o.remaining && <span className="rounded-pill bg-ink/[0.08] px-2 py-0.5 text-xs font-semibold text-ink-soft">{o.remaining}</span>}
                  </span>
                  <span className="shrink-0 font-semibold text-ink">{o.price}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-4 [&>*]:w-full [&>*]:justify-center">{action}</div>
        {footnote && <p className="mt-3 text-sm text-ink-soft">{footnote}</p>}
      </div>
    </section>
  );
}
