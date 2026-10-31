import type { ReactNode } from "react";
import { Heading } from "./Heading";

type Props = {
  title: ReactNode;
  /** Supporting paragraph under the title. */
  lead?: ReactNode;
  /** A smaller line under the lead ("Os artigos estão no idioma original…"). */
  note?: ReactNode;
  /** Above the title: a Breadcrumb. */
  breadcrumb?: ReactNode;
  /** The page's main controls (search, filters), inside the panel: the hero
   *  and the tools that act on the page read as one region. */
  children?: ReactNode;
  /** The site's graphic device, low in the corner (e.g. the brand symbol at
   *  6% in `ink`). Decorative: rendered aria-hidden. */
  watermark?: ReactNode;
  /** `alt` (default): the section band colour (`surface-alt`), light, ink
   *  text at full contrast (8.85:1 on ttcab). `card`: white. */
  tone?: "alt" | "card";
  /** `panel` (default): the rounded band with the tools inside. `centered`: the
   *  Apple search page — no box, title and lead centred, one search below on the
   *  page colour; refining filters live outside, after the results begin. */
  variant?: "panel" | "centered";
  className?: string;
};

/**
 * PageHero — the opening panel of an inner page (a library, a directory).
 * Wide, in novo.creeta's proportion (up to 1600px, 16/24px from the screen
 * edge), rounded 28/32px, with the content aligned to the site's column
 * (max-w-6xl) so the title lines up with the list below.
 *
 * Light on purpose: the white search field and chips stand out on the band,
 * and the panel groups title, explanation and controls (common region)
 * without the weight of a dark panel.
 */
export function PageHero({ title, lead, note, breadcrumb, children, watermark, tone = "alt", variant = "panel", className = "" }: Props) {
  if (variant === "centered") {
    return (
      <section className={`px-4 pt-[clamp(40px,7vw,96px)] pb-[clamp(28px,4vw,48px)] text-center md:px-6 ${className}`}>
        <div className="mx-auto w-full max-w-3xl">
          {breadcrumb && <div className="mb-6 flex justify-center">{breadcrumb}</div>}
          <Heading as="h1" size="display" className="text-balance">
            {title}
          </Heading>
          {lead && <p className="mx-auto m-0 mt-4 max-w-xl text-lg leading-relaxed text-balance text-ink-body">{lead}</p>}
          {note && <p className="mx-auto m-0 mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{note}</p>}
          {children && <div className="mx-auto mt-[clamp(24px,4vw,40px)] max-w-2xl text-left">{children}</div>}
        </div>
      </section>
    );
  }
  return (
    <div className={`px-4 pt-2 md:px-6 md:pt-4 ${className}`}>
      <section className={`relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[28px] md:rounded-[32px] ${tone === "card" ? "bg-card" : "bg-surface-alt"}`}>
        {watermark && (
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-16 -z-10 hidden w-[min(34vw,420px)] md:block">
            {watermark}
          </span>
        )}
        <div className="mx-auto w-full max-w-6xl px-5 py-[clamp(36px,6vw,72px)] sm:px-6 lg:px-8">
          {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
          <Heading as="h1" size="display" className="text-balance">
            {title}
          </Heading>
          {lead && <p className="m-0 mt-4 max-w-xl text-lg leading-relaxed text-ink-body">{lead}</p>}
          {note && <p className="m-0 mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{note}</p>}
          {children && <div className="mt-[clamp(24px,4vw,40px)]">{children}</div>}
        </div>
      </section>
    </div>
  );
}
