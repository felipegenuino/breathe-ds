"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

type RailProps = {
  /** Name of the list for screen readers: "Treatments", "Team". */
  label: string;
  /** Grid classes from md up, written in full (Tailwind only generates whole
   *  classes). Default: three columns. */
  grid?: string;
  /** <li> children, usually RailItem. */
  children: ReactNode;
  className?: string;
};

/**
 * Rail — novo.creeta's `Trilho` (components/trilho.tsx) with the Breathe
 * tokens. On a phone it is a horizontal rail with snap, and the next card
 * shows by half to say there is more. From md it becomes a grid.
 *
 * Under the rail, a small bar follows the finger: it starts the size of what
 * is already in view and fills to the end — it says how much is left. Shown
 * only when the rail really scrolls, decoration for screen readers. The fill
 * is written straight to the style, without re-rendering on every scroll frame.
 */
export function Rail({ label, grid = "md:grid-cols-3", children, className = "" }: RailProps) {
  const list = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const overflow = ul.scrollWidth - ul.clientWidth;
      setScrolls(overflow > 8);
      if (bar.current && ul.scrollWidth > 0) {
        const seen = Math.min(1, (ul.scrollLeft + ul.clientWidth) / ul.scrollWidth);
        bar.current.style.transform = `scaleX(${seen})`;
      }
    };
    const ask = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    ul.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      ul.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <ul
        ref={list}
        aria-label={label}
        className={`cg-no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:snap-none md:gap-5 md:overflow-visible md:px-0 ${grid} ${className}`}
      >
        {children}
      </ul>
      <div
        aria-hidden="true"
        data-cg-rail-progress=""
        className={`mx-auto mt-4 h-1 w-14 overflow-hidden rounded-full bg-ink/15 md:hidden ${scrolls ? "" : "hidden"}`}
      >
        <span ref={bar} className="block h-full w-full origin-left rounded-full bg-ink-soft" />
      </div>
    </>
  );
}

/** Widths of one item on the rail (phone / sm); from md the grid decides.
 *  The next card shows by half: that is what says "there is more". */
export const RAIL_ITEM = {
  /** Treatments, videos: one card almost full width. */
  wide: "w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto",
  /** Team (medium ProfessionalCard): two cards and a bit. */
  narrow: "w-[46%] shrink-0 snap-start sm:w-[30%] md:w-auto",
} as const;

type RailItemProps = ComponentPropsWithoutRef<"li"> & {
  /** `wide` (default) or `narrow`. */
  width?: keyof typeof RAIL_ITEM;
};

/** One <li> of the Rail, with the phone width preset. */
export function RailItem({ width = "wide", className = "", ...rest }: RailItemProps) {
  return <li className={`${RAIL_ITEM[width]} ${className}`} {...rest} />;
}
