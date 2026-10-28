type Props = {
  /** Lado em px (quadrado). */
  size?: number;
  /** Segundos de um ciclo respiratório completo (inspira+expira). */
  duration?: number;
  /** Anima? (ainda respeita prefers-reduced-motion). */
  animated?: boolean;
  className?: string;
  title?: string;
};

/** Pétala apontando para cima — estreita na base (centro), arredondada na ponta. */
const PETAL =
  "M -2.6 -6 C -3.4 -13 -3.2 -18 -2.2 -24 C -1.4 -27.5 1.4 -27.5 2.2 -24 C 3.2 -18 3.4 -13 2.6 -6 C 1.7 -4 -1.7 -4 -2.6 -6 Z";

/**
 * Símbolo vivo do Breathe — um burst radial de 8 pétalas que "respira"
 * (inspira/expira) com um pulso suave de escala. Usa currentColor (herda o
 * token do contexto: ink, action…). Respeita prefers-reduced-motion: sem
 * animação, vira um símbolo estático. Inspirado no asterisco do intent, mas
 * com vida (o nome é Breathe).
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
          0%, 100% { transform: scale(0.9); }
          50%      { transform: scale(1.06); }
        }
        .breathe-mark__g {
          transform-box: fill-box;
          transform-origin: center;
          animation: breathe-mark-inhale var(--breathe-dur, 6s) cubic-bezier(0.37, 0, 0.63, 1) infinite;
        }
        .breathe-mark--static .breathe-mark__g { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .breathe-mark__g { animation: none; }
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox="-32 -32 64 64"
        fill="currentColor"
        role="img"
        aria-label={title}
        className={animated ? "" : "breathe-mark--static"}
        style={{ ["--breathe-dur" as string]: `${duration}s` }}
      >
        <g className="breathe-mark__g">
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={PETAL} transform={`rotate(${i * 45})`} />
          ))}
        </g>
      </svg>
    </span>
  );
}
