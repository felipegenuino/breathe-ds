"use client";

import { useEffect, useState, type ElementType, type ReactNode } from "react";

type Labels = {
  /** aria-label of the bar (a landmark region) */
  region: string;
  /** aria-label of the close button */
  dismiss: string;
  /** read after the action label when it leaves to another site */
  newTab: string;
  /** aria-label of the countdown ("Time left") */
  timeLeft: string;
};

const EN: Labels = { region: "Announcement", dismiss: "Close announcement", newTab: "(opens in a new tab)", timeLeft: "Time left" };

type Props = {
  /** Unique name of this announcement ("black-week-2026"). The close button remembers
   *  it in this browser: a new announcement needs a new id to show again. */
  id: string;
  /** The message: one short sentence. Bold (`<strong>`) the offer, not the whole line. */
  children: ReactNode;
  /** Short tag before the message ("Black Week"), on a solid chip. */
  tag?: ReactNode;
  /** One link at the end ("See the courses"). With `emphasis="strong"` it is a button. */
  action?: { label: ReactNode; href: string; external?: boolean };
  /** First and last moment it shows (ISO date-time with offset, e.g.
   *  "2026-11-20T23:59:59-03:00"). Checked in the browser, so a static site stops
   *  showing an expired offer without a new build. */
  from?: string;
  until?: string;
  /** Live countdown to `until` (days, hours, minutes, seconds) before the message.
   *  For the last days of an offer; needs `until`. */
  countdown?: boolean;
  /** `quiet` (default): one small line, a text link. `strong`: taller, the sentence in
   *  the heading face and bold, the action as a button. For a sale; a service notice
   *  stays quiet. */
  emphasis?: "quiet" | "strong";
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
const two = (n: number) => String(n).padStart(2, "0");

/** dd d : hh h : mm m : ss s until `end`. Mounted only in the browser (the build's clock
 *  is not the visitor's); the box keeps its width so nothing jumps when it appears.
 *  With reduced motion the seconds are left out and it changes once a minute. */
function Countdown({ end, label, chip }: { end: number; label: string; chip: string }) {
  const [now, setNow] = useState<number | null>(null);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setCalm(mq.matches);
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), mq.matches ? 30_000 : 1000);
    return () => window.clearInterval(timer);
  }, []);
  const left = Math.max(0, Math.floor((end - (now ?? end)) / 1000));
  const parts: [number, string][] = [
    [Math.floor(left / 86400), "d"],
    [Math.floor((left % 86400) / 3600), "h"],
    [Math.floor((left % 3600) / 60), "m"],
  ];
  if (!calm) parts.push([left % 60, "s"]);
  return (
    // a timer, not a live region: a screen reader reads it on demand, never every second
    <span
      role="timer"
      aria-label={label}
      className={`inline-flex flex-none items-baseline justify-center gap-1 rounded-lg px-2.5 py-1.5 font-mono text-sm leading-none font-bold tabular-nums ${calm ? "min-w-[9.5ch]" : "min-w-[13.5ch]"} ${chip}`}
    >
      {now !== null &&
        parts.map(([n, unit], i) => (
          <span key={unit} className="whitespace-nowrap">
            {i > 0 && <span aria-hidden="true" className="mr-1 opacity-50">:</span>}
            {two(n)}
            <span className="text-[0.8em] font-semibold">{unit}</span>
          </span>
        ))}
    </span>
  );
}

/**
 * AnnouncementBar — one line above the Header for what is temporary: a sale with a
 * deadline, enrolment opening, a change of date. Not sticky: it scrolls away and the
 * Header stays. One announcement at a time; when everything is urgent nothing is.
 *
 * `emphasis="strong"` + `countdown` is the sale version (taller, bold, the clock
 * running, the action as a button); the default is a quiet line.
 *
 * It hides itself outside `from`–`until` and after the person closes it. A tiny inline
 * script does that before the first paint (static HTML would otherwise flash an expired
 * or dismissed bar); the same check runs again in React for client-side renders. The
 * close button is also what lets a person stop the running clock (WCAG 2.2.2).
 *
 * Contrast: `ink` = white on the brand ink (Cuidado Global #144753: 10.0:1);
 * `action` = on-action on action (Cuidado Global white on #0e6b7d: 6.1:1). The tag, the
 * clock and the button invert them (ink on white).
 */
export function AnnouncementBar({ id, children, tag, action, from, until, countdown = false, emphasis = "quiet", tone = "ink", dismissible = true, linkComponent, labels, className = "" }: Props) {
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
    // an open tab crosses the deadline: check again every half minute
    const timer = window.setInterval(() => setHidden(out()), 30_000);
    return () => window.clearInterval(timer);
  }, [id, start, end, dismissible]);

  const close = () => {
    try {
      localStorage.setItem(storageKey(id), "1");
    } catch {}
    setHidden(true);
  };

  const dark = tone === "ink";
  const strong = emphasis === "strong";
  // solid pieces on the bar (tag, clock, button): the bar's colours inverted
  const chip = dark ? "bg-white text-ink" : "bg-on-action text-action";
  // the button only from `sm` up: on a phone the action is a text link, to keep the bar short
  const chipFromSm = dark ? "sm:bg-white sm:text-ink" : "sm:bg-on-action sm:text-action";
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
        <div className={`mx-auto flex w-full max-w-[1600px] items-center gap-2 px-4 md:px-6 ${strong ? "min-h-16 py-2.5" : "min-h-11 py-2 sm:py-0.5"}`}>
          {/* the empty left side balances the close button: the message stays centred */}
          {dismissible && <span aria-hidden="true" className="hidden w-11 flex-none sm:block" />}
          <div className={`flex min-w-0 flex-1 flex-wrap items-center justify-start sm:justify-center sm:text-center ${strong ? "gap-x-2.5 gap-y-1.5 sm:gap-x-4" : "gap-x-2.5 gap-y-1"}`}>
            {countdown && end !== null && <Countdown end={end} label={t.timeLeft} chip={chip} />}
            {tag && (
              <span className={`flex-none rounded-full px-2.5 py-1 font-heading text-xs leading-none font-bold tracking-wide uppercase ${chip}`}>
                {tag}
              </span>
            )}
            {/* on a phone the sentence takes its own line, under the clock and the tag */}
            <p className={`m-0 min-w-0 basis-full leading-snug text-pretty sm:basis-auto ${strong ? "font-heading text-[0.95rem] font-bold md:text-lg" : "text-sm"}`}>{children}</p>
            {action && (
              <L
                href={action.href}
                {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={
                  strong
                    ? `inline-flex flex-none items-center gap-1.5 rounded-sm font-heading text-sm font-bold underline decoration-2 underline-offset-4 transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current sm:min-h-10 sm:rounded-full sm:px-4 sm:no-underline ${chipFromSm}`
                    : "inline-flex flex-none items-center gap-1 rounded-sm font-heading text-sm font-semibold underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                }
              >
                {action.label}
                {action.external && <span className="sr-only"> {t.newTab}</span>}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  {action.external ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
                </svg>
              </L>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              aria-label={t.dismiss}
              onClick={close}
              className="flex h-11 w-11 flex-none items-center justify-center self-start rounded-full transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-current motion-reduce:transition-none sm:self-center"
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
