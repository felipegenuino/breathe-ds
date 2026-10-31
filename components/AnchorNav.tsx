"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ElementType } from "react";
import { Container } from "./Container";

export type AnchorItem = { id: string; label: string };

type Labels = {
  /** aria-label of the anchor nav */
  nav: string;
};

const EN: Labels = {
  nav: "On this page",
};

type Props = {
  items: AnchorItem[];
  /** Sticky offset class (header height). Default `top-20` (80px header). */
  stickyTop?: string;
  /** The app's link component (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  className?: string;
  /** Tone of the active and hover pill. `surface` (default): the page color on the
   *  white capsule, with a hairline. `accent`: the light action tint, the active
   *  label in action-text (more emphasis). */
  tone?: "surface" | "accent";
  /** Strings (English defaults); the app passes the ones for its locale. */
  labels?: Partial<Labels>;
};

/**
 * Contextual anchor navigation — floating capsule that follows the scroll
 * (extracted from ttcab's TreatmentAnchorNav). Two behaviors:
 *  1. Scroll-spy: an IntersectionObserver marks as active the section that
 *     crosses the band at ~35% from the top; the matching pill lights up.
 *  2. Sliding indicator: an absolute <span> measures the active pill (offsetLeft/
 *     Width, immune to the capsule's horizontal scroll) and slides to it on the
 *     family's curve. On narrow screens the capsule scrolls and centers the active one.
 * The active signal = the indicator (ink/12 fill + outline), NOT text color:
 * the text is always `ink` on `surface`, with no low-contrast frame.
 * prefers-reduced-motion removes the slide. Target sections need a
 * `scroll-mt-*` that, added to the theme's `scroll-padding-top` (96px), clears
 * the header plus the capsule (e.g. `scroll-mt-20` with an 80px header).
 */
export function AnchorNav({ items, stickyTop = "top-20", linkComponent, className = "", tone = "surface", labels }: Props) {
  const accent = tone === "accent";
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, ready: false });
  // Stable key of the items: sites pass the array inline, so a new reference
  // on every render. Keyed by reference, the arrival effect below re-ran on
  // every page scroll and kept dragging the page back to the hash.
  const key = items.map((it) => it.id).join("|");

  // Scroll-spy
  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Arriving with a #hash via client-side navigation: scrolls to the anchor (on
  // a full load the browser already does it; here it's idempotent). Reapplies a
  // few times to beat the router's late scroll reset. Runs once, on arrival:
  // the hash the person sets by clicking a pill is the browser's job.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !items.some((it) => it.id === hash)) return;
    const el = document.getElementById(hash);
    if (!el) return;
    setActive(hash);
    let tries = 0;
    const id = window.setInterval(() => {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      if (++tries >= 4) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const measure = () => {
    const el = linkRefs.current[active];
    if (!el) return;
    setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, ready: true });
  };

  // Measures the active pill + reveals it in the capsule on narrow screens
  useLayoutEffect(() => {
    measure();
    const el = linkRefs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const target = el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Recalculates on resize (line breaks/fonts change the width)
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <nav aria-label={t.nav} className={`sticky ${stickyTop} z-30 py-3 ${className}`}>
      <Container>
        <div className="flex justify-center">
          <ul
            ref={listRef}
            className="relative flex max-w-full list-none gap-1 overflow-x-auto rounded-pill border border-line bg-card p-1.5 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.35)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Sliding indicator */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute top-0 left-0 rounded-pill ${accent ? "bg-action-tint" : "bg-surface shadow-[inset_0_0_0_1px_var(--color-line)]"} transition-[transform,width,height,opacity] duration-[320ms] ease-cg motion-reduce:transition-none`}
              style={{ width: pill.w, height: pill.h, opacity: pill.ready ? 1 : 0, transform: `translate(${pill.x}px, ${pill.y}px)` }}
            />
            {items.map((n) => {
              const isActive = n.id === active;
              return (
                <li key={n.id}>
                  <L
                    ref={(el: HTMLAnchorElement | null) => {
                      linkRefs.current[n.id] = el;
                    }}
                    href={`#${n.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setActive(n.id)}
                    className={`relative z-10 inline-block whitespace-nowrap rounded-pill border border-transparent px-3.5 py-2 font-heading text-[0.92rem] font-semibold ${isActive && accent ? "text-action-text" : "text-ink"} transition-[background-color,border-color,color] duration-200 ease-cg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${
                      isActive ? "" : accent ? "hover:bg-action-tint/60" : "hover:bg-surface"
                    }`}
                  >
                    {n.label}
                  </L>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </nav>
  );
}
