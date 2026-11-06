import type { ReactNode } from "react";
import { Button } from "./Button";
import { SectionHeading } from "./Heading";
import { LinkRow, RowList } from "./Rows";

/**
 * Evidence block of the family (0.6.11, 06/11/2026): the ttcab section made the
 * standard. Two columns: heading, lead and "see all" on the left (sticky while
 * reading), the articles on the right, one row each: title in bold, authors
 * below joined by " · ", without affiliation marks or degrees. Sites pass the
 * articles, the link to the full list and the lead (what the collection is
 * about); the eyebrow, title and link text are the ones validated on ttcab.
 * Put it inside your section's Container.
 */
const COPY = {
  pt: { eyebrow: "Evidência", title: "Referências científicas", all: "Ver todos os artigos" },
  en: { eyebrow: "Evidence", title: "Scientific references", all: "See all articles" },
  es: { eyebrow: "Evidencia", title: "Referencias científicas", all: "Ver todos los artículos" },
} as const;

// degrees the PDFs glue to the names ("Nathan Watemberg MDa", "Stephanie Nichter, DPT, PT, CCI1")
const DEGREES = new Set(["MD", "MDa", "PhD", "PT", "DPT", "MS", "MSN", "MSPT", "RN", "CRNP", "AuD", "AS", "CCI", "R.T.", "(R)", "(CT)", "RT"]);

/**
 * Authors as a clean list (the ttcab cleaning): no affiliation numbers or
 * symbols (1,2 * †), no loose affiliation letters (",a"), no degrees, and the
 * mixed separators of the records (& • · ; , and e) unified.
 */
export function authorNames(raw: string | undefined): string[] {
  if (!raw) return [];
  const clean = raw
    .replace(/[\d*†‡§]+/g, "")
    .replace(/,\s*[a-d](?=[\s,]|$)/g, ",")
    .replace(/\s+/g, " ");
  return clean
    .split(/\s*(?:;|•|·|&|,\s*(?:and|e)\s+|\s+and\s+|\s+e\s+(?=[A-ZÀ-Ú])|,)\s*/)
    .map((name) =>
      name
        .split(" ")
        .filter((w) => w && !DEGREES.has(w) && !DEGREES.has(w.replace(/[,.]$/, "")))
        .join(" ")
        .replace(/[,.\s]+$/, "")
        .trim(),
    )
    .filter((name) => name.split(" ").length >= 2 || /^[A-ZÀ-Ú][a-zà-ú]+[A-Z]/.test(name));
}

/** "Ana Lima1, Beto Souza PhD e Caio Reis." → "Ana Lima · Beto Souza · Caio Reis" */
export const authorLine = (raw: string | string[] | undefined) =>
  (Array.isArray(raw) ? raw : authorNames(raw)).join(" · ");

export type EvidenceArticle = {
  href: string;
  title: string;
  /** Raw authors from the record, or an already clean list. */
  authors?: string | string[];
  /** Language of the title when it differs from the page (e.g. "en"). */
  lang?: string;
};

type Props = {
  items: EvidenceArticle[];
  /** Where "see all" points (the site's article list). */
  allHref: string;
  /** What the collection is about (one sentence, from the site). */
  lead?: ReactNode;
  locale?: "pt" | "en" | "es";
  /** Override only when the client asks; the default is the standard. */
  eyebrow?: string;
  title?: string;
  allLabel?: string;
  headingId?: string;
};

export function EvidenceSection({ items, allHref, lead, locale = "pt", eyebrow, title, allLabel, headingId }: Props) {
  const c = COPY[locale];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="lg:sticky lg:top-44 lg:self-start">
        <SectionHeading id={headingId} eyebrow={eyebrow ?? c.eyebrow} title={title ?? c.title} lead={lead} />
        <div className="mt-6">
          <Button variant="link" href={allHref}>
            {allLabel ?? c.all} →
          </Button>
        </div>
      </div>
      <RowList>
        {items.map((a) => {
          const authors = authorLine(a.authors);
          return (
            <LinkRow
              key={a.href}
              className="py-4"
              href={a.href}
              label={
                <>
                  <span className="block" lang={a.lang}>{a.title}</span>
                  {authors && <span className="mt-1 block text-sm font-normal text-ink-soft">{authors}</span>}
                </>
              }
            />
          );
        })}
      </RowList>
    </div>
  );
}
