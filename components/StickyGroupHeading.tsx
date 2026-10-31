import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Lighter info after the title, e.g. the count ("51 profissionais"). */
  meta?: ReactNode;
  id?: string;
  /** h2 by default; h3 inside a section that already has an h2. */
  as?: "h2" | "h3";
  /** Where it sticks: below the site's sticky header. Pass a literal Tailwind
   *  class written in your source (`top-20` = an 80px header), so it gets generated. */
  stickyTop?: string;
  className?: string;
};

/**
 * StickyGroupHeading — the title of a group in a long list that stays at the
 * top while its items scroll by, and is pushed away by the next group's title
 * (the section headers of Apple's lists, Contacts A–Z). Used on ttcab's
 * professionals directory, one group per state.
 *
 * It sticks inside its own group: put it as the first child of the group's
 * wrapper (a <section>), so the next wrapper pushes it out. The band bleeds
 * 16/24px past the content so the hairline and the blurred page colour cover
 * the cards passing under it; `surface` at 90% keeps the title at full
 * contrast (ink on surface, 9.41:1 on ttcab) even without backdrop-filter.
 */
export function StickyGroupHeading({ children, meta, id, as: Tag = "h2", stickyTop = "top-20", className = "" }: Props) {
  return (
    <Tag
      id={id}
      className={`sticky ${stickyTop} z-10 -mx-4 flex items-baseline gap-3 border-b border-line bg-surface/90 px-4 py-3 font-heading text-xl font-medium text-ink backdrop-blur-md md:-mx-6 md:px-6 ${className}`}
    >
      {children}
      {meta && <span className="text-sm font-normal text-ink-soft tabular-nums">{meta}</span>}
    </Tag>
  );
}
