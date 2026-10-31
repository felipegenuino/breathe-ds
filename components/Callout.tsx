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
  /** The actions on the right: one button (variant="tonal" on the wash; "solid"
   *  or "outline" on the other tones) and, if needed, a text link ("Agora não"). Never the accent button:
   *  the callout sits under the page's main control and must not compete with it. */
  actions?: ReactNode;
  /** `wash` (default): the brand's callout wash (TTCAB: #d2e6e9, the split complement of
   *  the cream), no border. Pair it with <Button variant="tonal">.
   *  `accent`: the action-colour wash with a hairline border in the action colour.
   *  `neutral`: white, no border. */
  tone?: "wash" | "accent" | "neutral";
  /** Accessible name of the region (defaults to nothing: pass the title as text). */
  label?: string;
  className?: string;
};

/**
 * Callout — a secondary invitation under a page's main control (e.g. "Quer ver
 * primeiro quem atende perto de você?" under the professionals search, a tip
 * under the articles search). The main control keeps the emphasis (white,
 * shadow); the callout is a quiet wash a step off the page, without a border.
 * Optical padding: the right side gets 8px more than the left (36 vs 28) — the round
 * icon bubble reads as more inset than the straight edge of a button or underlined link.
 * TTCAB (wash #d2e6e9): ink 7.90:1, ink-body 6.98:1; the kicker goes in ink-body
 * because action-text would drop to 4.18:1 there.
 */
export function Callout({ title, kicker, body, Icon, actions, tone = "wash", label, className = "" }: Props) {
  const accent = tone === "accent";
  const box = { wash: "bg-callout", accent: "border border-action-line bg-action-tint", neutral: "bg-card" }[tone];
  return (
    <div
      role={label ? "region" : undefined}
      aria-label={label}
      className={`flex flex-col gap-4 rounded-[24px] p-5 sm:flex-row sm:items-center sm:gap-5 sm:pr-6 md:py-6 md:pr-9 md:pl-7 ${box} ${className}`}
    >
      {Icon && (
        <span aria-hidden="true" className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-full sm:flex ${accent ? "bg-card text-action-text" : tone === "wash" ? "bg-callout-deep text-ink" : "bg-tint text-ink"}`}>
          <Icon size={22} strokeWidth={1.8} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {kicker && <p className={`m-0 mb-1 text-xs font-bold tracking-[0.12em] uppercase ${accent ? "text-action-text" : "text-ink-body"}`}>{kicker}</p>}
        <p className="m-0 font-heading text-lg leading-snug font-semibold text-ink md:text-xl">{title}</p>
        {body && <p className="m-0 mt-1 text-sm leading-relaxed text-ink-body">{body}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">{actions}</div>}
    </div>
  );
}
