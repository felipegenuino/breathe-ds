"use client";

import { useId, useRef, useState, type ReactNode } from "react";

export type Language = {
  /** BCP 47 code for `lang`/`hrefLang` (pt-BR, en, es). */
  lang: string;
  /** The language written in itself ("Português", "English", "Español"). */
  label: ReactNode;
  /** The same page in that language. */
  href: string;
  current?: boolean;
  /** Short code shown on the menu button; default: the first part of `lang`, uppercase (PT). */
  code?: string;
};

type Labels = {
  /** aria-label of the nav */
  nav: string;
  /** Accessible name of the menu button. Starts with the code written on it
   *  ("PT"): voice-control users say what they see (WCAG 2.5.3). */
  change: (code: string, current: string) => string;
};
const EN: Labels = { nav: "Language", change: (code, current) => `${code}. Change language. Current: ${current}` };

type Props = {
  languages: Language[];
  /** `menu`: button with the current code that opens the list (header).
   *  `list`: the languages side by side, no JavaScript (footer). */
  mode?: "menu" | "list";
  labels?: Partial<Labels>;
  className?: string;
};

const Globe = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="max-[359px]:hidden md:max-lg:hidden" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" /></svg>
);
const Check = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);

const codeOf = (l: Language) => l.code ?? l.lang.split("-")[0].toUpperCase();

/**
 * Language switcher — the SeletorDeIdioma of novo.creeta, by tokens.
 * - Leads to the SAME page in the other language, never to the home.
 * - Each language is written in itself ("English", "Español"): that is how
 *   the reader recognizes theirs. The button shows the code (PT, EN, ES).
 * - The current one is marked by a ✓ and `aria-current`, never by color alone.
 * - Plain links (<a>): switching reloads the page, each language has its own
 *   document. Closed, the menu stays in the HTML: the links exist for crawlers
 *   and agents even if nobody opens it.
 * - The site never redirects by browser language: the choice is the reader's.
 */
export function LanguageSwitcher({ languages, mode = "menu", labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const current = languages.find((l) => l.current) ?? languages[0];

  if (mode === "list") {
    return (
      <nav aria-label={t.nav} className={className}>
        <ul className="flex list-none flex-wrap items-center gap-x-1 gap-y-0">
          {languages.map((l) => (
            <li key={l.lang}>
              <a
                href={l.href}
                lang={l.lang}
                hrefLang={l.lang}
                aria-current={l.current ? "true" : undefined}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm ${
                  l.current ? "font-semibold text-ink" : "text-ink/80 underline underline-offset-4"
                }`}
              >
                {l.current && <Check size={15} />}
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div
      ref={box}
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={t.change(codeOf(current), typeof current.label === "string" ? current.label : codeOf(current))}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 items-center gap-1.5 rounded-full border border-ink/25 px-3 text-[0.8125rem] font-semibold text-ink transition-colors duration-150 hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
      >
        {/* between 768 and 1023px the whole menu shares the row with the CTA: the globe goes, only the code stays */}
        <Globe />
        <span aria-hidden="true">{codeOf(current)}</span>
      </button>
      <ul
        id={id}
        className={`absolute right-0 top-full z-50 mt-2 min-w-[11rem] list-none origin-top-right rounded-[20px] bg-white p-1.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)] transition duration-150 ease-out motion-reduce:transition-none ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {languages.map((l) => (
          <li key={l.lang}>
            <a
              href={l.href}
              lang={l.lang}
              hrefLang={l.lang}
              aria-current={l.current ? "true" : undefined}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center justify-between gap-3 rounded-[14px] px-3.5 text-sm font-medium text-ink hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
            >
              {l.label}
              {l.current && <Check />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
