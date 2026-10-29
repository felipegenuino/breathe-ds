import type { ElementType, ReactNode } from "react";

export type StoryPillar = { title: ReactNode; text: ReactNode };
export type StoryLink = { label: ReactNode; href: string; external?: boolean };

type Labels = {
  /** sr-only after an external link. */
  newTab: string;
};
const EN: Labels = { newTab: "(opens in a new tab)" };

type Props = {
  /** What fills the media box at the top: a BackgroundVideo, an <img>
   *  (absolute inset-0, object-cover). The panel's film fades it into the panel. */
  media: ReactNode;
  /** Box of the media: 4:3 on the phone, 21:8 from md (creeta). */
  mediaAspect?: string;
  /** Logo for the dark background, at the base of the media where the film is already full. */
  logo?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Three columns with a hairline on top: a short title and a paragraph. */
  pillars: StoryPillar[];
  /** Outbound links at the end ("Learn about the method ↗"). */
  links?: StoryLink[];
  headingLevel?: "h2" | "h3";
  /** Colour of the pillar titles. Default `text-surface`; creeta passes its light teal. */
  pillarTitleClassName?: string;
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

const link =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface";

/**
 * Story panel of the Cuidado Global family — creeta's `OrigemRta`, by tokens:
 * a dark panel (surface-panel) that groups a story in one piece. Media at the
 * top with a film that fades into the panel, the logo at its base, a title and
 * a lead, three pillars in columns with a hairline above each, and the outbound
 * links. Good for "who we are" blocks: one rounded card, everything inside.
 */
export function StoryPanel({
  media,
  mediaAspect = "aspect-[4/3] md:aspect-[21/8]",
  logo,
  title,
  lead,
  pillars,
  links,
  headingLevel: Title = "h2",
  pillarTitleClassName = "text-surface",
  linkComponent,
  labels,
  className = "",
}: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  return (
    <section className={`overflow-hidden rounded-[28px] bg-surface-panel text-surface ${className}`}>
      <div className={`relative ${mediaAspect}`}>
        {media}
        {/* -bottom-px: the box's height is fractional and a light half pixel showed under the film */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -bottom-px bg-gradient-to-t from-surface-panel from-10% via-surface-panel/70 via-40% to-surface-panel/10" />
        {logo && <div className="absolute bottom-2 left-6 md:bottom-4 md:left-12">{logo}</div>}
      </div>

      <div className="px-6 pb-9 pt-7 md:px-12 md:pb-14 md:pt-9">
        <Title className="max-w-3xl font-heading text-[1.75rem] font-medium leading-[1.12] tracking-[-0.01em] md:text-5xl">{title}</Title>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-surface/85">{lead}</p>}

        <ul className="mt-8 grid list-none gap-6 md:mt-12 md:grid-cols-3 md:gap-10">
          {pillars.map((p, i) => (
            <li key={i} className="border-t border-surface/25 pt-5">
              <p className={`font-heading text-2xl font-medium ${pillarTitleClassName}`}>{p.title}</p>
              <p className="mt-2 leading-relaxed text-surface/85">{p.text}</p>
            </li>
          ))}
        </ul>

        {links && links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1 md:mt-10">
            {links.map((l, i) =>
              l.external ? (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {l.label}
                  <ArrowUpRight />
                  <span className="sr-only"> {t.newTab}</span>
                </a>
              ) : (
                <L key={i} href={l.href} className={link}>
                  {l.label}
                  <ArrowUpRight />
                </L>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
