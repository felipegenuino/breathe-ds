import type { ElementType, ReactNode } from "react";
import { Byline, type Person } from "./Byline";

/**
 * The hand-drawn underline in the action color, under the key words of a line
 * ("de forma integrada"). Decorative: the words stay plain text for screen
 * readers. Keep it to a few words — it does not wrap.
 */
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.16em] h-[0.3em] w-full"
      >
        <path
          d="M3 9 C 40 3, 80 12, 118 7 C 150 3, 178 8, 197 6"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-action-line"
        />
      </svg>
    </span>
  );
}

type Props = {
  /** The line itself. Use <Highlight> on the few words that carry it. */
  children: ReactNode;
  /** Who said it (portrait + name + role under the line). Omit for a brand
   *  statement — then the quote marks stay, without an author. */
  cite?: { people: Person[]; role?: ReactNode };
  /** Small line above ("O que nos guia"). */
  eyebrow?: ReactNode;
  /** `center` (default) for a statement between sections; `start` beside other content. */
  align?: "center" | "start";
  /** `lg` (default) between sections; `md` inside a column or a card. */
  size?: "md" | "lg";
  /** Big opening quote mark in the action color. Default: true. */
  mark?: boolean;
  as?: ElementType;
  className?: string;
};

const SIZE = {
  lg: "text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.14]",
  md: "text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.2]",
};

/**
 * Pull quote of the Cuidado Global family: one line that matters, set large,
 * with the opening mark in the action color and, optionally, the person who
 * said it (the family's Byline). Between sections it breathes on its own; the
 * line is balanced (text-balance) so it never ends on a lonely word.
 */
export function PullQuote({ children, cite, eyebrow, align = "center", size = "lg", mark = true, as: Root = "figure", className = "" }: Props) {
  const center = align === "center";
  return (
    <Root className={`${center ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      {mark && (
        // drawn mark: the font's own “ is tiny in Quicksand, it would not hold the line
        <svg
          aria-hidden="true"
          viewBox="0 0 48 36"
          className={`mb-6 block h-9 w-12 fill-action-line md:mb-8 md:h-12 md:w-16 ${center ? "mx-auto" : ""}`}
        >
          <path d="M0 36V22C0 10.5 6 2.6 18.2 0l2.3 5.2C14.6 7.4 11.4 11 11 16h8.6v20H0Zm27.4 0V22c0-11.5 6-19.4 18.2-22l2.3 5.2C42 7.4 38.8 11 38.4 16H47v20H27.4Z" />
        </svg>
      )}
      {eyebrow && (
        <p className="mb-4 font-heading text-[0.82rem] font-bold tracking-[0.14em] text-ink-soft uppercase">{eyebrow}</p>
      )}
      <blockquote className="m-0">
        <p className={`m-0 font-heading font-medium tracking-[-0.015em] text-balance text-ink ${SIZE[size]}`}>{children}</p>
      </blockquote>
      {cite && (
        <figcaption className={`mt-8 flex ${center ? "justify-center" : ""}`}>
          <Byline cite people={cite.people} subtitle={cite.role} className="text-left" />
        </figcaption>
      )}
    </Root>
  );
}
