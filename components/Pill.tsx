import type { ElementType, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /** Lighter supporting info after the label, e.g. "4 videos". */
  meta?: ReactNode;
  /** Link component of the app for page links (anchors always use <a>). */
  linkComponent?: ElementType;
  className?: string;
};

/**
 * Pill that leads somewhere — the Atalho of novo.creeta, the site's only white
 * pill (information-only pills are labels, not this).
 *
 * What says "tap me" is not the color, it is the shape: a full pill, 44px
 * tall, with an arrow in a circle. The arrow also says where it goes: down
 * when it is on the same page (an anchor), diagonal when it opens another page.
 */
export function Pill({ href, children, meta, linkComponent, className = "" }: Props) {
  const onPage = href.startsWith("#");
  const L: ElementType = onPage ? "a" : linkComponent ?? "a";
  const classes = `group inline-flex min-h-11 items-center gap-2 rounded-full bg-card py-1.5 pl-4 pr-1.5 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition duration-200 hover:bg-ink hover:text-surface active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${className}`;
  return (
    <L href={href} className={classes}>
      <span>{children}</span>
      {meta && <span className="font-normal text-ink/80 group-hover:text-surface/85">{meta}</span>}
      <span
        aria-hidden="true"
        data-arrow={onPage ? "down" : "other-page"}
        className="ml-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.12] transition-colors duration-200 group-hover:bg-surface/15 motion-reduce:transition-none"
      >
        {onPage ? (
          <svg viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-down" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
        )}
      </span>
    </L>
  );
}
