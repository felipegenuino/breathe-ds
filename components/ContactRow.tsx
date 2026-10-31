"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar } from "./Avatar";
import { FADE_IN } from "./Rows";

export type ContactAction = {
  /** What the button does ("Ligar", "E-mail"). */
  label: ReactNode;
  /** The value shown under it: the number, the address. */
  value: ReactNode;
  href: string;
  icon?: ReactNode;
  /** sr-only after the label: who it reaches (" para Ana Souza"). */
  srLabel?: ReactNode;
  /** Long unbroken value (an e-mail) may wrap, only when it does not fit. */
  breakAll?: boolean;
  /** Opens in a new tab (WhatsApp). Say so in `srLabel`. */
  external?: boolean;
};

type Props = {
  /** Plain name: the initials. */
  name: string;
  /** The name as rendered (e.g. with the search match marked). */
  nameDisplay?: ReactNode;
  /** One quiet line under the name: the city. */
  meta?: ReactNode;
  /** Revealed when the row opens. */
  actions: ContactAction[];
  /** Start open (e.g. the only result of a search). */
  defaultOpen?: boolean;
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * ContactRow — one person in a long directory, as in the iPhone's Contacts:
 * the list shows only what you scan by (initials, name, city); the ways to
 * reach the person appear when you tap the row. 140 people with phone and
 * e-mail always visible was a wall of data; this is a list of names.
 *
 * Put rows in a `ContactList` (the white inset-grouped panel with hairlines).
 * The row is a button with `aria-expanded`; the actions are real links
 * (wa.me, tel:, mailto:) written as plain text — icon + the value, 44px tall,
 * underlined on hover — so the number can also be read and copied. No hover
 * fill on the row (only a light press tint): open, row and actions share one
 * white surface.
 */
export function ContactRow({ name, nameDisplay, meta, actions, defaultOpen = false, headingLevel: H = "h3", className = "" }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panel = useId();
  return (
    <li className={`relative list-none ${className}`}>
      <H className="m-0 font-normal">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen((v) => !v)}
          className="group/row flex min-h-16 w-full items-center gap-3.5 px-4 py-2.5 text-left transition-colors duration-150 active:bg-tint/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none md:px-5"
        >
          <Avatar name={name} size={40} />
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 block font-heading text-[1.0625rem] leading-snug font-medium text-ink">{nameDisplay ?? name}</span>
            {meta && <span className="mt-0.5 block truncate text-sm text-ink-soft">{meta}</span>}
          </span>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className={`shrink-0 text-ink-soft transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : "group-hover/row:translate-y-0.5"}`}
          />
        </button>
      </H>
      <div id={panel} hidden={!open} className={`${FADE_IN} pr-4 pb-4 pl-[4.375rem] md:pr-5 md:pl-[4.625rem]`}>
        {/* minimalista: ícone + valor, texto em ink sublinhado no hover; o nome da
            ação ("WhatsApp", "E-mail") fica para o leitor de tela */}
        <ul className="m-0 flex list-none flex-col gap-0.5 p-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {actions.map((a, i) => (
            <li key={i}>
              <a
                href={a.href}
                {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group/act inline-flex min-h-11 max-w-full items-center gap-2 rounded-[2px] text-[0.9375rem] text-ink underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
              >
                {a.icon && <span className="flex shrink-0 text-ink-soft group-hover/act:text-ink">{a.icon}</span>}
                <span className="sr-only">{a.label}</span>
                <span className={a.breakAll ? "[overflow-wrap:anywhere]" : undefined}>{a.value}</span>
                {a.srLabel && <span className="sr-only">{a.srLabel}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/** The white inset-grouped panel of a section (iOS lists): rounded corners on
 *  the group, rows separated by a hairline that starts at the name (after the
 *  40px avatar + its padding: 70px, 74px from md), drawn as a ::before so the
 *  row itself never moves. */
export function ContactList({ children, inset = true, className = "" }: { children: ReactNode; /** false: hairline from the edge (rows without an avatar, e.g. PublicationRow). */ inset?: boolean; className?: string }) {
  if (!inset)
    return (
      <ul className={`m-0 list-none overflow-hidden rounded-[22px] bg-card p-0 [&>li+li]:border-t [&>li+li]:border-line ${className}`}>
        {children}
      </ul>
    );
  return (
    <ul
      className={`m-0 list-none overflow-hidden rounded-[22px] bg-card p-0 [&>li+li]:before:absolute [&>li+li]:before:top-0 [&>li+li]:before:right-0 [&>li+li]:before:left-[4.375rem] [&>li+li]:before:h-px [&>li+li]:before:bg-line [&>li+li]:before:content-[''] md:[&>li+li]:before:left-[4.625rem] ${className}`}
    >
      {children}
    </ul>
  );
}
