"use client";

import { useId, useState, type ElementType, type ReactNode } from "react";
import { ArrowRight, ChevronDown, FileText } from "lucide-react";
import { FADE_IN } from "./Rows";

export type PublicationCardLabels = {
  /** The toggle ("Resumo"). */
  abstract: string;
  /** sr-only word before the title after the toggle and the PDF link ("de" → "Resumo de {title}").
   *  A plain string so a server component can pass it. */
  of: string;
  pdf: string;
  newTab: string;
  /** Footer link of the compact card ("Ler o artigo"). */
  read: string;
};

const EN: PublicationCardLabels = {
  abstract: "Abstract",
  of: "of",
  pdf: "PDF",
  newTab: "(opens in a new tab)",
  read: "Read the article",
};

type Props = {
  /** Plain title (sr-only labels). */
  title: string;
  /** Language of the title and abstract when it differs from the page ("en"). */
  lang?: string;
  /** The study type, shown as a small tag ("Ensaio clínico randomizado"). */
  kind?: ReactNode;
  /** Topics, in a lighter line beside the tag. */
  topics?: ReactNode[];
  /** Authors, already shortened ("Ana Souza e mais 3 autores"). */
  byline?: ReactNode;
  /** The publication's page on the site. */
  href?: string;
  /** The full PDF, opened in a new tab. */
  pdf?: string;
  /** Abstract paragraphs (structured abstracts keep Background / Methods… apart). */
  abstract?: string[];
  /** Language of the abstract if it differs from the title's. */
  abstractLang?: string;
  headingLevel?: "h2" | "h3";
  /** `full` (default): the library row, abstract opening in place.
   *  `compact`: the "related articles" tile — same height as its neighbours,
   *  tag and topics on two fixed lines, and a footer pinned to the bottom with
   *  "read the article" on the left and the PDF on the right. */
  variant?: "full" | "compact";
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  labels?: Partial<PublicationCardLabels>;
  className?: string;
};

/** "Background: text" -> the label in bold, so a structured abstract can be scanned. */
export function abstractLabel(p: string): { label?: string; text: string } {
  const m = p.match(/^([A-Z][A-Za-z ]{2,22}|[A-ZÀ-Ú ]{3,22}):\s*(.+)$/);
  return m ? { label: m[1].replace(/\s+/g, " ").trim(), text: m[2] } : { text: p };
}

/** The paragraphs of an abstract, labels in bold. */
export function AbstractText({ paragraphs, lang, className = "" }: { paragraphs: string[]; lang?: string; className?: string }) {
  return (
    <div lang={lang} className={`flex max-w-[68ch] flex-col gap-3 leading-relaxed text-ink-body ${className}`}>
      {paragraphs.map((p, i) => {
        const { label, text } = abstractLabel(p);
        return (
          <p key={i} className="m-0">
            {label && <strong className="font-semibold text-ink">{label}. </strong>}
            {text}
          </p>
        );
      })}
    </div>
  );
}

const ACTION =
  "inline-flex min-h-11 items-center gap-1.5 rounded-[2px] text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * PublicationCard — one study in a library of scientific articles (ttcab's
 * Artigos). Built on proximity and common region: the white card holds the
 * whole item, the tag and topics sit tight over the title, the authors right
 * under it, and the two actions (open the abstract here, open the PDF) share
 * one row under the authors — never pushed to the far edge of the page.
 *
 * The abstract opens in place (a button with `aria-expanded` controlling the
 * region below, so the PDF link can sit beside the toggle); it fades in with
 * `@starting-style`, no JavaScript animation.
 */
export function PublicationCard({
  title,
  lang,
  kind,
  topics,
  byline,
  href,
  pdf,
  abstract,
  abstractLang,
  headingLevel: H = "h2",
  variant = "full",
  linkComponent,
  labels,
  className = "",
}: Props) {
  const t = { ...EN, ...labels };
  const L: ElementType = linkComponent ?? "a";
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const hasAbstract = Boolean(abstract && abstract.length);

  if (variant === "compact") {
    return (
      <article className={`flex h-full flex-col rounded-[22px] bg-card ${className}`}>
        <div className="flex flex-1 flex-col px-6 pt-6 pb-5">
          {kind && (
            <p className="m-0">
              <span className="inline-block rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-ink">{kind}</span>
            </p>
          )}
          {topics && topics.length > 0 && <p className="m-0 mt-2 text-sm text-ink-soft">{topics.join(" · ")}</p>}
          <H lang={lang} className="mt-3 font-heading text-[1.15rem] leading-snug font-medium text-balance text-ink">
            {href ? (
              <L href={href} className="rounded-[2px] underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none">
                {title}
              </L>
            ) : (
              title
            )}
          </H>
          {byline && <p className="m-0 mt-2 text-sm text-ink-soft">{byline}</p>}
        </div>
        {(href || pdf) && (
          <footer className="flex min-h-14 items-center justify-between gap-4 rounded-b-[22px] border-t border-line bg-surface-alt/60 px-6">
            {href ? (
              <L href={href} tabIndex={-1} aria-hidden="true" className="group/read inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink">
                {t.read}
                <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover/read:translate-x-0.5 motion-reduce:transform-none" />
              </L>
            ) : (
              <span />
            )}
            {pdf && (
              <a href={pdf} target="_blank" rel="noopener noreferrer" className={`${ACTION} underline decoration-ink/35 decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink motion-reduce:transition-none`}>
                <FileText aria-hidden="true" size={16} className="text-ink-soft" />
                {t.pdf}
                <span className="sr-only">{` ${t.of} ${title} ${t.newTab}`}</span>
              </a>
            )}
          </footer>
        )}
      </article>
    );
  }

  return (
    <article className={`rounded-[22px] bg-card p-[clamp(20px,3vw,28px)] ${className}`}>
      {(kind || (topics && topics.length > 0)) && (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-ink-soft">
          {kind && <span className="rounded-full bg-tint px-2.5 py-1 text-xs font-semibold text-ink">{kind}</span>}
          {topics && topics.length > 0 && <span>{topics.join(" · ")}</span>}
        </p>
      )}
      <H lang={lang} className="mt-3 max-w-[64ch] font-heading text-[1.2rem] leading-snug font-medium text-balance text-ink md:text-[1.3rem]">
        {href ? (
          <L
            href={href}
            className="rounded-[2px] underline decoration-transparent decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
          >
            {title}
          </L>
        ) : (
          title
        )}
      </H>
      {byline && <p className="mt-1.5 text-sm text-ink-soft">{byline}</p>}

      {(hasAbstract || pdf) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-6 border-t border-line pt-1">
          {hasAbstract && (
            <button type="button" aria-expanded={open} aria-controls={regionId} onClick={() => setOpen((v) => !v)} className={`group/abs ${ACTION}`}>
              {t.abstract}
              <ChevronDown
                aria-hidden="true"
                size={16}
                className={`text-ink-soft transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : "group-hover/abs:translate-y-0.5"}`}
              />
              <span className="sr-only">{` ${t.of} ${title}`}</span>
            </button>
          )}
          {pdf && (
            <a href={pdf} target="_blank" rel="noopener noreferrer" className={`${ACTION} underline decoration-ink/35 decoration-[1.5px] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink motion-reduce:transition-none`}>
              <FileText aria-hidden="true" size={16} className="text-ink-soft" />
              {t.pdf}
              <span className="sr-only">
                {` ${t.of} ${title} ${t.newTab}`}
              </span>
            </a>
          )}
        </div>
      )}

      {hasAbstract && (
        <div id={regionId} hidden={!open} className={`${FADE_IN} mt-2`}>
          <AbstractText paragraphs={abstract!} lang={abstractLang ?? lang} />
        </div>
      )}
    </article>
  );
}
