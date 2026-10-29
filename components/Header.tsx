"use client";

import { useState, type ReactNode, type ElementType } from "react";

export type NavChild = {
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  description?: ReactNode;
};
export type NavItem = {
  label: ReactNode;
  href?: string;
  active?: boolean;
  /** Icon before the label (e.g. a house on "Home"). */
  icon?: ReactNode;
  /** Only the icon shows; the label is left for screen readers (site convention: "Home" is the house). */
  iconOnly?: boolean;
  children?: NavChild[];
  /** Final link of the dropdown. Arrow → (goes to another page of the site); with
   *  `external` it becomes ↗ (leaves to another site), as in the other components. */
  seeAll?: { label: ReactNode; href: string; external?: boolean };
};

type Labels = {
  /** aria-label of the desktop nav */
  nav: string;
  /** aria-label of the chevron button that toggles a dropdown */
  openSubmenu: string;
};

const EN: Labels = {
  nav: "Main",
  openSubmenu: "Open submenu",
};

type Props = {
  /** Brand (pass your own logo, already linked to the home page if you want). */
  logo: ReactNode;
  items: NavItem[];
  /** The app's link component (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** CTA on the right (e.g. Book/WhatsApp). */
  cta?: ReactNode;
  /** Locale switcher (slot). */
  localeSwitcher?: ReactNode;
  /** Strings (English defaults); the app passes the ones for its locale. */
  labels?: Partial<Labels>;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const linkCls = (active?: boolean) =>
  `relative flex min-h-11 items-center gap-1.5 font-heading text-[0.95rem] font-semibold whitespace-nowrap text-ink underline decoration-2 underline-offset-[6px] ${
    active ? "decoration-ink" : "decoration-transparent hover:decoration-ink/40"
  } transition-[text-decoration-color] duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink`;

function Dropdown({ item, L, t }: { item: NavItem; L: ElementType; t: Labels }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <span className="flex items-center gap-0.5">
        {item.href ? (
          <L href={item.href} className={linkCls(item.active)}>
            {item.label}
          </L>
        ) : (
          <span className={linkCls(item.active)}>{item.label}</span>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-label={t.openSubmenu}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 items-center rounded-md px-0.5 text-ink/70 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Chevron open={open} />
        </button>
      </span>

      <div className={`absolute top-full left-0 z-50 pt-2 ${open ? "" : "pointer-events-none"}`}>
        <ul
          className={`w-[19rem] list-none rounded-2xl border border-line bg-surface p-2 shadow-[0_18px_40px_-16px_rgba(20,71,83,0.4)] transition duration-150 ease-out motion-reduce:transition-none ${
            open ? "visible scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"
          }`}
        >
          {item.children!.map((c, i) => (
            <li key={i}>
              <L
                href={c.href}
                onClick={() => setOpen(false)}
                // with a description the icon sits with the label's first line (creeta);
                // label only: centred on the bubble, and a two-line label stays tight
                className={`flex ${c.description ? "items-start" : "items-center"} gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-ink/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                {c.icon && (
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink/[0.08] text-ink">
                    {c.icon}
                  </span>
                )}
                <span>
                  <span className="block font-heading text-[0.95rem] leading-snug font-semibold text-ink">
                    {c.label}
                  </span>
                  {c.description && (
                    <span className="mt-0.5 block text-sm text-ink-soft">{c.description}</span>
                  )}
                </span>
              </L>
            </li>
          ))}
          {item.seeAll && (
            <li className="mt-1 border-t border-line pt-1">
              <L
                href={item.seeAll.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 font-heading text-[0.92rem] font-semibold text-ink transition-colors hover:bg-ink/[0.05]"
              >
                {item.seeAll.label}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                  {item.seeAll.external ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
                </svg>
              </L>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/**
 * Header of the Cuidado Global family. On desktop (lg+): brand + nav with
 * dropdowns (hover/keyboard, icons on sub-items) + locale + CTA. On mobile:
 * brand + locale + CTA (navigation moves to the BottomNav). Injectable deps:
 * `logo`, `cta`, `localeSwitcher` as slots; the app's `Link` via `linkComponent`.
 */
export function Header({ logo, items, linkComponent, cta, localeSwitcher, labels }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="shrink-0">{logo}</div>

        <nav aria-label={t.nav} className="hidden items-center gap-6 lg:flex xl:gap-7">
          {items.map((item, i) =>
            item.children?.length ? (
              <Dropdown key={i} item={item} L={L} t={t} />
            ) : (
              <L key={i} href={item.href} aria-current={item.active ? "page" : undefined} className={linkCls(item.active)}>
                {item.icon && <span aria-hidden="true" className="flex">{item.icon}</span>}
                {item.iconOnly ? <span className="sr-only">{item.label}</span> : item.label}
              </L>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {localeSwitcher}
          {cta}
        </div>
      </div>
    </header>
  );
}
