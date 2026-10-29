import type { ComponentType, ElementType, ReactNode } from "react";
import { LanguageSwitcher, type Language } from "./LanguageSwitcher";
import { List } from "./List";

/** lucide-style icon component (the footer sets the size). */
type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export type FooterLink = { href: string; label: ReactNode };
export type FooterContact = { href: string; label: ReactNode; Icon: IconType; external?: boolean };
export type FooterLanguage = Language;

type Labels = {
  /** aria-label of the pages nav */
  pagesNav: string;
  /** aria-label of the contacts list */
  contacts: string;
  /** aria-label of the languages nav */
  languages: string;
  /** sr-only after an external link */
  newTab: string;
};
const EN: Labels = { pagesNav: "Footer pages", contacts: "Contacts", languages: "Language", newTab: "(opens in a new tab)" };

type Props = {
  /** Signed brand: the Lockup (horizontal + tagline) or the site's own svg. */
  logo: ReactNode;
  /** Full institutional name for screen readers (the logo is an image). */
  brandName?: string;
  /** The brand sentence, shown in quotes under the logo. */
  quote?: ReactNode;
  /** "Pages": title on the first line, links in two columns below. Optional:
   *  a footer with no internal links drops the column (two-column grid). */
  pages?: { title: ReactNode; links: FooterLink[] };
  /** "Where we are": address lines, opening hours, and the directions links
   *  ("Directions ↗ · Waze ↗", external). */
  where: { title: ReactNode; address: ReactNode[]; hours?: ReactNode; directions?: FooterLink[] };
  /** Optional notice band (e.g. "Health insurance: we work by reimbursement"):
   *  title, one sentence per item (corner arrow), a CTA and a footnote. */
  notice?: { title: ReactNode; items: ReactNode[]; action?: ReactNode; footnote?: ReactNode; id?: string };
  /** Legal line. REQUIRED in the family: institutional name · CNPJ (company registration). */
  legal: ReactNode;
  /** Contact chips: phone, WhatsApp, e-mail, Instagram… only the real ones. */
  contacts?: FooterContact[];
  /** Language links, side by side, no JavaScript. The current one gets a ✓ and aria-current. */
  languages?: FooterLanguage[];
  /** Small credits line at the very end (photo authors…). */
  credits?: ReactNode;
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** Breakpoint from which the BottomNav is gone (md on creeta, lg on ttcab):
   *  below it the card keeps room at the bottom for the floating bar. */
  navHiddenFrom?: "md" | "lg";
  labels?: Partial<Labels>;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

const title = "font-heading text-lg font-medium text-ink";
const link =
  "flex min-h-11 items-center text-ink/80 underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-ink motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const strongLink =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-ink/[0.08] px-4 text-sm font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-surface motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * Footer of the Cuidado Global family — the site-footer of novo.creeta, by
 * tokens, edge to edge like the Header (the card version was dropped on 2026-10-29):
 * signed logo + the brand sentence, "Pages" (title on the first line, links in
 * two columns), "Where we are" (address, hours, "Directions ↗ · Waze ↗" — the
 * map only loads on tap, elsewhere), an optional notice band on `surface`
 * (page color), then the legal line with the CNPJ (always) and the contact
 * chips, and the languages as plain links (work without JavaScript).
 * Below the BottomNav breakpoint the card leaves room at the bottom for the bar.
 */
export function Footer({
  logo,
  brandName,
  quote,
  pages,
  where,
  notice,
  legal,
  contacts = [],
  languages,
  credits,
  linkComponent,
  navHiddenFrom = "lg",
  labels,
  className = "",
}: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  // whole class names: Tailwind only generates what it finds written in the code
  // Edge to edge like the Header (family decision 2026-10-29), same inner width
  // and side padding (px-4 md:px-6). Below the BottomNav breakpoint the bottom
  // padding leaves room for the floating bar.
  const outer = navHiddenFrom === "md" ? "mt-16 pb-28 md:mt-24 md:pb-14" : "mt-16 pb-28 lg:mt-24 lg:pb-14";
  const noticeId = notice?.id ?? "footer-notice";

  return (
    <footer className={`${outer} bg-card py-10 text-ink md:py-14 ${className}`}>
      <div className="mx-auto max-w-[1600px] px-4 md:px-6">
        {/* without the pages column, "where" keeps to the right edge (auto width) */}
        <div className={`grid gap-x-10 gap-y-10 ${pages ? "md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)]" : "md:grid-cols-[minmax(0,1fr)_auto]"}`}>
          <div>
            {logo}
            {brandName && <p className="sr-only">{brandName}</p>}
            {quote && (
              <p className="mt-6 max-w-[18rem] font-heading text-xl leading-snug text-ink-body">“{quote}”</p>
            )}
          </div>

          {pages && (
            <nav aria-label={t.pagesNav}>
              <h2 className={title}>{pages.title}</h2>
              <div className="mt-3 grid gap-x-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {pages.links.map((p, i) => (
                  <L key={`${i}-${p.href}`} href={p.href} className={link}>
                    {p.label}
                  </L>
                ))}
              </div>
            </nav>
          )}

          <div>
            <h2 className={title}>{where.title}</h2>
            <address className="mt-3 not-italic leading-relaxed text-ink/80">
              {where.address.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </address>
            {where.hours && <p className="mt-2 leading-relaxed text-ink/80">{where.hours}</p>}
            {where.directions && where.directions.length > 0 && (
              <p className="mt-2">
                {where.directions.map((d, i) => (
                  <span key={`${i}-${d.href}`}>
                    {i > 0 && <span aria-hidden="true" className="mx-2 text-ink/80">·</span>}
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className={strongLink}>
                      {d.label}
                      <ArrowUpRight />
                      <span className="sr-only"> {t.newTab}</span>
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>

        {/* Notice band: `surface` (the page color) over the white card. One
            sentence per item, with the corner arrow; the arrow is decoration,
            the <ul> is what says "list". Always at reading width (max-w-6xl),
            narrower than the full-width columns. */}
        {notice && (
          <section aria-labelledby={noticeId} className="mx-auto mt-10 max-w-6xl rounded-[24px] bg-surface px-6 py-8 text-ink md:mt-12 md:px-10 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div>
                <h2 id={noticeId} className="font-heading text-2xl font-medium leading-snug md:text-[1.75rem]">
                  {notice.title}
                </h2>
                <List marker="arrow" className="mt-4" items={notice.items.map((label) => ({ label }))} />
              </div>
              {notice.action && <div className="w-full shrink-0 sm:w-auto sm:self-start lg:self-center [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto">{notice.action}</div>}
            </div>
            {notice.footnote && <p className="mt-6 border-t border-ink/10 pt-4 text-xs text-ink/80">{notice.footnote}</p>}
          </section>
        )}

        {/* Legal line (institutional name · CNPJ) + contact chips */}
        <div className="mt-10 flex flex-col gap-5 border-t border-ink/10 pt-6 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-ink/80">{legal}</p>
          {contacts.length > 0 && (
            <ul aria-label={t.contacts} className="flex list-none flex-wrap gap-2">
              {contacts.map(({ href, label, Icon, external }, i) => (
                <li key={`${i}-${href}`}>
                  <a className={chip} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <Icon aria-hidden="true" size={17} strokeWidth={2} />
                    {label}
                    {external && <span className="sr-only"> {t.newTab}</span>}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Languages as plain links: they work without JavaScript */}
        {languages && languages.length > 0 && (
          <div className="mt-4 border-t border-ink/10 pt-2">
            <LanguageSwitcher mode="list" languages={languages} labels={{ nav: t.languages }} />
          </div>
        )}

        {credits && <p className="mt-4 text-xs text-ink/80">{credits}</p>}
      </div>
    </footer>
  );
}

