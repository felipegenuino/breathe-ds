import type { ReactNode } from "react";

// "p": heading look without being a heading (a pull quote, a display line)
type Level = "h1" | "h2" | "h3" | "h4" | "p";
/** The family's heading scale (novo.creeta):
 *  display — page title (SectionHeading as h1) · hero — title over a full-bleed photo/video
 *  section — section title (h2) · card — title inside a card · small — h3 */
export type HeadingSize = "display" | "hero" | "section" | "card" | "small";

export const HEADING_SIZE: Record<HeadingSize, string> = {
  display: "text-[2.5rem] leading-[1.04] tracking-[-0.02em] md:text-6xl",
  hero: "text-[2rem] leading-[1.06] tracking-[-0.02em] md:text-5xl xl:text-6xl xl:leading-[1.04]",
  section: "text-[1.75rem] leading-[1.12] tracking-[-0.01em] md:text-4xl",
  card: "text-[1.375rem] leading-snug md:text-2xl",
  small: "text-xl leading-snug",
};
const DEFAULT_SIZE: Record<Level, HeadingSize> = { h1: "display", h2: "section", h3: "small", h4: "small", p: "section" };

type HeadingProps = {
  as?: Level;
  size?: HeadingSize;
  children: ReactNode;
  /** Second sentence of the same heading, on its own line, one tone below
   *  (`ink-soft`): "Aprenda com quem atende. / Quem criou o método explica." */
  accent?: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Heading — Quicksand medium in `ink`; the optional `accent` sentence sits on
 * the next line in `ink-soft`. Two tones, same heading: the hierarchy comes
 * from color, not from a second element.
 */
export function Heading({ as: Tag = "h2", size, children, accent, id, className = "" }: HeadingProps) {
  const s = size ?? DEFAULT_SIZE[Tag];
  return (
    <Tag id={id} className={`m-0 font-heading font-medium text-ink ${HEADING_SIZE[s]} ${className}`}>
      {children}
      {accent && (
        <>
          {" "}
          <span className="block text-ink-soft">{accent}</span>
        </>
      )}
    </Tag>
  );
}

type SectionHeadingProps = {
  /** `h1` on an inner page (its main title), `h2` for a home section. */
  as?: "h1" | "h2";
  /** Only when the content really is a sequence ("01"). */
  number?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Second sentence, one tone below. */
  accent?: ReactNode;
  /** Supporting paragraph right under the title. */
  lead?: ReactNode;
  id?: string;
  className?: string;
};

/**
 * SectionHeading — the SectionHeading of novo.creeta: eyebrow/number line in
 * `ink-soft` semibold, the title (display as h1, section as h2) with its
 * accent sentence, and the lead (text-lg, reading width). Carries the bottom
 * margin of a section opening.
 */
export function SectionHeading({ as: Tag = "h2", number, eyebrow, title, accent, lead, id, className = "" }: SectionHeadingProps) {
  const main = Tag === "h1";
  return (
    <div className={`${main ? "mb-8 md:mb-12" : "mb-6 md:mb-9"} ${className}`}>
      {(number || eyebrow) && (
        <p className="m-0 mb-3 flex items-center gap-2 text-sm font-semibold text-ink-soft">
          {number && <span>{number}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}
      <Heading as={Tag} size={main ? "display" : "section"} accent={accent} id={id}>
        {title}
      </Heading>
      {lead && <p className="m-0 mt-4 max-w-xl text-lg leading-relaxed text-ink-body">{lead}</p>}
    </div>
  );
}
