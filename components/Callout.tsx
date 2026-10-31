import type { ComponentType, ReactNode } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" }>;

type Props = {
  title: ReactNode;
  /** One short sentence under the title. */
  body?: ReactNode;
  /** Small icon in a bubble on the left (lucide). */
  Icon?: IconType;
  /** The actions on the right: one secondary button (variant="outline") and,
   *  if needed, a text link ("Agora não"). Never the accent button: the callout
   *  sits under the page's main control and must not compete with it. */
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
export function Callout({ title, body, Icon, actions, tone = "accent", label, className = "" }: Props) {
  const accent = tone === "accent";
  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      className={`flex flex-col gap-3 rounded-[20px] p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4 ${accent ? "border border-action-line bg-action-tint" : "bg-card"} ${className}`}
    >
      {Icon && (
        <span aria-hidden="true" className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-full sm:flex ${accent ? "bg-card text-action-text" : "bg-tint text-ink"}`}>
          <Icon size={17} strokeWidth={1.9} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="m-0 text-[0.9375rem] leading-snug font-semibold text-ink">{title}</p>
        {body && <p className="m-0 mt-0.5 text-sm leading-relaxed text-ink-soft">{body}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2">{actions}</div>}
    </div>
  );
}
