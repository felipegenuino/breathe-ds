"use client";

import { useEffect, useRef } from "react";

/** Is this click a plain in-site navigation to another page? Returns the
 *  destination (path + search + hash) or null (new tab, download, external
 *  link, same-page anchor, a file, or a link the site opted out). */
export function screenTransitionTarget(
  e: MouseEvent,
  here: Location,
  skip?: (to: URL, from: Location) => boolean,
): string | null {
  if (e.defaultPrevented || e.button !== 0) return null;
  // with a modifier key or the middle button the person wants a new tab or window
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.("a");
  if (!a || !a.href || a.hasAttribute("download")) return null;
  // opt-out: e.g. the header logo that replays the curtain (already a transition)
  if (a.hasAttribute("data-no-transition")) return null;
  if (a.target && a.target !== "_self") return null;
  const url = new URL(a.href, here.href);
  if (url.origin !== here.origin) return null;
  // same page: it is an anchor, and an anchor scrolls instead of changing screens
  if (url.pathname.replace(/\/$/, "") === here.pathname.replace(/\/$/, "")) return null;
  // a file (PDF, video): the browser opens it
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null;
  if (skip?.(url, here)) return null;
  return url.pathname + url.search + url.hash;
}

type Props = {
  /** The current path, from the site's router (Next: `usePathname()`). When it
   *  changes, the new page has arrived and the transition is released. */
  pathname: string;
  /** Client-side navigation of the site's router (Next: `router.push`). */
  navigate: (href: string) => void;
  /** Destinations that must not animate: another locale with its own root
   *  layout (the page reloads), for instance. */
  skip?: (to: URL, from: Location) => boolean;
  /** If the new page takes longer than this (ms), the swap happens without
   *  the transition. Default: 1200. */
  maxWait?: number;
};

/**
 * Screen transition of the Cuidado Global family — novo.creeta's
 * `TransicaoDeTela`, by tokens, built on the browser's View Transitions API.
 * The old page backs away and fades, then the new one rises, and a line runs
 * across the top; the header and the bottom bar stay still (they carry their
 * own view-transition-name: `cabecalho`, `barra`, `veu`). Timings live in
 * theme.css (`cg-screen-*`).
 *
 * The <div class="cg-screen-line"> is the place of the top line: invisible on
 * the page, it only gives the transition a box to draw in.
 *
 * Progressive enhancement: a browser without the API navigates as always.
 * Framework-agnostic: the site passes its router (`pathname`, `navigate`).
 */
export function ScreenTransition({ pathname, navigate, skip, maxWait = 1200 }: Props) {
  const finish = useRef<(() => void) | null>(null);
  const go = useRef(navigate);
  go.current = navigate;
  const skipRef = useRef(skip);
  skipRef.current = skip;

  // the new page arrived: release the transition
  useEffect(() => {
    finish.current?.();
    finish.current = null;
  }, [pathname]);

  useEffect(() => {
    if (typeof document.startViewTransition !== "function") return;

    const onClick = (e: MouseEvent) => {
      const to = screenTransitionTarget(e, window.location, skipRef.current);
      if (!to) return;
      // stops the Link's own navigation, which checks defaultPrevented
      e.preventDefault();
      document.startViewTransition(
        () =>
          new Promise<void>((done) => {
            finish.current = done;
            go.current(to);
            window.setTimeout(done, maxWait);
          }),
      );
    };

    // on capture, to arrive before the Link's click
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [maxWait]);

  return <div aria-hidden="true" className="cg-screen-line" />;
}
