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

/**
 * Símbolo vivo do Breathe — um anel aberto (gesto fluido, contínuo) com um
 * ponto no respiro, abstração do logotipo do creeta (forma redonda + ponto).
 * NEUTRO: usa currentColor, herda a cor do contexto (a paleta vem de cada app).
 * "Respira" num pulso suave de escala; respeita prefers-reduced-motion.
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
        viewBox="0 0 64 64"
        role="img"
        aria-label={title}
        className={animated ? "" : "breathe-mark--static"}
        style={{ ["--breathe-dur" as string]: `${duration}s` }}
      >
        <g className="breathe-mark__g">
          {/* anel aberto — gesto contínuo com um respiro no topo */}
          <path
            d="M 42 17.5 A 17 17 0 1 1 22 17.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* ponto do respiro */}
          <circle cx="32" cy="14.5" r="4.4" fill="currentColor" />
        </g>
      </svg>
    </span>
  );
}
