"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type ElementType } from "react";

export type NavChild = {
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  description?: ReactNode;
  /** The link leaves to another site (e.g. the methods' own sites): opens in a new
   *  tab, with ↗ at the end of the row and `labels.newTab` for screen readers.
   *  The family pattern for it: the brand symbol as `icon`, the domain as `description`. */
  external?: boolean;
  /** `layout: "cards"` only: the photo that fills the card (decorative: the label is
   *  written over it). Pass a small file (~640px wide); it only loads the first time
   *  the menu opens. */
  image?: string;
  /** CSS `object-position` of the photo (e.g. "50% 30%"). */
  imagePosition?: string;
  /** `layout: "cards"` only: small line above the label ("Método RTA"). With `groups`,
   *  defaults to the group's label. */
  eyebrow?: ReactNode;
  /** `layout: "cards"` only: short tag on the top-left corner ("30% off"), in the action colour. */
  badge?: ReactNode;
};
export type NavItem = {
  label: ReactNode;
  href?: string;
  active?: boolean;
  /** A top-level link (no dropdown) that leaves to another site (e.g. the schedule on its
   *  own domain): opens in a new tab, with ↗ after the label and `labels.newTab` for screen readers. */
  external?: boolean;
  /** Icon before the label (e.g. a house on "Home"). */
  icon?: ReactNode;
  /** Only the icon shows; the label is left for screen readers (site convention: "Home" is the house). */
  iconOnly?: boolean;
  children?: NavChild[];
  /** Final link of the dropdown. Arrow → (goes to another page of the site); with
   *  `external` it becomes ↗ (leaves to another site), as in the other components. */
  seeAll?: { label: ReactNode; href: string; external?: boolean };
  /** Instead of `children`: labelled groups of links (e.g. "Navigation", "Content"). */
  groups?: { label: ReactNode; children: NavChild[] }[];
  /** Long dropdowns: 2 columns of compact rows (max 2, as in the rest of the DS). */
  columns?: 1 | 2;
  /** Which edge of the trigger the dropdown aligns to; "end" keeps a wide menu inside the viewport. */
  align?: "start" | "end";
  /** `cards`: a wide panel under the whole header with one photo card per sub-item
   *  (`image`, `eyebrow`, `badge`), four per row, and `seeAll` as the last card. For the
   *  few things the site sells or teaches (courses, treatments), where the photo helps to
   *  choose; plain lists stay the default. `groups` are flattened (the group label becomes
   *  the card's eyebrow); `columns` and `align` do not apply. */
  layout?: "list" | "cards";
};

type Labels = {
  /** aria-label of the desktop nav */
  nav: string;
  /** aria-label of the chevron button that toggles a dropdown */
  openSubmenu: string;
  /** read after the label of an `external` sub-item */
  newTab: string;
};

const EN: Labels = {
  nav: "Main",
  openSubmenu: "Open submenu",
  newTab: "(opens in a new tab)",
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
  // the card photos only mount the first time the menu opens: nobody downloads them
  // on a page where the menu stays closed
  const [seen, setSeen] = useState(false);
  const show = (v: boolean) => {
    if (v) setSeen(true);
    setOpen(v);
  };
  const cards = item.layout === "cards";
  // cards: the panel is wide and the mouse reaches it diagonally, passing over the
  // neighbouring items; closing waits a moment so that trip does not shut the menu
  const closing = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(closing.current), []);
  const two = item.columns === 2;
  const gid = useId();
  // a mouse that hovered already opened the menu: its click on the chevron must not close it
  const hovering = useRef(false);
  const renderChild = (c: NavChild) => {
    // another site: a plain <a> (the app's Link is for its own routes), in a new tab
    const Tag: ElementType = c.external ? "a" : L;
    return (
      <Tag
        href={c.href}
        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => setOpen(false)}
        // with a description the icon sits with the label's first line (creeta);
        // label only, or an external row (the description is one short line, the
        // domain): centred on the bubble, and a two-line label stays tight
        className={`flex ${c.description && !c.external ? "items-start" : "items-center"} gap-3 rounded-xl px-2.5 ${item.groups ? "py-1" : two ? "py-1.5" : "py-2"} transition-colors hover:bg-ink/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      >
        {c.icon && (
          <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-tint text-ink">
            {c.icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className={`block font-heading ${two ? "text-[0.9rem]" : "text-[0.95rem]"} leading-snug font-semibold text-ink`}>
            {c.label}
          </span>
          {c.description && (
            <span className="mt-0.5 block text-sm text-ink-soft">{c.description}</span>
          )}
          {c.external && <span className="sr-only"> {t.newTab}</span>}
        </span>
        {c.external && (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        )}
      </Tag>
    );
  };
  return (
    <div
      // cards: not `relative` (the panel anchors to the header's container, full width)
      // and as tall as the header, so the mouse never leaves the item on its way down
      className={cards ? "flex h-20 items-center" : "relative"}
      onMouseEnter={() => {
        hovering.current = true;
        window.clearTimeout(closing.current);
        show(true);
      }}
      onMouseLeave={() => {
        hovering.current = false;
        if (cards) closing.current = window.setTimeout(() => setOpen(false), 180);
        else setOpen(false);
      }}
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
          onClick={() => show(hovering.current ? true : !open)}
          className="flex min-h-11 items-center rounded-md px-0.5 text-ink/70 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Chevron open={open} />
        </button>
      </span>

      {cards ? (
        <div className={`absolute inset-x-0 top-full z-50 px-4 md:px-6 ${open ? "" : "pointer-events-none"}`}>
          <ul
            className={`mx-auto grid w-full max-w-[1180px] list-none grid-cols-4 gap-2 rounded-3xl border border-line bg-surface p-2 shadow-[0_18px_40px_-16px_color-mix(in_srgb,var(--color-shadow)_40%,transparent)] transition duration-150 ease-out motion-reduce:transition-none ${
              open ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"
            }`}
          >
            {(item.groups ? item.groups.flatMap((g) => g.children.map((c) => ({ ...c, eyebrow: c.eyebrow ?? g.label }))) : item.children!).map((c, i) => {
              const Tag: ElementType = c.external ? "a" : L;
              return (
                <li key={i}>
                  <Tag
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => setOpen(false)}
                    // the MediaCard language in menu size: photo to the edges, ink film, text over it
                    className="group/card relative isolate flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {seen && c.image && (
                      <img
                        src={c.image}
                        alt=""
                        decoding="async"
                        style={c.imagePosition ? { objectPosition: c.imagePosition } : undefined}
                        className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-[1.05] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-100"
                      />
                    )}
                    <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 via-45% to-transparent to-80%" />
                    {c.badge && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-action px-2.5 py-1 font-heading text-xs leading-none font-bold text-on-action">
                        {c.badge}
                      </span>
                    )}
                    {c.eyebrow && <span className="block text-xs leading-snug text-white/80">{c.eyebrow}</span>}
                    <span className="mt-0.5 block font-heading text-[0.95rem] leading-snug font-semibold text-balance">{c.label}</span>
                    {c.external && <span className="sr-only"> {t.newTab}</span>}
                  </Tag>
                </li>
              );
            })}
            {item.seeAll && (
              <li>
                <L
                  href={item.seeAll.href}
                  onClick={() => setOpen(false)}
                  className="group/all flex aspect-[16/10] flex-col justify-between rounded-2xl bg-tint p-3.5 text-ink transition-colors hover:bg-ink/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
                >
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center self-end rounded-full bg-card text-ink transition-colors group-hover/all:bg-action group-hover/all:text-on-action motion-reduce:transition-none">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                      {item.seeAll.external ? <path d="M7 17 17 7M9 7h8v8" /> : <path d="M5 12h14M13 6l6 6-6 6" />}
                    </svg>
                  </span>
                  <span className="block font-heading text-[0.95rem] leading-snug font-semibold">{item.seeAll.label}</span>
                </L>
              </li>
            )}
          </ul>
        </div>
      ) : (
      <div className={`absolute top-full ${item.align === "end" ? "right-0" : "left-0"} z-50 pt-2 ${open ? "" : "pointer-events-none"}`}>
        <ul
          className={`${two ? (item.groups ? "w-[34rem] columns-2 gap-x-4" : "grid w-[34rem] grid-cols-2 gap-x-1") : "w-[19rem]"} list-none rounded-2xl border border-line bg-surface p-2 shadow-[0_18px_40px_-16px_color-mix(in_srgb,var(--color-shadow)_40%,transparent)] transition duration-150 ease-out motion-reduce:transition-none ${
            open ? "visible scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0"
          }`}
        >
          {item.groups
            ? item.groups.map((g, gi) => (
                <li key={gi} className="break-inside-avoid pb-5 last:pb-1">
                  <p id={`${gid}-${gi}`} className="px-2.5 pt-2 pb-0.5 font-heading text-[0.7rem] font-bold tracking-[0.12em] text-ink-soft uppercase">
                    {g.label}
                  </p>
                  <ul aria-labelledby={`${gid}-${gi}`} className="list-none">
                    {g.children.map((c, i) => (
                      <li key={i}>{renderChild(c)}</li>
                    ))}
                  </ul>
                </li>
              ))
            : item.children!.map((c, i) => <li key={i}>{renderChild(c)}</li>)}
          {item.seeAll && (
            <li className={`mt-1 border-t border-line pt-1 ${two ? "col-span-2 [column-span:all]" : ""}`}>
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
      )}
    </div>
  );
}

/**
 * Header of the Cuidado Global family. On desktop (lg+): brand + nav with
 * dropdowns (hover/keyboard, icons on sub-items; `layout: "cards"` for a wide
 * panel of photo cards) + locale + CTA. On mobile:
 * brand + locale + CTA (navigation moves to the BottomNav). Injectable deps:
 * `logo`, `cta`, `localeSwitcher` as slots; the app's `Link` via `linkComponent`.
 */
export function Header({ logo, items, linkComponent, cta, localeSwitcher, labels }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  // own view-transition-name: the header stays still while the screen changes (ScreenTransition)
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur [view-transition-name:cabecalho]">
      <div className="relative mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="shrink-0">{logo}</div>

        <nav aria-label={t.nav} className="hidden items-center gap-6 lg:flex xl:gap-7">
          {items.map((item, i) =>
            item.children?.length || item.groups?.length ? (
              <Dropdown key={i} item={item} L={L} t={t} />
            ) : item.external ? (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={linkCls(false)}>
                {item.icon && <span aria-hidden="true" className="flex">{item.icon}</span>}
                {item.iconOnly ? <span className="sr-only">{item.label}</span> : item.label}
                <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} className="text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
                <span className="sr-only"> {t.newTab}</span>
              </a>
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
