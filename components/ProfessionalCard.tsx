"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { initials } from "./Avatar";
import { ProfessionalModal, type ProfessionalModalLabels, type ProfessionalPresentation } from "./ProfessionalModal";
import { CollapseRow, LinkRow, RowList } from "./Rows";

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

export type ProfessionalGuidance = { label: ReactNode; href: string };

export type ProfessionalCardLabels = ProfessionalModalLabels & {
  /** alt of the portrait. */
  portrait: (name: string) => string;
  trajectory: string;
  /** The row of the guidance the person signs; the count goes beside it. */
  guidance: string;
  /** sr-only, right after "Trajectory" and "Guidance": " of {name}". */
  of: (name: string) => string;
  instagram: string;
  /** sr-only, right after "Instagram". */
  instagramOf: (name: string) => string;
};

const EN: Omit<ProfessionalCardLabels, keyof ProfessionalModalLabels> = {
  portrait: (name) => `Portrait of ${name}`,
  trajectory: "Trajectory",
  guidance: "Guidance",
  of: (name) => ` of ${name}`,
  instagram: "Instagram",
  instagramOf: (name) => ` of ${name} (opens in a new tab)`,
};

const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

/** The photo zooms in a little with the mouse over the card, as on the home. */
const ZOOM =
  "aspect-[4/5] h-auto w-full object-cover transition-transform duration-500 ease-[var(--ease-cg)] motion-reduce:transition-none";
const ZOOM_CARD = `${ZOOM} [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-[1.03] motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-100`;
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
  /** The bio: a string (one paragraph) or your own paragraphs. Opens in place
   *  under "Trajectory". */
  bio?: ReactNode;
  /** The guidance pages the person signs: the row lists them, with the count. */
  guidance?: ProfessionalGuidance[];
  /** Instagram profile URL (outbound row). */
  instagram?: string;
  /** Anchor of the card (the authorship link of a guidance page lands here). */
  id?: string;
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
 * rows separated by hairlines: Trajectory (opens the bio in place), Guidance
 * (opens the links in place) and Instagram (outbound). Six open bios used to
 * make the page 6,700px tall on a phone, hence the rows.
 *
 * The Guidance row carries `data-cg-open-on-arrival`: the site opens it when
 * the page is reached by the card's anchor (creeta's `abre-ao-chegar.tsx`,
 * not part of the DS).
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
  guidance,
  instagram,
  id,
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
        {/* Trajectory, guidance and Instagram: one list, of equal rows. They
            used to be three things with three designs (an open button, a loose
            list of links and a magenta link at the end). The first two open in
            place: six open bios made 6,700px of page on a phone. */}
        <RowList className="mt-4">
          {bio && (
            <CollapseRow label={t.trajectory} srLabel={t.of(name)}>
              {bio}
            </CollapseRow>
          )}

          {/* What the person signs: it is what makes this card the destination
              of the authorship link of the guidance pages. Whoever arrives by
              that link finds this block open (site-side, data-cg-open-on-arrival). */}
          {guidance && guidance.length > 0 && (
            <CollapseRow label={t.guidance} srLabel={t.of(name)} links={guidance} linkComponent={L} data-cg-open-on-arrival="" />
          )}

          {instagram && <LinkRow label={t.instagram} srLabel={t.instagramOf(name)} href={instagram} external />}
        </RowList>
      </div>
    </As>
  );
}
