import type { ComponentType, ElementType, ReactNode } from "react";

/** lucide-style icon component (the card sets the size). */
type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

export type InfoCardLink = {
  href: string;
  label: ReactNode;
  /** Opens in a new tab (always a plain <a>) with an sr-only note after the label. */
  external?: boolean;
};

type Props = {
  /** Icon in the tinted bubble above the title (lucide, 20px, stroke 1.75). */
  Icon: IconType;
  title: ReactNode;
  /** h2 on a page section (default), h3 inside a section that already has an h2. */
  headingLevel?: "h2" | "h3";
  /** Address lines: one <address> block, lines separated by <br>. */
  address?: ReactNode[];
  /** Body: one paragraph per item. */
  lines?: ReactNode[];
  /** Smaller closing line (e.g. "Outside these hours, by appointment"). */
  note?: ReactNode;
  /** Custom body, rendered after `address`/`lines`/`note`. */
  children?: ReactNode;
  /** Action links at the bottom ("Directions ↗ · Waze ↗"): underlined semibold,
   *  outbound arrow, separated by a middle dot. */
  links?: InfoCardLink[];
  /** Wrapper element. `section` by default; `li` inside a list of cards. */
  as?: "section" | "div" | "li" | "article";
  /** Link component of the app for page links (external links always use <a>). */
  linkComponent?: ElementType;
  /** sr-only after an external link. */
  newTabLabel?: string;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

const body = "mt-2 leading-relaxed text-ink/80";
const link =
  "mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * Info card of the Cuidado Global family — the three white cards of the
 * novo.creeta clinic page ("Address", "Opening hours", "Where we see
 * patients") and the contact page: a 44px tinted bubble with the icon, the
 * title, the body (address lines, paragraphs, a smaller note) and, at the
 * bottom, the action links with the outbound arrow, separated by a middle
 * dot ("Directions ↗ · Waze ↗"). White on the page color (`surface`), 28px
 * radius, 24px padding (32px from md).
 */
export function InfoCard({
  Icon,
  title,
  headingLevel: Heading = "h2",
  address,
  lines,
  note,
  children,
  links,
  as: Tag = "section",
  linkComponent,
  newTabLabel = "(opens in a new tab)",
  className = "",
}: Props) {
  const L: ElementType = linkComponent ?? "a";

  return (
    <Tag className={`rounded-2xl bg-card p-6 md:p-8 ${className}`}>
      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.12] text-ink">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <Heading className="mt-4 font-heading text-xl font-medium text-ink">{title}</Heading>

      {address && address.length > 0 && (
        <address className={`${body} not-italic`}>
          {address.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </address>
      )}
      {lines?.map((line, i) => (
        <p key={i} className={body}>
          {line}
        </p>
      ))}
      {note && <p className={`${body} text-sm`}>{note}</p>}
      {children}

      {links?.map((l, i) => (
        <span key={`${i}-${l.href}`}>
          {i > 0 && <span aria-hidden="true" className="mx-2 text-ink/80">·</span>}
          {l.external ? (
            <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
              {l.label}
              <ArrowUpRight />
              <span className="sr-only"> {newTabLabel}</span>
            </a>
          ) : (
            <L href={l.href} className={link}>
              {l.label}
              <ArrowUpRight />
            </L>
          )}
        </span>
      ))}
    </Tag>
  );
}
