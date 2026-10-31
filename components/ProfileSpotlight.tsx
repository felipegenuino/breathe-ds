import type { ComponentType, ReactNode } from "react";
import { LivingPortrait, type ProfessionalLiving } from "./ProfessionalCard";

type Props = {
  name: string;
  /** Small line above the name ("Idealizadora", "Course coordinator"). */
  eyebrow?: ReactNode;
  /** What the person does, under the name, one tone below. */
  role?: ReactNode;
  /** Council registration (CREFITO): the family rule for health professionals. */
  registration?: ReactNode;
  /** The bio: a string (one paragraph) or your own paragraphs. */
  bio?: ReactNode;
  /** The still portrait (4:5). With `living`, it is the fallback if the clip fails. */
  photo: { src: string; alt?: string };
  /** Living portrait: the clip plays muted while the mouse is on the block. */
  living?: ProfessionalLiving;
  /** Your own image element (e.g. next/image) in place of the photo; must fill the box. */
  media?: ReactNode;
  /** Links or buttons at the foot ("Watch the presentation", "Curriculum ↗"). */
  actions?: ReactNode;
  /** Social profiles at the foot (Instagram, LinkedIn, Lattes…): round icon
   *  links, each with its name for screen readers, opening in a new tab. */
  social?: { label: string; href: string; Icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean | "true" }> }[];
  /** sr-only after each social link. */
  newTabLabel?: string;
  /** `card`: on a white card. `plain` (default): straight on the page color. */
  variant?: "plain" | "card";
  /** h2 for a page section (default), h3 inside a section that already has one. */
  headingLevel?: "h2" | "h3";
  id?: string;
  className?: string;
};

/**
 * Profile spotlight of the Cuidado Global family: one person in focus — the
 * founder, a course coordinator, a guest. Portrait on the left (photo or the
 * living portrait of the team pages), then eyebrow, name, role, registration,
 * bio and actions. Stacks on phones (portrait on top). The whole block is the
 * hover target of the living portrait.
 */
export function ProfileSpotlight({ name, eyebrow, role, registration, bio, photo, living, media, actions, social, newTabLabel = "(opens in a new tab)", variant = "plain", headingLevel = "h2", id, className = "" }: Props) {
  const H = headingLevel;
  const card = variant === "card";
  return (
    <article
      id={id}
      data-cg-professional-card
      className={`grid items-center gap-8 md:grid-cols-[minmax(220px,360px)_1fr] md:gap-[clamp(32px,6vw,88px)] ${card ? "rounded-[28px] bg-card p-5 md:p-8" : ""} ${id ? "scroll-mt-24" : ""} ${className}`}
    >
      <div className="overflow-hidden rounded-2xl bg-ink/[0.06]">
        {living ? (
          <LivingPortrait src={living.src} poster={living.poster} photo={photo} media={media} alt={photo.alt ?? name} decorative className="aspect-[4/5]" />
        ) : (
          media ?? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt="" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
          )
        )}
      </div>
      <div className="min-w-0">
        {eyebrow && <p className="m-0 mb-3 font-heading text-sm font-semibold text-ink-soft">{eyebrow}</p>}
        <H className="m-0 font-heading text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.1] font-medium tracking-[-0.015em] text-ink">{name}</H>
        {role && <p className="mt-4 mb-0 max-w-[52ch] text-lg leading-snug text-ink-body">{role}</p>}
        {registration && <p className="mt-2 mb-0 text-sm text-ink-soft">{registration}</p>}
        {bio && (
          <div className="mt-6 flex max-w-[60ch] flex-col gap-4 leading-relaxed text-ink-body [&>p]:m-0">
            {typeof bio === "string" ? <p>{bio}</p> : bio}
          </div>
        )}
        {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
        {social?.length ? (
          <ul className={`m-0 flex list-none flex-wrap gap-2 p-0 ${actions ? "mt-5" : "mt-7"}`}>
            {social.map(({ label, href, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.07] text-ink transition-colors duration-200 hover:bg-ink hover:text-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
                >
                  <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
                  <span className="sr-only">
                    {label} {newTabLabel}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
