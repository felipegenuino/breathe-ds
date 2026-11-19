"use client";

import { useEffect, useState, type ElementType, type ReactNode } from "react";

type Labels = {
  /** aria-label of the bar (a landmark region) */
  region: string;
  /** aria-label of the close button */
  dismiss: string;
  /** read after the action label when it leaves to another site */
  newTab: string;
};

const EN: Labels = { region: "Announcement", dismiss: "Close announcement", newTab: "(opens in a new tab)" };

type Props = {
  /** Unique name of this announcement ("black-week-2026"). The close button remembers
   *  it in this browser: a new announcement needs a new id to show again. */
  id: string;
  /** The message: one short sentence. Bold (`<strong>`) the offer, not the whole line. */
  children: ReactNode;
  /** Short tag before the message ("Black Week"), on a solid chip. */
  tag?: ReactNode;
  /** One link at the end ("See the courses"). */
  action?: { label: ReactNode; href: string; external?: boolean };
  /** First and last moment it shows (ISO date-time with offset, e.g.
   *  "2026-11-20T23:59:59-03:00"). Checked in the browser, so a static site stops
   *  showing an expired offer without a new build. */
  from?: string;
  until?: string;
  /** `ink` (default): the brand's dark ink, white text. `action`: the action colour. */
  tone?: "ink" | "action";
  /** false removes the close button (legal or service notices nobody should hide). */
  dismissible?: boolean;
  /** The app's link component (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const storageKey = (id: string) => `breathe-announcement:${id}`;

/**
 * AnnouncementBar — one line above the Header for what is temporary: a sale with a
 * deadline, enrolment opening, a change of date. Not sticky: it scrolls away and the
 * Header stays. One announcement at a time; when everything is urgent nothing is.
 *
 * It hides itself outside `from`–`until` and after the person closes it. A tiny inline
 * script does that before the first paint (static HTML would otherwise flash an expired
 * or dismissed bar); the same check runs again in React for client-side renders.
 *
 * Contrast: `ink` = white on the brand ink (Cuidado Global #144753: 10.0:1);
 * `action` = on-action on action (Cuidado Global white on #0e6b7d: 6.1:1). The tag chip
 * inverts them.
 */
export function AnnouncementBar({ id, children, tag, action, from, until, tone = "ink", dismissible = true, linkComponent, labels, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  const [hidden, setHidden] = useState(false);
  const start = from ? Date.parse(from) : null;
  const end = until ? Date.parse(until) : null;

  useEffect(() => {
    const out = () => {
      const now = Date.now();
      let closed = false;
      try {
        closed = dismissible && localStorage.getItem(storageKey(id)) === "1";
      } catch {}
      return closed || (start !== null && now < start) || (end !== null && now > end);
    };
    setHidden(out());
    // an open tab crosses the deadline: check again once a minute
    const timer = window.setInterval(() => setHidden(out()), 60_000);
    return () => window.clearInterval(timer);
  }, [id, start, end, dismissible]);

  const close = () => {
    try {
      localStorage.setItem(storageKey(id), "1");
    } catch {}
    setHidden(true);
  };

  const dark = tone === "ink";
  const domId = `breathe-announcement-${id}`;
  // runs while the HTML is parsed, right after the bar: no flash of a bar that should not be there
  const script = `(function(){try{var e=document.getElementById(${JSON.stringify(domId)}),n=Date.now();if(e&&(${dismissible ? `localStorage.getItem(${JSON.stringify(storageKey(id))})==="1"||` : ""}${start !== null ? `n<${start}||` : ""}${end !== null ? `n>${end}||` : ""}false))e.hidden=true}catch(_){}})()`;

  return (
    <>
      <aside
        id={domId}
        aria-label={t.region}
        hidden={hidden}
        suppressHydrationWarning
        className={`${dark ? "bg-ink text-white" : "bg-action text-on-action"} ${className}`}
      >
        <div className="mx-auto flex min-h-11 w-full max-w-[1600px] items-center gap-2 px-4 py-2 sm:py-0.5 md:px-6">
          {/* the empty left side balances the close button: the message stays centred */}
          {dismissible && <span aria-hidden="true" className="hidden w-11 flex-none sm:block" />}
          <p className="m-0 flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-2.5 gap-y-1 text-sm leading-snug sm:justify-center sm:text-center">
            {tag && (
              <span className={`flex-none rounded-full px-2.5 py-1 font-heading text-xs leading-none font-bold tracking-wide uppercase ${dark ? "bg-white text-ink" : "bg-on-action text-action"}`}>
                {tag}
              </span>
            )}
            <span className="text-pretty">{children}</span>
            {action && (
              <L
                href={action.href}
                {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex flex-none items-center gap-1 rounded-sm font-heading font-semibold underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
              >
                {action.label}
                {action.external && <span className="sr-only"> {t.newTab}</span>}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  {action.external ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
                </svg>
              </L>
            )}
          </p>
          {dismissible && (
            <button
              type="button"
              aria-label={t.dismiss}
              onClick={close}
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-current motion-reduce:transition-none"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
      </aside>
      <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
