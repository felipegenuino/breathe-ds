"use client";

import { useCallback, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { Check, Play } from "lucide-react";

/* ── Pause-all coordination (ported from creeta's `pausa-dos-videos.tsx`) ──
   A page-level "pause the card videos" button (WCAG 2.2.2) does two things:
   `document.documentElement.toggleAttribute(CARD_VIDEOS_PAUSED_ATTR, paused)`
   and `window.dispatchEvent(new Event(CARD_VIDEOS_PAUSE_EVENT))`. The hover
   preview of this card checks the attribute before playing, and listens to
   the event to stop a preview that is already running. The button itself
   lives in the site (it is one per page, next to the grid), not here. */

/** Event name the card previews listen to. */
export const CARD_VIDEOS_PAUSE_EVENT = "cg-card-videos";
/** Attribute on <html> while the card previews are paused by the person. */
export const CARD_VIDEOS_PAUSED_ATTR = "data-card-videos-paused";

/** Seconds → "1 min 39 s" (the site's `duracaoPorExtenso`, English units).
 *  Pass an already formatted string to `duration` for other languages. */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} s`;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}

type Labels = {
  /** sr-only text of the poster button: "Watch: {title}, {duration}". */
  watch: (title: string, duration: string) => string;
  /** sr-only text of the poster button once watched: "Watched. Watch again: …". */
  watchAgain: (title: string, duration: string) => string;
  /** The badge shown on the poster once the video has been watched to the end. */
  watched: string;
};
const EN: Labels = {
  watch: (title, duration) => `Watch: ${title}, ${duration}`,
  watchAgain: (title, duration) => `Watched. Watch again: ${title}, ${duration}`,
  watched: "Watched",
};

/** localStorage key of the set of watched clips (by `src`), with `remember`. */
export const WATCHED_STORAGE_KEY = "cg-watched";

function readWatched(): string[] {
  try {
    const raw = localStorage.getItem(WATCHED_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function storeWatched(src: string) {
  try {
    const list = readWatched();
    if (!list.includes(src)) localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify([...list, src]));
  } catch {
    /* private mode, blocked storage: the badge still shows for this visit */
  }
}

export type VideoStoryCardCaptions = {
  /** WebVTT file in the page's language. */
  src: string;
  /** BCP 47 tag of the captions ("en", "pt-BR"). */
  lang: string;
};

type Props = {
  /** Title of the clip (the heading of the card). */
  title: string;
  /** Who speaks, under the title ("Mariangela Fonseca"). */
  speaker?: ReactNode;
  /** One sentence. Collapsed by default; opens on hover (mouse only) or on
   *  keyboard focus. In the side layout it is always visible. */
  lead?: ReactNode;
  /** The clip. Downloaded only when the person presses play (with sound and
   *  the browser's controls). */
  src: string;
  /** Still frame shown before play (a few kB: with ten cards on a page this is
   *  what makes it load on 4G). Also used as the <video> poster. */
  poster: string;
  /** Responsive variants of the poster ("/v/x-480.webp 480w"). */
  posterSrcSet?: string;
  /** `sizes` of the poster. Default: one of three columns from md up. */
  sizes?: string;
  /** Replaces the default <img>: the site's own image component. Must fill
   *  the box (h-full w-full object-cover). */
  media?: ReactNode;
  /** Dominant color of the poster, shown while it loads. */
  color?: string;
  /** "1 min 39 s" (string) or the seconds (formatted in English by formatDuration). */
  duration: string | number;
  /** Optional muted, looping clip layered over the poster while the mouse is
   *  on the card or the card has keyboard focus (the `hover` mode of creeta's
   *  `VideoDoCartao`). Only where a mouse exists (hover: hover and pointer:
   *  fine); never with reduced motion, data saver, or while the page's
   *  pause-all is on. Fades in once it is really playing; otherwise the
   *  poster stays. Not in the source card: opt-in. */
  previewSrc?: string;
  /** Hidden subtitle track + a caption band under the video while it plays
   *  (creeta's `legenda.tsx`): many clips already have burned-in captions,
   *  so the browser's overlay would collide with them. */
  captions?: VideoStoryCardCaptions;
  /** h2 on list pages, h3 inside a section that already has an h2. */
  headingLevel?: "h2" | "h3";
  /** `stacked` (default): title, speaker and lead over the poster, bottom
   *  gradient. `side`: from md the video takes one column of three and the
   *  text sits beside it (the card is alone in its group). */
  layout?: "stacked" | "side";
  /** Element rendered as the card root (default <article>); `li` in a list. */
  as?: ElementType;
  /** id of the root (anchor target: scroll-mt-24 is built in). */
  id?: string;
  /** Marks the card as watched from the start (the site keeps its own record).
   *  Either way the card marks itself once the video plays to the end. */
  watched?: boolean;
  /** Called once when the video plays to the end (to store it on the site). */
  onWatched?: () => void;
  /** Remembers watched clips in localStorage (by `src`) across visits, for a
   *  page with many videos. Off by default: the site decides. */
  remember?: boolean;
  /** What goes right under the video: a transcript, on the videos page. */
  children?: ReactNode;
  labels?: Partial<Labels>;
  className?: string;
};

/** The spoken line right now, read from the hidden <track>. 'hidden' mode:
 *  the browser loads and fires cuechange but does not draw. */
function useCaptionLine() {
  const [line, setLine] = useState("");
  const attach = useCallback((el: HTMLTrackElement | null) => {
    const track = el?.track;
    if (!track) return;
    track.mode = "hidden";
    track.addEventListener("cuechange", () => {
      const cue = track.activeCues?.[0] as VTTCue | undefined;
      setLine(cue ? cue.text : "");
    });
  }, []);
  return { line, attach };
}

/** Caption band under the video: fixed height of three lines so the page does
 *  not jump at every line; hidden from screen readers (the transcript is on
 *  the page). On mount it scrolls the least needed to be in view: on phones it
 *  would be born behind the bottom bar. */
function CaptionLine({ text, lang }: { text: string; lang: string }) {
  const band = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const calm = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    band.current?.scrollIntoView?.({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }, []);
  return (
    <p
      ref={band}
      aria-hidden="true"
      lang={lang}
      className="mt-2 flex min-h-[4.75rem] scroll-mb-28 items-center justify-center rounded-[20px] bg-ink px-4 py-2.5 text-center text-[0.9375rem] font-medium leading-snug text-white md:scroll-mb-6"
    >
      {text}
    </p>
  );
}

/**
 * Vertical (9:16) video card of the Cuidado Global family — the Instagram-post
 * card of novo.creeta (`VideoCartao`), by tokens. Until the person presses
 * play it is a poster with the round play button and the duration badge in the
 * top-left corner; the title and the speaker sit on a short ink gradient at the
 * bottom. On hover (mouse) or keyboard focus the gradient grows and the lead
 * slides open (grid-rows 0fr → 1fr, no height animation). Tap/click swaps the
 * poster for the <video> with sound and controls, and the overlay text leaves.
 * Optional muted preview on hover (`previewSrc`) and caption band (`captions`).
 * When the video ends the card goes back to the poster with a "Watched" badge
 * (check + word, never color alone) in the top-right corner, opposite the play:
 * on a page with many clips it says which ones are done.
 */
export function VideoStoryCard({
  title,
  speaker,
  lead,
  src,
  poster,
  posterSrcSet,
  sizes = "(min-width: 1152px) 360px, (min-width: 768px) 33vw, 78vw",
  media,
  color,
  duration,
  previewSrc,
  captions,
  headingLevel: Heading = "h3",
  layout = "stacked",
  as: Root = "article",
  id,
  watched: watchedProp = false,
  onWatched,
  remember = false,
  children,
  labels,
  className = "",
}: Props) {
  const t = { ...EN, ...labels };
  const side = layout === "side";
  const durationText = typeof duration === "number" ? formatDuration(duration) : duration;
  const [playing, setPlaying] = useState(false);
  const { line, attach } = useCaptionLine();

  // ── watched: from the prop, from storage (after mount, so SSR and the first
  // paint agree), or from the video reaching the end ──
  const [watchedHere, setWatchedHere] = useState(false);
  useEffect(() => {
    if (remember && readWatched().includes(src)) setWatchedHere(true);
  }, [remember, src]);
  const watched = watchedProp || watchedHere;
  const onEnded = () => {
    setPlaying(false);
    if (!watched) onWatched?.();
    setWatchedHere(true);
    if (remember) storeWatched(src);
  };

  // ── hover preview (muted loop over the poster) ──
  const card = useRef<HTMLElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    const v = preview.current;
    const root = card.current;
    if (!previewSrc || !v || !root || typeof window.matchMedia !== "function") return;

    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pausedByPerson = () => document.documentElement.hasAttribute(CARD_VIDEOS_PAUSED_ATTR);
    const play = () => {
      if (calm() || saveData || pausedByPerson()) return;
      v.play()
        .then(() => setPreviewing(true))
        .catch(() => {});
    };
    const stop = () => {
      setPreviewing(false);
      v.pause();
    };
    const withMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const enter = () => withMouse() && play();
    // the person pressed the page's pause-all while the preview was running
    const onPauseAll = () => pausedByPerson() && stop();

    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", stop);
    root.addEventListener("focusin", enter);
    root.addEventListener("focusout", stop);
    window.addEventListener(CARD_VIDEOS_PAUSE_EVENT, onPauseAll);
    return () => {
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", stop);
      root.removeEventListener("focusin", enter);
      root.removeEventListener("focusout", stop);
      window.removeEventListener(CARD_VIDEOS_PAUSE_EVENT, onPauseAll);
    };
  }, [previewSrc, playing]);

  const overlayTitle = `font-heading text-xl font-medium leading-snug md:text-[1.375rem]`;

  return (
    <Root
      ref={card}
      id={id}
      className={`group/card scroll-mt-24 ${side ? "md:grid md:grid-cols-3 md:items-center md:gap-5" : ""} ${className}`}
    >
      {/* the video and what is glued to it: the caption band and the transcript */}
      <div>
        <div className="relative aspect-[9/16] overflow-hidden rounded-[28px]" style={color ? { backgroundColor: color } : undefined}>
          {playing ? (
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              onEnded={onEnded}
              className="absolute inset-0 h-full w-full bg-ink object-contain"
            >
              {captions && <track ref={attach} kind="subtitles" src={captions.src} srcLang={captions.lang} default />}
            </video>
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
            >
              {media ?? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  srcSet={posterSrcSet}
                  sizes={posterSrcSet ? sizes : undefined}
                  alt=""
                  width={540}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              )}
              {/* muted preview: invisible until it really plays, then fades in
                  (otherwise it would flash black while the file arrives) */}
              {previewSrc && (
                <video
                  ref={preview}
                  src={previewSrc}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${previewing ? "opacity-100" : "opacity-0"}`}
                />
              )}
              {/* watched: top-right, opposite the play, check and word (not color alone) */}
              {watched && (
                <span aria-hidden="true" className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/90 py-1.5 pl-2.5 pr-3 text-xs font-semibold text-ink backdrop-blur-md">
                  <Check size={14} strokeWidth={2.5} />
                  {t.watched}
                </span>
              )}
              {/* play and duration, together in the top corner */}
              <span aria-hidden="true" className="absolute left-3 top-3 flex items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100">
                  <Play size={18} strokeWidth={2} className="ml-0.5 fill-current" />
                </span>
                <span className="rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  {durationText}
                </span>
              </span>
              {/* the gradient that holds the text: full ink at the bottom,
                  nothing at the top; grows when the lead appears */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink from-20% via-ink/80 via-55% to-transparent transition-[height] duration-300 ease-out group-focus-within/card:h-[70%] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:h-[70%]"
              />
              <span className="sr-only">{watched ? t.watchAgain(title, durationText) : t.watch(title, durationText)}</span>
            </button>
          )}
          {/* Caption over the gradient. Outside the button so the title stays a
              heading. Leaves when the video plays. */}
          {!playing && !side && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
              <Heading className={overlayTitle}>{title}</Heading>
              {speaker && <p className="mt-1 text-sm font-semibold text-white/80">{speaker}</p>}
              {/* the lead: collapsed, opens on hover or on focus of the play
                  (grid-rows 0fr → 1fr, no height animation) */}
              {lead && (
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-focus-within/card:grid-rows-[1fr] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:grid-rows-[1fr]">
                  <p className="min-h-0 overflow-hidden text-sm leading-relaxed text-white/85 opacity-0 transition-opacity duration-300 ease-out group-focus-within/card:opacity-100 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:opacity-100">
                    <span className="block pt-1.5">{lead}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {playing && captions && <CaptionLine text={line} lang={captions.lang} />}
        {children}
      </div>
      {/* Side layout (card alone in its group): the text sits beside the video. */}
      {side && (
        <div className="px-6 pt-4 md:col-span-2 md:max-w-md md:pt-0">
          <Heading className={`${overlayTitle} text-ink`}>{title}</Heading>
          {speaker && <p className="mt-1 text-sm font-semibold text-ink">{speaker}</p>}
          {lead && <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/80">{lead}</p>}
        </div>
      )}
    </Root>
  );
}
