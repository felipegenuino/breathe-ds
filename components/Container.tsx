import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Largura máxima. "content" (padrão) p/ leitura; "wide" p/ heros/rodapé. */
  width?: "content" | "wide";
  className?: string;
};

/**
 * Container da família Cuidado Global — largura máxima + gutter lateral
 * consistente (16px no celular). "content" para texto/seções, "wide" para
 * blocos full-bleed (heros, rodapé).
 */
export function Container({ children, width = "content", className = "" }: Props) {
  const max = width === "wide" ? "max-w-[1600px]" : "max-w-[1120px]";
  return (
    <div className={`mx-auto w-full ${max} px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}
