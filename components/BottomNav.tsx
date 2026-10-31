"use client";

import { version as REACT_VERSION, useEffect, useId, useRef, useState, type ComponentType, type ElementType, type ReactNode } from "react";

// the popover trigger attribute: camelCase in React 19+, lowercase passthrough in 18
const POPOVER_TARGET = parseInt(REACT_VERSION, 10) >= 19 ? "popoverTarget" : "popovertarget";

/** Icon in the lucide pattern (the component, not the node): the bar decides the size. */
export type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

/** One page of the site, in order of importance. The first ones stay on the bar;
 *  those that don't fit go into "More". */
export type BottomPage = {
  href: string;
  label: ReactNode;
  Icon: IconType;
  /** Is this the current page? (the app decides: route/locale are its own) */
  active?: boolean;
};

/** Extra exit in the "More" panel (e.g. courses on another site): address written
 *  underneath and an outward arrow, as on novo.creeta. */
export type BottomExtra = {
  href: string;
  label: ReactNode;
  Icon: IconType;
  /** Smaller line under the label (e.g. the domain). With `external` and without this, shows the href's domain. */
  description?: ReactNode;
  external?: boolean;
  active?: boolean;
};

type Labels = {
  /** aria-label of the bar */
  nav: string;
  /** label of the "More" tab */
  more: string;
  /** aria-label of the panel */
  morePages: string;
  /** sr-only after "More": "more pages" */
  morePagesSr: string;
  /** sr-only when the current page is inside "More" */
  currentHere: string;
  /** sr-only on an external link */
  newTab: string;
};

const EN: Labels = {
  nav: "Main navigation",
  more: "More",
  morePages: "More pages",
  morePagesSr: "more pages",
  currentHere: "(the current page is here)",
  newTab: "(opens in a new tab)",
};

type Props = {
  pages: BottomPage[];
  extras?: BottomExtra[];
  /** The app's link component (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** From which width the header takes over and the bar disappears. creeta: `md`; ttcab: `lg`. */
  hideFrom?: "md" | "lg";
  /** Strings (English defaults); the app passes the ones for its locale. */
  labels?: Partial<Labels>;
  /** Embedded in a `relative` container (demo, phone frame): bar, veil and
   *  panel are `absolute` inside it and show at any width. */
  embedded?: boolean;
};

/** Minimum width of a tab, in px: below this the label doesn't fit. */
export const TAB_MIN_WIDTH = 64;

/** How many pages show directly on the bar, for a given usable width. The last
 *  tab is always "More" (that's where the pages that didn't fit and the extra
 *  exits live), so one page fewer than the number of tabs fits. */
/** At most 5 tabs (4 pages + More), as the iOS and Android tab bars: on a wider
 *  bar each tab gets room for its label instead of more tabs squeezing in. */
export const MAX_TABS = 5;

export function howManyFit(width: number, total: number): number {
  const tabs = Math.min(MAX_TABS, Math.floor(width / TAB_MIN_WIDTH));
  return Math.max(2, Math.min(total, tabs - 1));
}

const MenuIcon: IconType = ({ size = 20, strokeWidth = 1.75 }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

// Tab: icon+label column. The active one gets a SHAPE (light pill), not just color —
// readable for people who can't tell colors apart. Shrinks on touch, like an app button.
// The view-transition name makes the highlight slide between tabs on page change.
const tab = (active: boolean) =>
  [
    "flex h-14 w-full flex-col items-center justify-center gap-1 rounded-[20px] px-1 text-[10.5px] font-medium leading-none tracking-tight",
    "transition duration-150 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface",
    active ? "bg-surface text-ink [view-transition-name:aba-ativa]" : "text-surface/85 hover:bg-white/10",
  ].join(" ");

const row = (active?: boolean) =>
  `flex min-h-14 items-center gap-3 rounded-[18px] px-3 font-medium transition-colors duration-150 active:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${
    active ? "bg-surface text-ink" : "text-ink"
  }`;
const bubble = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-ink";

/**
 * Main navigation on mobile: floating bar within thumb reach, app-like. It is
 * the code of novo.creeta's BarraNavegacao (and ttcab's BottomNav), made
 * neutral through tokens: `ink` on the bar, `surface` on the active tab.
 *
 * - Dynamic: shows as many pages as fit the width (ResizeObserver, 64px per
 *   tab). The last tab is always "More", holding the rest and the extra
 *   exits. On a typical phone that's four pages plus "More".
 * - Veil behind the bar: content fades out gradually before reaching it.
 * - The "More" panel is a native popover: closes on Esc and on tap outside,
 *   returns focus to the button and opens even without JavaScript. Embedded
 *   (demo), it becomes an absolute panel inside the frame, with the same entrance.
 * - Hidden from `hideFrom` up (md on creeta, lg on ttcab), where the header takes over.
 */
export function BottomNav({ pages, extras = [], linkComponent, hideFrom = "lg", labels, embedded = false }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  const list = useRef<HTMLUListElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const panelId = useId();
  // before measuring: the typical phone case (5 tabs = 4 pages + More)
  const [visible, setVisible] = useState(() => howManyFit(5 * TAB_MIN_WIDTH, pages.length));
  const [open, setOpen] = useState(false); // embedded mode only

  useEffect(() => {
    const ul = list.current;
    if (!ul || typeof ResizeObserver !== "function") return;
    const measure = () => {
      const cs = getComputedStyle(ul);
      const useful = ul.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (useful > 0) setVisible(howManyFit(useful, pages.length));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [pages.length]);

  const close = () => {
    if (embedded) return setOpen(false);
    const el = panel.current as (HTMLDivElement & { hidePopover?: () => void }) | null;
    try {
      if (el?.matches(":popover-open")) el.hidePopover?.();
    } catch {
      /* browser without popover support: nothing to close */
    }
  };

  // Page changed: the panel closes.
  const activeHref = pages.find((p) => p.active)?.href;
  useEffect(close, [activeHref]); // eslint-disable-line react-hooks/exhaustive-deps

  // Embedded: closes on Esc and on tap outside (the native popover does this by itself).
  useEffect(() => {
    if (!embedded || !open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => document.addEventListener("pointerdown", onDown), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [embedded, open]);

  const onBar = pages.slice(0, visible);
  const inMore = pages.slice(visible);
  const moreActive = inMore.some((p) => p.active) || extras.some((x) => x.active);
  const pos = embedded ? "absolute" : "fixed";
  // full class names (Tailwind only generates what it finds written in the code)
  const hide = embedded ? "" : hideFrom === "md" ? " md:hidden" : " lg:hidden";

  const panelInner = (
    <nav aria-label={t.morePages}>
      {/* One item per row: in two columns the panel got confusing. */}
      {inMore.length > 0 && (
        <ul className="grid list-none gap-1">
          {inMore.map(({ href, label, Icon, active }, i) => (
            <li key={`${i}-${href}`}>
              <L href={href} aria-current={active ? "page" : undefined} onClick={close} className={row(active)}>
                <span className={bubble}><Icon aria-hidden="true" size={19} strokeWidth={1.75} /></span>
                {label}
              </L>
            </li>
          ))}
        </ul>
      )}
      {extras.length > 0 && (
        <ul className={`grid list-none gap-1${inMore.length > 0 ? " mt-1 border-t border-ink/10 pt-1" : ""}`}>
          {extras.map(({ href, label, Icon, description, external, active }, i) => {
            const Tag: ElementType = external ? "a" : L;
            const desc = description ?? (external ? href.replace(/^https?:\/\//, "").replace(/\/$/, "") : null);
            return (
              <li key={`${i}-${href}`}>
                <Tag
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  className={`${row(active)} py-2`}
                >
                  <span className={bubble}><Icon aria-hidden="true" size={19} strokeWidth={1.75} /></span>
                  <span className="flex-1">
                    {label}
                    {desc && <span className="block text-xs font-normal text-ink/80">{desc}</span>}
                    {external && <span className="sr-only"> {t.newTab}</span>}
                  </span>
                  {external && <span className="text-ink"><ArrowUpRight /></span>}
                </Tag>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );

  return (
    <div ref={wrap} className={embedded ? "contents" : undefined}>
      <style>{CSS}</style>
      {/* Veil behind the bar: scrolling content fades out gradually before
          reaching it, instead of showing up clipped by the edges. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none ${pos} inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-surface from-35% via-surface/85 via-65% to-transparent [view-transition-name:veu]${hide}`}
      />
      <nav
        aria-label={t.nav}
        className={`${pos} inset-x-3 bottom-3 z-50 pb-[env(safe-area-inset-bottom)] [view-transition-name:barra]${hide}`}
      >
        <ul
          ref={list}
          className="flex list-none items-stretch justify-between gap-0.5 rounded-[26px] bg-ink/95 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {onBar.map(({ href, label, Icon, active }, i) => (
            <li key={`${i}-${href}`} className="min-w-0 flex-1">
              <L href={href} aria-current={active ? "page" : undefined} className={tab(!!active)}>
                <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                <span className="w-full truncate text-center">{label}</span>
              </L>
            </li>
          ))}
          <li className="min-w-0 flex-1">
            {/* React 19 knows `popoverTarget`; React 18 only passes the lowercase attribute through as is. */}
            <button
              type="button"
              {...(embedded ? { "aria-expanded": open, "aria-controls": panelId, onClick: () => setOpen((o) => !o) } : { [POPOVER_TARGET]: panelId })}
              className={tab(embedded ? open || moreActive : moreActive)}
            >
              <MenuIcon />
              <span className="w-full truncate text-center">{t.more}</span>
              <span className="sr-only"> {t.morePagesSr}{moreActive ? ` ${t.currentHere}` : ""}</span>
            </button>
          </li>
        </ul>
      </nav>

      {embedded ? (
        open && (
          <div id={panelId} className="cg-more-panel cg-more-panel--embedded">
            {panelInner}
          </div>
        )
      ) : (
        <div ref={panel} id={panelId} {...{ popover: "auto" }} className={`cg-more-panel cg-more-panel--${hideFrom}`}>
          {panelInner}
        </div>
      )}
    </div>
  );
}

/* "More" panel: right above the bar; enters growing from the corner of the
   "More" button, in 0.18s (same as novo.creeta's .mais-painel). */
const CSS = `
.cg-more-panel{
  position:fixed; inset:auto .75rem calc(5.75rem + env(safe-area-inset-bottom)) .75rem;
  width:auto; margin:0; border:0; border-radius:26px; padding:.5rem;
  background:var(--color-card); color:var(--color-ink);
  box-shadow:0 20px 48px -16px rgb(0 0 0 / .35), 0 1px 2px rgb(0 0 0 / .1);
  opacity:0; transform:translateY(8px) scale(.97); transform-origin:88% 100%;
  transition:opacity 180ms cubic-bezier(.23,1,.32,1), transform 180ms cubic-bezier(.23,1,.32,1), overlay 180ms allow-discrete, display 180ms allow-discrete;
}
.cg-more-panel:popover-open, .cg-more-panel--embedded{ opacity:1; transform:none; }
@starting-style{ .cg-more-panel:popover-open, .cg-more-panel--embedded{ opacity:0; transform:translateY(8px) scale(.97); } }
.cg-more-panel::backdrop{ background:transparent; }
.cg-more-panel--embedded{ position:absolute; z-index:50; }
@media (prefers-reduced-motion:reduce){
  .cg-more-panel{ transform:none; transition:opacity 120ms ease; }
  @starting-style{ .cg-more-panel:popover-open, .cg-more-panel--embedded{ transform:none; } }
}
/* From the breakpoint up the bar doesn't exist: neither does the panel. */
@media (min-width:768px){ .cg-more-panel--md{ display:none !important; } }
@media (min-width:1024px){ .cg-more-panel--lg{ display:none !important; } }
`;
