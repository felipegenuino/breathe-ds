import type { ElementType, ReactNode } from "react";
import { Button } from "./Button";
import { Pill } from "./Pill";

export type PillItem = { label: ReactNode; href: string; meta?: ReactNode };
/** @deprecated use PillItem */
export type Pill_ = PillItem;

type Props = {
  title?: ReactNode;
  /** Each item is a Pill: `#anchor` hrefs get the down arrow, page links the diagonal one. */
  items: PillItem[];
  /** Optional "See all" link. */
  seeAll?: { label: ReactNode; href?: string };
  linkComponent?: ElementType;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 flex-none" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

/**
 * Pill list: a wrapping row of Pills ("Conditions we treat", the video groups
 * of a page with "11 videos" as meta), plus an optional "See all" link.
 */
export function PillList({ title, items, seeAll, linkComponent }: Props) {
  return (
    <div>
      {title && (
        <h2 className="mb-6 font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
      )}
      <ul className="flex list-none flex-wrap gap-2.5">
        {items.map((p, i) => (
          <li key={`${i}-${p.href}`}>
            <Pill href={p.href} meta={p.meta} linkComponent={linkComponent}>{p.label}</Pill>
          </li>
        ))}
      </ul>
      {seeAll && (
        <div className="mt-6">
          {seeAll.href ? (
            <Button href={seeAll.href} variant="link">{seeAll.label} <ArrowUpRight /></Button>
          ) : (
            <Button variant="link">{seeAll.label} <ArrowUpRight /></Button>
          )}
        </div>
      )}
    </div>
  );
}
