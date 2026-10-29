import type { ElementType, ReactNode } from "react";
import { Avatar } from "./Avatar";

type Props = {
  name: string;
  /** Second line: role · registration ("Physiotherapist · CREFITO-10/…"). The
   *  family rule: a health professional always shows the council number. */
  description?: ReactNode;
  photo?: string;
  avatar?: ReactNode;
  /** With an href the chip is a link (to the person's card) and shows the arrow bubble. */
  href?: string;
  linkComponent?: ElementType;
  className?: string;
};

/**
 * Person chip — the "who signs" of a novo.creeta article: one pill with the
 * portrait, the name and, below, role and registration. With a link it leads
 * to the person's card and the arrow says so, like the site's shortcuts.
 */
export function PersonChip({ name, description, photo, avatar, href, linkComponent, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const hasPhoto = Boolean(photo || avatar);
  const inner = (
    <>
      <Avatar name={name} photo={photo} size={44}>{avatar}</Avatar>
      <span className="leading-snug">
        <span className="block font-semibold text-ink">{name}</span>
        {description && <span className="block text-[0.8125rem] text-ink/80">{description}</span>}
      </span>
    </>
  );
  const box = `inline-flex min-h-11 items-center gap-3 rounded-full bg-card py-1.5 ${hasPhoto ? "pl-1.5" : "pl-5"}`;
  if (!href) return <p className={`m-0 ${box} pr-5 ${className}`}>{inner}</p>;
  return (
    <L
      href={href}
      className={`${box} pr-1.5 transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      {inner}
      <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.12] text-ink">
        <svg viewBox="0 0 24 24" width={15} height={15} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
      </span>
    </L>
  );
}

