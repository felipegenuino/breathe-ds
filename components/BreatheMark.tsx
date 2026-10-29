type Props = {
  /** Side in px (square). This is the size of the visible glyph: the SVG box
   *  is tight to the ring + dot, with no inner padding (the space between
   *  symbol and name is up to the layout). */
  size?: number;
  /** Seconds of one full breathing cycle (inhale + exhale). */
  duration?: number;
  /** Animate? (still respects prefers-reduced-motion). */
  animated?: boolean;
  className?: string;
  title?: string;
};

/**
 * Living symbol of Breathe: an open ring (a fluid, continuous gesture) with a
 * dot at the breath gap, an abstraction of the creeta logo (round shape + dot).
 * NEUTRAL: uses currentColor and inherits the color from context (the palette
 * comes from each app). It "breathes" with a soft scale pulse; respects
 * prefers-reduced-motion.
 */
export function BreatheMark({
  size = 96,
  duration = 6,
  animated = true,
  className,
  title = "Breathe",
}: Props) {
  return (
    <span className={className} style={{ display: "inline-flex", lineHeight: 0 }}>
      <style>{`
        @keyframes breathe-mark-inhale {
          0%, 100% { transform: scale(0.93); }
          50%      { transform: scale(1.05); }
        }
        .breathe-mark__g {
          transform-box: fill-box;
          transform-origin: center;
          animation: breathe-mark-inhale var(--breathe-dur, 6s) cubic-bezier(0.37, 0, 0.63, 1) infinite;
        }
        .breathe-mark--static .breathe-mark__g { animation: none; }
        @media (prefers-reduced-motion: reduce) { .breathe-mark__g { animation: none; } }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="10.5 10 43 43"
        overflow="visible"
        role="img"
        aria-label={title}
        className={animated ? "" : "breathe-mark--static"}
        style={{ ["--breathe-dur" as string]: `${duration}s` }}
      >
        <g className="breathe-mark__g">
          {/* open ring: a continuous gesture with a breath gap at the top */}
          <path
            d="M 42 17.5 A 17 17 0 1 1 22 17.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* the breath dot */}
          <circle cx="32" cy="14.5" r="4.4" fill="currentColor" />
        </g>
      </svg>
    </span>
  );
}
