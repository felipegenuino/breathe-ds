import type { ElementType, ReactNode } from "react";
import { Avatar } from "./Avatar";

export type Person = { name: string; href?: string; photo?: string; avatar?: ReactNode };

type Props = {
  people: Person[];
  /** Small line above the names ("Who explains"). With it, the avatars stack
   *  and the names go on their own line; without it, one inline line:
   *  avatar · name · action. */
  eyebrow?: ReactNode;
  /** Hide the portraits (the card already shows a big photo of the person). */
  hideAvatars?: boolean;
  /** Small line under the name(s), aligned with them ("Physiotherapist").
   *  Ignored when there is an `eyebrow`. */
  subtitle?: ReactNode;
  /** Link after the name(s) ("Watch the video ↗"). */
  action?: { label: ReactNode; href: string; external?: boolean };
  /** Joiners between names: ", " and " and ". */
  joiners?: { sep: string; last: string };
  /** Wrap the names in <cite> (a testimonial's author). */
  cite?: boolean;
  /** sr-only after an external action link. */
  newTabLabel?: string;
  linkComponent?: ElementType;
  className?: string;
};

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

const nameLink =
  "underline decoration-ink/30 underline-offset-4 transition-colors duration-150 hover:decoration-ink motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

/**
 * Byline — who signs or explains a piece of content, from novo.creeta:
 * - group ("Quem explica" under the timeline): stacked portraits, an eyebrow
 *   and the names, each one a link to the person's card;
 * - inline (under a topic card): portrait, name and "Watch the video ↗".
 * Portraits are decorative: the names carry the information.
 */
export function Byline({ people, eyebrow, subtitle, hideAvatars = false, action, joiners = { sep: ", ", last: " and " }, cite = false, newTabLabel = "(opens in a new tab)", linkComponent, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  // portraits stack with a ring (as on the site); initials would lose their letters, so they sit side by side
  const stack = people.length > 1 && people.every((p) => p.photo || p.avatar);
  const row = `flex shrink-0 ${stack ? "-space-x-2" : "gap-1.5"}`;
  const Names: ElementType = cite ? "cite" : "span";
  const names = people.map((p, i) => (
    <span key={p.name}>
      {i > 0 && (i === people.length - 1 ? joiners.last : joiners.sep)}
      {p.href ? (
        <L href={p.href} className={nameLink}>{p.name}</L>
      ) : (
        p.name
      )}
    </span>
  ));
  // min-h-11 keeps the 44px tap target; -my-3 takes those extra 12px out of the
  // flow, so when the link wraps under the names the two lines read as one caption
  const actionEl = action ? (
    <L
      href={action.href}
      {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="-my-3 inline-flex min-h-11 items-center gap-1 font-semibold text-ink underline underline-offset-4"
    >
      {action.label}
      <ArrowUpRight />
      {action.external && <span className="sr-only"> {newTabLabel}</span>}
    </L>
  ) : null;

  if (subtitle && !eyebrow) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className={hideAvatars ? "hidden" : row}>
          {people.map((p) => (
            <Avatar key={p.name} name={p.name} photo={p.photo} size={people.length === 1 ? 40 : 36} ring={stack}>{p.avatar}</Avatar>
          ))}
        </span>
        <div className="leading-snug">
          <p className="m-0 text-sm font-semibold text-ink">
            <Names className="not-italic">{names}</Names>
            {actionEl && <> · {actionEl}</>}
          </p>
          <p className="m-0 mt-0.5 text-sm text-ink-soft">{subtitle}</p>
        </div>
      </div>
    );
  }

  if (eyebrow) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
          <span className={row}>
          {people.map((p) => (
            <Avatar key={p.name} name={p.name} photo={p.photo} size={36} ring={stack}>{p.avatar}</Avatar>
          ))}
        </span>
        <div className="leading-snug">
          <p className="m-0 text-sm text-ink/80">{eyebrow}</p>
          <p className="m-0 mt-0.5 font-semibold text-ink">
            <Names className="not-italic">{names}</Names>
            {actionEl && <> · {actionEl}</>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <p className={`m-0 flex items-center gap-3 text-sm text-ink/80 ${className}`}>
      {people.length === 1 ? (
        <Avatar name={people[0].name} photo={people[0].photo} size={40}>{people[0].avatar}</Avatar>
      ) : (
        <span className={row}>
          {people.map((p) => (
            <Avatar key={p.name} name={p.name} photo={p.photo} size={36} ring={stack}>{p.avatar}</Avatar>
          ))}
        </span>
      )}
      <span className="flex flex-wrap items-center gap-x-2">
        <Names className="not-italic font-semibold text-ink">{names}</Names>
        {actionEl}
      </span>
    </p>
  );
}

