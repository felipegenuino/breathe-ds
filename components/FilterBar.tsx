"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  /** The filters (compact SelectField density="sm", chips…), on the left. */
  children: ReactNode;
  /** On the right: the count and a "clear" action. */
  aside?: ReactNode;
  /** Accessible name of the bar ("Filtrar por local"). */
  label: string;
  /** Where it sticks, below the site's sticky header. A literal Tailwind class
   *  written in your source (`top-20` = an 80px header). */
  stickyTop?: string;
  className?: string;
};

/**
 * FilterBar — the thin bar of refining filters that comes after a search
 * (Apple's store finder, Contacts): compact pills on the left, the count and
 * "clear" on the right. It sticks below the header while the list scrolls; on
 * the page colour, translucent, with a hairline under it.
 *
 * It measures itself and publishes its height as `--cg-filterbar-h` on the
 * document, so headings that stick below it can use
 * `top-[calc(80px+var(--cg-filterbar-h))]` and never slide under it, even when
 * the bar wraps on a phone.
 */
export function FilterBar({ children, aside, label, stickyTop = "top-20", className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver !== "function") return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--cg-filterbar-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cg-filterbar-h");
    };
  }, []);
  return (
    <div ref={box} role="group" aria-label={label} className={`sticky ${stickyTop} z-20 -mx-4 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:px-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">{children}</div>
        {aside && <div className="flex items-center gap-4 text-sm text-ink-soft">{aside}</div>}
      </div>
    </div>
  );
}
