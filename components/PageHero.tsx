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
   *  text at full contrast (8.85:1 on ttcab). `card`: white. `callout`: the
   *  colour of the Callout ("info well"), a step deeper (0.6.12). */
  tone?: "alt" | "card" | "callout";
  /** `panel` (default): the rounded band with the tools inside. `centered`: the
   *  Apple search page — no box, title and lead centred, one search below on the
   *  page colour; refining filters live outside, after the results begin. */
  variant?: "panel" | "centered";
  /** Photo wall (0.6.12, from metodorta's professionals page): real portraits
   *  (4:5) in three columns drifting slowly up on the right half of the panel,
   *  fading into the band on the left so the title sits on a clean background;
   *  on phones, one strip of faces moving sideways at the top. Decorative
   *  (aria-hidden, alt=""), still with prefers-reduced-motion. Needs ≥ 6 photos;
   *  replaces the watermark. `panel` variant only. */
  photos?: string[];
  className?: string;
};

/** The photo wall of `PageHero` (CSS animation, no JS: 70–95 s a lap, the
 *  middle column the other way). Content is doubled, so the loop has no jump. */
function PhotoWall({ photos }: { photos: string[] }) {
  const columns = [0, 1, 2].map((c) => photos.filter((_, i) => i % 3 === c));
  const speed = ["animate-[cg-wall-up_80s_linear_infinite]", "animate-[cg-wall-up_95s_linear_infinite_reverse]", "animate-[cg-wall-up_70s_linear_infinite]"];
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="absolute inset-y-0 right-0 hidden w-[52%] grid-cols-3 gap-3 px-3 [mask-image:linear-gradient(to_right,transparent,black_38%),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect] lg:grid">
        {columns.map((col, c) => (
          <div key={c} className="overflow-hidden">
            <div className={`flex flex-col [&>img]:mb-3 motion-reduce:!animate-none ${speed[c]}`}>
              {[...col, ...col].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" width={384} height={480} decoding="async" className="aspect-[4/5] w-full rounded-[20px] object-cover" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden pt-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:hidden">
        <div className="flex w-max [&>img]:mr-2 motion-reduce:!animate-none animate-[cg-wall-side_60s_linear_infinite]">
          {[...photos.slice(0, 12), ...photos.slice(0, 12)].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" width={384} height={480} decoding="async" className="aspect-[4/5] w-24 shrink-0 rounded-2xl object-cover sm:w-28" />
          ))}
        </div>
      </div>
    </div>
  );
}

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
export function PageHero({ title, lead, note, breadcrumb, children, watermark, tone = "alt", variant = "panel", photos, className = "" }: Props) {
  const wall = photos && photos.length >= 6 ? photos : null;
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
      <section className={`relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[28px] md:rounded-[32px] ${tone === "card" ? "bg-card" : tone === "callout" ? "bg-callout" : "bg-surface-alt"}`}>
        {wall && <PhotoWall photos={wall} />}
        {watermark && !wall && (
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-16 -z-10 hidden w-[min(34vw,420px)] md:block">
            {watermark}
          </span>
        )}
        <div className={`relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${wall ? "pt-[clamp(28px,5vw,88px)] pb-[clamp(32px,5vw,88px)] lg:min-h-[30rem]" : "py-[clamp(36px,6vw,72px)]"}`}>
          {breadcrumb && <div className="mb-6">{breadcrumb}</div>}
          <div className={wall ? "max-w-xl lg:max-w-[46%]" : undefined}>
            <Heading as="h1" size="display" className="text-balance">
              {title}
            </Heading>
            {lead && <p className="m-0 mt-4 max-w-xl text-lg leading-relaxed text-ink-body">{lead}</p>}
            {note && <p className="m-0 mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{note}</p>}
          </div>
          {children && <div className={`mt-[clamp(24px,4vw,40px)] ${wall ? "lg:max-w-[52%]" : ""}`}>{children}</div>}
        </div>
      </section>
    </div>
  );
}
