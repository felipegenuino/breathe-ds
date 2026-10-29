import type { ElementType, ReactNode } from "react";

export type TextVariant = "lead" | "body" | "small" | "eyebrow";

export const TEXT: Record<TextVariant, string> = {
  /** supporting paragraph under a title */
  lead: "text-lg leading-relaxed text-ink-body",
  /** reading text */
  body: "leading-relaxed text-ink-body",
  /** notes, captions */
  small: "text-sm text-ink-soft",
  /** small label one tone below, over a title or a date ("Década de 1980") */
  eyebrow: "text-sm font-semibold text-ink-soft",
};

type Props = {
  as?: ElementType;
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
};

/** Text — the family's paragraph styles (Figtree): lead, body, small, eyebrow. */
export function Text({ as: Tag = "p", variant = "body", children, className = "" }: Props) {
  return <Tag className={`m-0 ${TEXT[variant]} ${className}`}>{children}</Tag>;
}

/** Prose — a run of paragraphs at reading width: 1rem between them, relaxed leading, `ink-body`. */
export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-2xl space-y-4 leading-relaxed text-ink-body [&>p]:m-0 ${className}`}>{children}</div>;
}
