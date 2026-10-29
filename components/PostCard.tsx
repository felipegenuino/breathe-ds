import type { ElementType, ReactNode } from "react";

export type PostCover = { src: string; srcSet?: string; sizes?: string };
export type PostDate = { iso: string; label: ReactNode };

type Labels = {
  /** Decorative line at the foot ("Read the guidance"); the link is the title. */
  read: ReactNode;
};
const EN: Labels = { read: "Read more" };

type Props = {
  /** 4:3 at the top, decorative (the title says the subject). */
  cover: PostCover;
  /** Small line above the title ("Respiratory treatment"). */
  category?: ReactNode;
  title: ReactNode;
  href: string;
  /** The first paragraph, clamped to three lines. */
  excerpt: ReactNode;
  author: ReactNode;
  date: PostDate;
  headingLevel?: "h2" | "h3";
  linkComponent?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/**
 * Post card of the Cuidado Global family — creeta's `OrientacaoCartao`, by
 * tokens: the card of one article in the list and in "other posts". The whole
 * card is clickable (the title's link stretches over it) but the link's name
 * stays the title: that is what the screen reader hears.
 */
export function PostCard({ cover, category, title, href, excerpt, author, date, headingLevel: Title = "h2", linkComponent, labels, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...EN, ...labels };
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] bg-card transition-transform duration-200 ease-out active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover.src} srcSet={cover.srcSet} sizes={cover.sizes} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        {category && <p className="mb-2 text-sm font-semibold text-ink-soft">{category}</p>}
        <Title className="font-heading text-xl font-medium leading-snug text-ink md:text-[1.375rem]">
          <L href={href} className="after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ink">
            {title}
          </L>
        </Title>
        <p className="mt-3 line-clamp-3 leading-relaxed text-ink-body">{excerpt}</p>
        <p className="mt-auto pt-5 text-sm text-ink-body">
          <span className="font-semibold text-ink">{author}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={date.iso}>{date.label}</time>
        </p>
        {/* decoration: the link is the title */}
        <p aria-hidden="true" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink-soft">
          {t.read}
          <ArrowUpRight />
        </p>
      </div>
    </article>
  );
}
