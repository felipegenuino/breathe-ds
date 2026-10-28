import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Vira link se href for passado. */
  href?: string;
  /** Eleva no hover (para cards clicáveis). */
  interactive?: boolean;
  className?: string;
};

/**
 * Card base da família — estilo decidido no DS: **borda discreta + sombra
 * discreta**, raio 2xl (28px), fundo surface. Com `href` vira link; com
 * `interactive` eleva no hover. Nada de borda forte ou sombra pesada.
 */
export function Card({ children, href, interactive, className = "" }: Props) {
  const cls = `block rounded-2xl border border-line bg-surface p-[clamp(20px,3vw,32px)] shadow-[0_2px_12px_rgba(20,71,83,0.06)] ${
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
