"use client";

import { useEffect, useRef, useState, type ComponentType, type ElementType, type ReactNode } from "react";

/** lucide-style icon component (the badge sets the size). */
type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

/** Event the card videos listen to when the person pauses/resumes them all
 *  (dispatch it on `window` after toggling the attribute below). */
export const MEDIA_CARD_VIDEO_PAUSE_EVENT = "cg-media-card-videos";
/** Attribute on <html> while the card videos are paused (WCAG 2.2.2: what
 *  moves for more than 5s must be pausable; the button lives outside the
 *  card, which is one whole link). */
export const MEDIA_CARD_VIDEO_PAUSED_ATTR = "data-media-card-videos-paused";

export type MediaCardVideo = {
  src: string;
  poster?: string;
  /** `always` (default): loops while the card is on screen (a quarter in view
   *  counts). `hover`: only with the mouse over, or keyboard focus on, the
   *  card; on touch the photo stays. */
  when?: "always" | "hover";
};

type Props = {
  href: string;
  title: ReactNode;
  /** Supporting text. Accepts elements, to break the line where it makes sense. */
  text?: ReactNode;
  /** Top-left corner, over dark glass: a MediaCardBadge (icon, label, address). */
  badge?: ReactNode;
  /** h2 on list pages, h3 inside a section that already has an h2. */
  headingLevel?: "h2" | "h3";
  /** Background media rendered to cover the card: an <img>, a video element or
   *  the app's next/image (with `fill`, pass it `className="object-cover"`). */
  media?: ReactNode;
  /** Plain image alternative to `media`. Decorative by default (`alt=""`): the
   *  card already has title and text. */
  src?: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  /** true only when the card is the page's LCP: eager + high fetch priority. */
  priority?: boolean;
  /** Short muted clip that plays over the photo. Without it, or if it does not
   *  play, the photo stands. */
  video?: MediaCardVideo;
  /** Aspect-ratio class of the card. Default `aspect-[3/4]`; replaces the
   *  default instead of fighting it (e.g. `aspect-[4/5] md:aspect-auto md:min-h-[460px]`). */
  aspect?: string;
  /** Padding class of the card. Default `p-4` (e.g. `p-6 md:p-8`). */
  padding?: string;
  /** Link component of the app (e.g. next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  className?: string;
};

/**
 * Media card of the Cuidado Global family — the `CartaoFoto` of novo.creeta
 * ("Get to know the clinic", the treatment cards) with the Breathe tokens. A
 * tall card with the photo (or video) bleeding to the edges and the text over
 * it; the whole card is the link. The ink film at the bottom keeps the text
 * readable over any photo. On hover (mouse only) the photo zooms in slowly
 * and steadily, like a Ken Burns: 2.5s to reach 107%; it comes back in half a
 * second and does not move for people who asked for less motion. The round
 * arrow button turns `action` on hover.
 */
export function MediaCard({
  href,
  title,
  text,
  badge,
  headingLevel: Heading = "h3",
  media,
  src,
  alt = "",
  srcSet,
  sizes,
  priority = false,
  video,
  aspect = "aspect-[3/4]",
  padding = "p-4",
  linkComponent,
  className = "",
}: Props) {
  const L: ElementType = linkComponent ?? "a";

  return (
    <L
      href={href}
      className={`group relative isolate flex ${aspect} flex-col justify-between overflow-hidden rounded-2xl bg-ink ${padding} text-white transition-transform duration-200 ease-out active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
    >
      {/* Zooms in slowly with the mouse over, at a constant pace, like a Ken
          Burns: 2.5s to reach 107%. Only where there is a mouse: on a phone
          the tap would fire a false "hover". Comes back in half a second, and
          stays still for people who asked for less motion. */}
      <div
        className="absolute inset-0 -z-20 transition-transform duration-500 ease-[var(--ease-cg)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.07] [@media(hover:hover)_and_(pointer:fine)]:group-hover:duration-[2500ms] [@media(hover:hover)_and_(pointer:fine)]:group-hover:ease-linear motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
      >
        {media ??
          (src && (
            <img
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              // React 18 only knows the lowercase attribute (19 accepts fetchPriority too)
              {...({ fetchpriority: priority ? "high" : undefined } as Record<string, unknown>)}
            />
          ))}
      </div>
      {/* between the photo and the film: the text keeps the same contrast */}
      {video && <CardVideo {...video} className="absolute inset-0 -z-20" />}
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 via-40% to-ink/15" />

      <div className="flex items-start justify-between gap-3">
        <div>{badge}</div>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:bg-action group-hover:text-on-action motion-reduce:transition-none"
        >
          <svg viewBox="0 0 24 24" width={20} height={20} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </span>
      </div>

      <div>
        <Heading className="font-heading text-2xl font-medium leading-tight">{title}</Heading>
        {text && <p className="mt-2 text-sm leading-relaxed text-white/85">{text}</p>}
      </div>
    </L>
  );
}

/**
 * Badge for the corner of the card. Dark glass, not light: over the bright
 * part of a photo, white text on white glass measured 1.59:1. With `Icon`
 * alone (no children) it becomes a 44px round icon badge.
 */
export function MediaCardBadge({ Icon, children, className = "" }: { Icon?: IconType; children?: ReactNode; className?: string }) {
  const iconOnly = Boolean(Icon) && children === undefined;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/80 px-3 py-2 text-xs font-medium text-white backdrop-blur-md ${iconOnly ? "h-11 w-11 justify-center p-0" : ""} ${className}`}
    >
      {Icon && <Icon aria-hidden="true" size={iconOnly ? 20 : 14} strokeWidth={2} />}
      {children}
    </span>
  );
}

/**
 * Short muted clip over the photo of a card (creeta's `VideoDoCartao`).
 *
 * Invisible until it has frames to show, then fades in: without this it would
 * flash black while the file arrives. If it does not play, the card is the
 * usual one, with the photo.
 *
 * Does not play, in either mode: for people who asked for less motion; with
 * data saver on (the video is not even requested: `preload="none"`); while
 * the person has paused the card videos (MEDIA_CARD_VIDEO_PAUSED_ATTR on <html>).
 *
 * In `always`, pauses when the card leaves the screen: three videos running
 * with nobody watching waste battery for nothing.
 *
 * Muted, no controls, out of the screen-reader flow: it is decoration, the
 * card already has title and text. The card is the link (<a>) around it.
 */
function CardVideo({ src, poster, when = "always", className = "" }: MediaCardVideo & { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    const card = v?.closest("a") ?? v?.parentElement;
    if (!v || !card || typeof window.matchMedia !== "function") return;

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const lessMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paused = () => document.documentElement.hasAttribute(MEDIA_CARD_VIDEO_PAUSED_ATTR);
    const play = () => {
      if (lessMotion() || saveData || paused()) return;
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    };
    const stop = () => {
      setPlaying(false);
      v.pause();
    };

    if (when === "hover") {
      const withMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const enter = () => withMouse() && play();
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", stop);
      card.addEventListener("focusin", enter);
      card.addEventListener("focusout", stop);
      return () => {
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", stop);
        card.removeEventListener("focusin", enter);
        card.removeEventListener("focusout", stop);
      };
    }

    if (typeof IntersectionObserver !== "function") return;
    let onScreen = false;
    // a quarter of the card in view already counts
    const watcher = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen) play();
        else stop();
      },
      { threshold: 0.25 },
    );
    watcher.observe(card);
    // the person paused or resumed the videos
    const onNotice = () => (paused() || !onScreen ? stop() : play());
    window.addEventListener(MEDIA_CARD_VIDEO_PAUSE_EVENT, onNotice);
    return () => {
      watcher.disconnect();
      window.removeEventListener(MEDIA_CARD_VIDEO_PAUSE_EVENT, onNotice);
    };
  }, [when]);

  return (
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
      data-media-card-video={when}
      className={`pointer-events-none h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${playing ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
