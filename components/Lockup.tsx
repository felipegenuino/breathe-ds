import type { CSSProperties, ReactNode } from "react";
import { BreatheMark } from "./BreatheMark";

/**
 * Logo arrangements (flexible branding system of the Cuidado Global family).
 * - `stacked`     symbol on top, name below: profiles, splash, poster.
 * - `horizontal`  symbol + name side by side (+ tagline): header, documents.
 * - `wordmark`    text only (name + tagline): ads, when legibility is essential.
 * - `symbol`      symbol only: favicon, app icon, watermark.
 * - `merged`      filled symbol with the name inside: avatar, packaging.
 */
export type LockupVariant = "stacked" | "horizontal" | "wordmark" | "symbol" | "merged";
type Size = "sm" | "md" | "lg";

/* Name in `font-heading`; symbol ~1.3× the name's body size (the ring is open
   and "reads" lighter, so it needs one size up to sit in harmony).
   The BreatheMark box is tight to the glyph: the space between symbol and name is just the gap.
   `md` = the sites' header (44px symbol, measured on creeta and ttcab). */
const NAME: Record<Size, string> = { sm: "text-2xl", md: "text-[2.125rem]", lg: "text-[2.7rem]" };
const TAG: Record<Size, string> = { sm: "text-[0.78rem]", md: "text-sm", lg: "text-base" };
const MARK: Record<Size, number> = { sm: 32, md: 44, lg: 56 };
const GAP: Record<Size, string> = { sm: "gap-2", md: "gap-2.5", lg: "gap-3" };
const NAME_PX: Record<Size, number> = { sm: 24, md: 34, lg: 43 };
const TILE: Record<Size, string> = { sm: "size-16 text-[0.7rem]", md: "size-24 text-[0.95rem]", lg: "size-32 text-[1.3rem]" };

type Props = {
  variant?: LockupVariant;
  /** Brand name (each site passes its own). */
  name?: string;
  tagline?: ReactNode;
  /** Custom symbol; defaults to the BreatheMark (ring + dot). An injected <svg>
   *  gets the height of the size (`size`); width follows the aspect ratio. */
  logo?: ReactNode;
  /** Drawn wordmark (svg) in place of the text name. Ignored by `merged`
   *  (there the name is text). */
  wordmark?: ReactNode;
  /** Wordmark height as a fraction of the symbol height, from the brand manual
   *  (e.g. `TTCAB_LOCKUP.wordmarkPerSymbol`). Reaches the svg via `--cg-wordmark`. */
  wordmarkRatio?: number;
  /** Which side the symbol sits on in `horizontal`. Default `left` (creeta and
   *  the others); TTCAB is `right` (`TTCAB_LOCKUP.symbolSide`). */
  symbolSide?: "left" | "right";
  size?: Size;
  /** Does the symbol "breathe"? Default `false`: a header logo should not keep animating. */
  animated?: boolean;
  /** Entrance on mount, as in the novo.creeta header: the symbol arrives first,
   *  then the name, then the tagline. Respects prefers-reduced-motion (becomes
   *  just a short fade). Remount (key) to replay. */
  entrance?: boolean;
  /** Entrance delay in ms (e.g. to wait for the Curtain to rise). */
  entranceDelay?: number;
  className?: string;
};

/**
 * Lockup: assembles the family logo in one of the arrangements above. Neutral
 * through tokens: name/symbol in `ink`, tagline in `ink-soft`; the actual color
 * comes from each app. Typography is fixed by the family (Quicksand for the
 * name, Figtree for the tagline).
 */
export function Lockup({
  variant = "horizontal",
  name = "Breathe",
  tagline,
  logo,
  wordmark,
  wordmarkRatio = 0.5,
  symbolSide = "left",
  size = "md",
  animated = false,
  entrance = false,
  entranceDelay = 0,
  className = "",
}: Props) {
  const entranceCls = entrance ? " cg-lockup--entrance" : "";
  const entranceStyle = entrance ? ({ "--cg-entrance-delay": `${entranceDelay}ms` } as CSSProperties) : undefined;
  // In horizontal with a tagline, the symbol spans the whole block (name + tagline),
  // becoming a proportional "bookend", not just the name height.
  const markPx = variant === "horizontal" && tagline && symbolSide !== "right" ? Math.round(NAME_PX[size] * 2.3) : MARK[size];
  const mark = (
    <span className="cg-lockup__mark inline-flex text-ink [&>svg]:h-[var(--mark)] [&>svg]:w-auto" style={{ "--mark": `${markPx}px` } as CSSProperties}>
      {logo ?? <BreatheMark size={markPx} animated={animated} title={name} />}
    </span>
  );
  // The wordmark follows the size's base symbol (not the "bookend" of horizontal
  // with tagline), as in creeta's signed logo: name ≈ 0.26 of the large symbol.
  const nameEl = (
    <span
      className={`cg-lockup__name font-heading font-bold leading-none tracking-[-0.02em] text-ink ${NAME[size]}`}
      style={wordmark ? ({ "--cg-wordmark": `${Math.round(MARK[size] * wordmarkRatio * 10) / 10}px` } as CSSProperties) : undefined}
    >
      {wordmark ?? name}
    </span>
  );
  // `block`: as an inline item, the parent's line-height (1.5 from body) ruled
  // the line and a two-line tagline came out too loose.
  const tagEl = tagline ? (
    <span className={`cg-lockup__tag block font-body leading-[1.3] text-ink-soft ${TAG[size]}`}>{tagline}</span>
  ) : null;

  if (variant === "symbol") {
    return (
      <span className={`inline-flex text-ink ${className}`} role="img" aria-label={name}>
        {mark}
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={`inline-flex flex-col${entranceCls} ${className}`} style={entranceStyle}>
        {nameEl}
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center text-center${entranceCls} ${className}`} style={entranceStyle}>
        {mark}
        <span className="mt-4 flex flex-col items-center">
          {nameEl}
          {tagEl && <span className="mt-1.5">{tagEl}</span>}
        </span>
      </span>
    );
  }

  if (variant === "merged") {
    // Merged: name inside a filled disc (ink). Avatar / app icon.
    // Short names (creeta, ttcab) fit best; a long name needs a smaller body size.
    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-2 text-center font-heading font-bold leading-none tracking-[-0.01em] text-surface ${TILE[size]} ${className}`}
        role="img"
        aria-label={name}
      >
        {name}
      </span>
    );
  }

  // horizontal (default). Symbol on the right (TTCAB): sits next to the name, on
  // the same line; the tagline goes below (otherwise the symbol would end up after the tagline).
  if (symbolSide === "right") {
    return (
      <span className={`inline-flex flex-col items-start${entranceCls} ${className}`} style={entranceStyle}>
        <span className={`inline-flex items-center ${GAP[size]}`}>
          {nameEl}
          {mark}
        </span>
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center ${GAP[size]}${entranceCls} ${className}`} style={entranceStyle}>
      {mark}
      <span className="flex min-w-0 flex-col">
        {nameEl}
        {tagEl && <span className="mt-1">{tagEl}</span>}
      </span>
    </span>
  );
}

