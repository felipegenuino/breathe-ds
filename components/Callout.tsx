import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>;

type Props = {
  title: ReactNode;
  /** Small line above the title in action-text ("Perto de você"). */
  kicker?: ReactNode;
  /** One short sentence under the title. */
  body?: ReactNode;
  /** Small icon in a bubble on the left (lucide). */
  Icon?: IconType;
  /** The actions on the right: one button (variant="solid", the petrol one, or
   *  "outline") and, if needed, a text link ("Agora não"). Never the accent button:
   *  the callout sits under the page's main control and must not compete with it. */
  actions?: ReactNode;
  /** `accent` (default): the action-colour wash with a closed hairline border in
   *  the action colour (the family's highlighted panel, at a small scale).
   *  `neutral`: white, no border. */
  tone?: "accent" | "neutral";
  /** Accessible name of the region (defaults to nothing: pass the title as text). */
  label?: string;
  className?: string;
};

/**
 * Callout — a secondary invitation under a page's main control (e.g. "Quer ver
 * primeiro quem atende perto de você?" under the professionals search, a tip
 * under the articles search). The main control keeps the emphasis (white,
 * shadow); the callout is a quiet, bordered wash in the action colour.
 * TTCAB measures: ink on the tint 8.75:1, ink-soft 4.53:1, border 3.15:1.
 */
export function Callout({ title, kicker, body, Icon, actions, tone = "accent", label, className = "" }: Props) {
  const accent = tone === "accent";
  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      className={`flex flex-col gap-4 rounded-[24px] p-5 sm:flex-row sm:items-center sm:gap-5 md:px-7 md:py-6 ${accent ? "border border-action-line bg-action-tint" : "bg-card"} ${className}`}
    >
      {Icon && (
        <span aria-hidden="true" className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-full sm:flex ${accent ? "bg-card text-action-text" : "bg-tint text-ink"}`}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {kicker && <p className="m-0 mb-1 text-xs font-bold tracking-[0.12em] text-action-text uppercase">{kicker}</p>}
        <p className="m-0 font-heading text-lg leading-snug font-semibold text-ink md:text-xl">{title}</p>
        {body && <p className="m-0 mt-1 text-sm leading-relaxed text-ink-body">{body}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">{actions}</div>}
    </div>
  );
}
