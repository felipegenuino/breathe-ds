"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { initials } from "./Avatar";
import { ProfessionalModal, type ProfessionalModalLabels, type ProfessionalPresentation } from "./ProfessionalModal";
import { CollapseRow, LinkRow, RowList, type RowLink } from "./Rows";

export type ProfessionalPhoto = {
  src: string;
  /** Default: `labels.portrait(name)` ("Portrait of {name}"). */
  alt?: string;
  srcSet?: string;
  /** Default: one of three columns from lg, two from sm, full width on phones. */
  sizes?: string;
};

export type ProfessionalLiving = {
  /** Short muted clip, back-and-forth (first frame == last frame). */
  src: string;
  /** The clip's first frame: it is the still portrait. Same frame the clip
   *  starts and ends on, so there is no jump when it plays or stops. */
  poster: string;
};

/**
 * One row at the foot of the full card (RowList). Generic: the site decides
 * what the rows are. On novo.creeta they are "Trajetória" (collapse with the
 * bio), "Orientações" (collapse with the links the person signs, with
 * `openOnArrival`) and "Instagram" (link with icon, new tab).
 */
export type ProfessionalCardRow =
  | {
      kind: "collapse";
      label: ReactNode;
      /** sr-only right after the label, e.g. " of Person name". */
      srLabel?: ReactNode;
      /** Text content (a string becomes one paragraph). */
      content?: ReactNode;
      /** Or a list of links, with the count beside the label. */
      links?: RowLink[];
      count?: number;
      /** Marks the row with `data-cg-open-on-arrival`: the site opens it when
       *  the page is reached by the card's anchor (creeta's `abre-ao-chegar`). */
      openOnArrival?: boolean;
    }
  | {
      kind: "link";
      label: ReactNode;
      href: string;
      srLabel?: ReactNode;
      /** ↗ another page (default) or ↓ an anchor on this page. */
      arrow?: "go" | "down";
      /** Opens in a new tab. */
      external?: boolean;
      /** Replaces the arrow (an 18px glyph): the Instagram icon, for instance. */
      icon?: ReactNode;
    };

export type ProfessionalCardLabels = ProfessionalModalLabels & {
  /** alt of the portrait. */
  portrait: (name: string) => string;
  /** The small badge on the medium card's photo, on hover ("Conhecer"). */
  meet: string;
};

const EN: Omit<ProfessionalCardLabels, keyof ProfessionalModalLabels> = {
  portrait: (name) => `Portrait of ${name}`,
  meet: "Meet",
};

const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

/** The photo zooms in a little with the mouse over the card, as on the home. */
const ZOOM =
  "aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 ease-[var(--ease-cg)] motion-reduce:transition-none";
const ZOOM_CARD = `${ZOOM} [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-[1.03] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-100`;
/* medium card: the 3:4 portrait, zoom with the mouse over the link */
const ZOOM_MEDIUM =
  "aspect-[3/4] h-auto w-full object-cover transition-transform duration-500 ease-[var(--ease-cg)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100";
/* inside the modal trigger only the photo button is the hover target */
const ZOOM_PHOTO = `${ZOOM} [@media(hover:hover)_and_(pointer:fine)]:group-hover/photo:scale-[1.03] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover/photo:scale-100`;

type LivingProps = ProfessionalLiving & {
  /** The usual photo. Only shows if the video fails. */
  photo: ProfessionalPhoto;
  /** Replaces the fallback <img> (e.g. next/image). */
  media?: ReactNode;
  /** alt text read when the clip is decoration beside the name (sr-only). */
  alt: string;
  /** Empty alt when the text beside already says who it is. */
  decorative?: boolean;
  className?: string;
};

/**
 * Portrait that comes alive with the mouse over the card — novo.creeta's
 * `FotoViva` (components/foto-viva.tsx).
 *
 * What is seen still is the poster, the clip's own first frame. With the
 * mouse over, the clip loops. On leave it does not cut: it finishes the way
 * back to the first frame. The clip goes there and back, so the frame at t is
 * the one at (duration − t): if the mouse leaves on the way out, it jumps to
 * the mirrored point (same image) and plays only the way back.
 *
 * Only with a fine pointer (desktop); on touch the poster stays, because the
 * tap on the photo already has a job (opens the presentation of who has one).
 * People who asked for less motion also keep the poster. The clip only
 * downloads on the first hover. If the video fails, the photo takes over.
 *
 * The hover target is the whole card: the closest `[data-cg-professional-card]`,
 * <article> or <a>, else the parent.
 */
export function LivingPortrait({ src, poster, photo, media, alt, decorative = false, className = "" }: LivingProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const card = v.closest("[data-cg-professional-card], article, a") ?? v.parentElement;
    if (!card) return;
    const canAnimate = () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enter = () => {
      if (!canAnimate()) return;
      v.loop = true;
      v.play().catch(() => {});
    };
    const leave = () => {
      const d = v.duration;
      if (!Number.isFinite(d) || d === 0) {
        // no data yet: nothing to finish
        v.pause();
        return;
      }
      if (v.paused) return;
      if (v.currentTime < d / 2) v.currentTime = d - v.currentTime;
      v.loop = false;
    };
    // reached the end of the way back: the last frame equals the first
    const onEnded = () => {
      v.currentTime = 0;
      v.loop = true;
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    v.addEventListener("ended", onEnded);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  if (failed) {
    return (
      <span data-portrait="living" className={`relative block ${className}`}>
        {media ?? (
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes={photo.sizes ?? SIZES}
            alt={decorative ? "" : alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </span>
    );
  }

  return (
    <span data-portrait="living" className={`relative block ${className}`}>
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!decorative && <span className="sr-only">{alt}</span>}
    </span>
  );
}

type PortraitProps = {
  name: string;
  photo?: ProfessionalPhoto;
  media?: ReactNode;
  living?: ProfessionalLiving;
  alt: string;
  decorative?: boolean;
  className: string;
};

/** The card's portrait: living clip, custom media, or the plain <img>. */
function Portrait({ photo, media, living, alt, decorative = false, className }: PortraitProps) {
  if (living) {
    return (
      <LivingPortrait
        src={living.src}
        poster={living.poster}
        photo={photo ?? { src: living.poster }}
        media={media}
        alt={alt}
        decorative={decorative}
        className={className}
      />
    );
  }
  if (media) return <>{media}</>;
  if (!photo) return null;
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.sizes ?? SIZES}
      alt={decorative ? "" : alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

type Props = {
  name: string;
  /** Second line under the name (the profession), in `ink-soft`. */
  role?: ReactNode;
  /** Registration line (CREFITO). The family rule: a health professional
   *  always shows the council number. */
  registration?: ReactNode;
  /** The still portrait (3:4 source, shown 4:5). Without it (and without
   *  `media`/`living`), the initials in a tinted bubble. */
  photo?: ProfessionalPhoto;
  /** Your own image element (e.g. next/image) in place of `photo`. Give it
   *  the box yourself (`aspect-[4/5] w-full object-cover`). */
  media?: ReactNode;
  /** Living portrait: the clip plays muted on hover; `photo` is the fallback. */
  living?: ProfessionalLiving;
  /** With a presentation video the portrait opens the modal (ProfessionalModal). */
  presentation?: ProfessionalPresentation;
  /** The full bio, shown in the presentation modal: a string (one paragraph)
   *  or your own paragraphs. To show it on the card too, put it in a
   *  `rows` collapse. */
  bio?: ReactNode;
  /** The rows at the foot of the card (full size): collapses with text or
   *  links, links with an arrow or an icon. See ProfessionalCardRow. */
  rows?: ProfessionalCardRow[];
  /** Anchor of the card (a link elsewhere on the site lands here). */
  id?: string;
  /** `full` (default): the team-page card. `medium`: the home's tile — a
   *  white card with the 3:4 portrait and the name, a link to the full card
   *  (living portrait and "Meet" badge on hover). `micro`: the "who treats"
   *  row — 72px photo, name and role, also a link. The small sizes render the
   *  link as the root; wrap them in your <li> (RailItem). */
  size?: "full" | "medium" | "micro";
  /** Where the small sizes lead: the full card on the team page ("/team/#slug"). */
  href?: string;
  /** Name shown on the medium card (the site uses the first two words). */
  shortName?: string;
  /** h2 on the team page (default), h3 inside a section that already has an h2. */
  headingLevel?: "h2" | "h3";
  /** Root element. Default <article>. */
  as?: ElementType;
  /** Link component of the app for the guidance links (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  labels?: Partial<ProfessionalCardLabels>;
  className?: string;
};

/**
 * Team card of the Cuidado Global family — novo.creeta's `ProfessionalCard`
 * (components/professional-card.tsx) with the Breathe tokens. A `card`
 * surface with the portrait on top (plain, living, or opening the video
 * presentation), the name, role and registration, then one list of equal
 * rows separated by hairlines (`rows`): collapses that open in place (a text,
 * or a list of links with the count) and links (arrow or icon). On creeta:
 * Trajectory, Guidance and Instagram. Six open bios used to make the page
 * 6,700px tall on a phone, hence the collapses.
 *
 * A collapse with `openOnArrival` carries `data-cg-open-on-arrival`: the site
 * opens it when the page is reached by the card's anchor (creeta's
 * `abre-ao-chegar.tsx`, not part of the DS).
 */
export function ProfessionalCard({
  name,
  role,
  registration,
  photo,
  media,
  living,
  presentation,
  bio,
  rows,
  id,
  size = "full",
  href = "#",
  shortName,
  headingLevel: Heading = "h2",
  as: As = "article",
  linkComponent,
  labels,
  className = "",
}: Props) {
  const t = { ...EN, ...labels };
  const L: ElementType = linkComponent ?? "a";
  const alt = photo?.alt ?? t.portrait(name);
  const hasPortrait = Boolean(photo || media || living);

  if (size === "micro") {
    // the "who treats" row of a treatment page (creeta telas/tratamento.tsx):
    // the text beside says who it is, so the photo is decoration
    return (
      <L
        href={href}
        id={id}
        className={`flex items-center gap-4 rounded-[22px] bg-card p-3 pr-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
      >
        {photo ? (
          <img src={photo.src} srcSet={photo.srcSet} sizes="72px" alt="" loading="lazy" decoding="async" className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover" />
        ) : media ? (
          <span className="block h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl">{media}</span>
        ) : (
          <span aria-hidden="true" className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-ink/[0.12] font-heading text-xl font-medium text-ink">
            {initials(name)}
          </span>
        )}
        <span>
          <span className="block font-heading font-medium leading-snug text-ink">{name}</span>
          {role && <span className="mt-0.5 block text-sm text-ink-soft">{role}</span>}
        </span>
      </L>
    );
  }

  if (size === "medium") {
    // the home's team tile (creeta telas/home.tsx): a white card with the
    // photo and the name inside — without the card the name sat loose under
    // the photo, with no "close". Mouse over: the clip plays, the photo zooms
    // a little and a discreet "Meet" shows in the corner; on tap the card shrinks.
    return (
      <L
        href={href}
        id={id}
        data-cg-professional-card=""
        className={`group block h-full rounded-[26px] bg-card p-2 pb-4 transition-transform duration-200 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
      >
        <span className="relative block overflow-hidden rounded-[20px]">
          {hasPortrait ? (
            <Portrait name={name} photo={photo ? { ...photo, sizes: photo.sizes ?? "(min-width: 768px) 16vw, 42vw" } : undefined} media={media} living={living} alt={alt} decorative className={ZOOM_MEDIUM} />
          ) : (
            <span aria-hidden="true" className="flex aspect-[3/4] w-full items-center justify-center bg-ink/[0.12] font-heading text-3xl font-medium text-ink">
              {initials(name)}
            </span>
          )}
          {/* only where a mouse exists, and with keyboard focus; the link
              already has its name, so it is decoration */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-2 inline-flex translate-y-1 items-center gap-1.5 rounded-full border border-white/15 bg-ink/80 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-md transition duration-200 ease-out group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
          >
            {t.meet}
            <svg aria-hidden="true" viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </span>
        </span>
        <span className="mt-3 block px-1.5 font-heading text-sm font-medium leading-snug text-ink transition-colors duration-150 group-hover:text-ink-soft motion-reduce:transition-none">
          {shortName ?? name}
        </span>
      </L>
    );
  }

  return (
    <As id={id} data-cg-professional-card="" className={`group/card scroll-mt-24 rounded-2xl bg-card p-3 pb-6 ${className}`}>
      {hasPortrait && presentation ? (
        // with a presentation video, the photo opens the modal
        <ProfessionalModal
          name={name}
          role={role}
          registration={registration}
          bio={bio}
          presentation={presentation}
          labels={labels}
          portrait={<Portrait name={name} photo={photo} media={media} living={living} alt={alt} decorative className={ZOOM_PHOTO} />}
        />
      ) : hasPortrait ? (
        <span className="block overflow-hidden rounded-[20px]">
          <Portrait name={name} photo={photo} media={media} living={living} alt={alt} className={ZOOM_CARD} />
        </span>
      ) : (
        <div
          data-testid="initials"
          aria-hidden="true"
          className="flex aspect-[3/4] w-full items-center justify-center rounded-[20px] bg-ink/[0.12]"
        >
          <span className="font-heading text-4xl font-bold text-ink">{initials(name)}</span>
        </div>
      )}
      <div className="px-3 pt-5">
        <Heading className="font-heading text-xl font-medium leading-snug text-ink">{name}</Heading>
        {role && <p className="mt-1 text-sm font-semibold text-ink-soft">{role}</p>}
        {registration && (
          <>
            {/* /80 = 5.78:1 on white (creeta) — the CREFITO has a legal
                visibility duty (COFFITO 414/2012); /60 gave 3.37:1 and failed AA. */}
            <p className="mt-1 text-xs text-ink/80">{registration}</p>
          </>
        )}
        {/* One list of equal rows. On creeta they used to be three things
            with three designs (an open button, a loose list of links and a
            magenta link at the end); the collapses open in place. */}
        {rows && rows.length > 0 && (
          <RowList className="mt-4">
            {rows.map((row, i) =>
              row.kind === "collapse" ? (
                <CollapseRow
                  key={i}
                  label={row.label}
                  srLabel={row.srLabel}
                  count={row.count}
                  links={row.links}
                  linkComponent={L}
                  {...(row.openOnArrival ? { "data-cg-open-on-arrival": "" } : {})}
                >
                  {row.content}
                </CollapseRow>
              ) : (
                <LinkRow key={i} label={row.label} srLabel={row.srLabel} href={row.href} arrow={row.arrow} external={row.external} icon={row.icon} linkComponent={L} />
              ),
            )}
          </RowList>
        )}
      </div>
    </As>
  );
}
