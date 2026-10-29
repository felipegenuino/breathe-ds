import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Max width. "content" (default) for reading; "wide" for heroes/footer. */
  width?: "content" | "wide";
  className?: string;
};

/**
 * Container of the Cuidado Global family — max width + consistent side gutter
 * (16px on mobile). "content" for text/sections, "wide" for full-bleed blocks
 * (heroes, footer).
 */
export function Container({ children, width = "content", className = "" }: Props) {
  const max = width === "wide" ? "max-w-[1600px]" : "max-w-[1120px]";
  return (
    <div className={`mx-auto w-full ${max} px-4 md:px-6 ${className}`}>
      {children}
    </div>
  );
}
