import type { ReactNode } from "react";

export type FooterColumn = { title: ReactNode; items: ReactNode[] };

type Props = {
  /** Brand (pass your own <img>/logo). */
  logo: ReactNode;
  /** Tagline/signature under the brand. */
  tagline?: ReactNode;
  /** Navigation columns (the consumer passes its own <Link>s). */
  columns: FooterColumn[];
  /** Contact/address block (title + lines + actions such as "View on map"). */
  contact: { title?: ReactNode; lines: ReactNode[]; actions?: ReactNode };
  /** Optional highlighted block (e.g. "Health insurance: we work by reimbursement"). */
  notice?: ReactNode;
  /** Legal line (company registration number, copyright…). */
  legal?: ReactNode;
  /** Contact chips (phone/WhatsApp/e-mail/Instagram) — the consumer passes the links. */
  chips?: ReactNode[];
  /** Locale switcher (slot). */
  localeSwitcher?: ReactNode;
};

/**
 * Footer of the Cuidado Global family. Large rounded card in `surface`, with
 * brand + navigation + contact, an optional highlighted block, and the bottom
 * bar with legal, contact chips and locales. 100% data-driven and with no app
 * dependency (Link/icons/logo come through props). Tokens: ink/ink-soft on
 * surface, `line` hairlines.
 */
export function Footer({
  logo,
  tagline,
  columns,
  contact,
  notice,
  legal,
  chips,
  localeSwitcher,
}: Props) {
  return (
    <footer className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="mx-auto overflow-hidden rounded-[clamp(24px,3vw,36px)] bg-surface px-[clamp(24px,5vw,72px)] py-[clamp(40px,5vw,64px)] text-ink">
        {/* Top: brand · columns · contact */}
        <div className="grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[1.2fr_1.4fr_1fr]">
          <div>
            <div className="mb-5">{logo}</div>
            {tagline && (
              <p className="max-w-[28ch] text-[1.02rem] leading-[1.5] text-ink-soft">
                {tagline}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {columns.map((col, i) => (
              <div key={i} className={columns.length === 1 ? "col-span-2" : ""}>
                <p className="mb-4 font-body text-[0.78rem] font-semibold tracking-[0.18em] text-ink-soft uppercase">
                  {col.title}
                </p>
                {/* links inherit hover-underline: the underline fades in smoothly
                    from transparent, agnostic to what the site passes (<a> or <Link>) */}
                <ul className="flex flex-col gap-3 [&_a]:underline [&_a]:decoration-transparent [&_a]:underline-offset-[5px] [&_a]:transition-[text-decoration-color] [&_a]:duration-200 [&_a:hover]:decoration-current">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-[1.02rem] leading-snug text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            {contact.title && (
              <p className="mb-4 font-body text-[0.78rem] font-semibold tracking-[0.18em] text-ink-soft uppercase">
                {contact.title}
              </p>
            )}
            <div className="space-y-2 text-[1.02rem] leading-[1.5] text-ink-soft">
              {contact.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {contact.actions && <div className="mt-4">{contact.actions}</div>}
          </div>
        </div>

        {/* Optional highlighted block */}
        {notice && (
          <div className="mt-[clamp(32px,4vw,48px)] rounded-2xl bg-ink/[0.04] p-[clamp(24px,3.5vw,44px)]">
            {notice}
          </div>
        )}

        {/* Bottom bar: legal + chips */}
        <div className="mt-[clamp(32px,4vw,48px)] flex flex-col gap-5 border-t border-line pt-[clamp(20px,2.5vw,28px)] md:flex-row md:items-center md:justify-between">
          {legal && <p className="text-sm text-ink-soft">{legal}</p>}
          {chips && chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {chips.map((chip, i) => (
                <span key={i}>{chip}</span>
              ))}
            </div>
          )}
        </div>

        {/* Locales */}
        {localeSwitcher && (
          <div className="mt-[clamp(20px,2.5vw,28px)]">{localeSwitcher}</div>
        )}
      </div>
    </footer>
  );
}
