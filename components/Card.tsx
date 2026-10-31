import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Renders as a link when href is passed. */
  href?: string;
  /** Lifts on hover (for clickable cards). */
  interactive?: boolean;
  /** `outline` (default): page color with a hairline and a soft shadow.
   *  `solid`: white card, no border, 28px corners — the family's testimonial
   *  and profile cards. */
  variant?: "outline" | "solid";
  className?: string;
};

/**
 * Base card of the family — style decided in the DS: **subtle border + subtle
 * shadow**, 2xl radius (28px), surface background. With `href` it becomes a
 * link; with `interactive` it lifts on hover. No strong borders or heavy shadows.
 */
export function Card({ children, href, interactive, variant = "outline", className = "" }: Props) {
  const look =
    variant === "solid"
      ? "rounded-[28px] bg-card p-5 md:p-8"
      : "rounded-2xl border border-line bg-surface p-[clamp(20px,3vw,32px)] shadow-[0_2px_12px_rgba(20,71,83,0.06)]";
  const cls = `block ${look} ${
    interactive || href
      ? "transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(20,71,83,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      : ""
  } ${className}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <div className={cls}>{children}</div>;
}
