"use client";

import { useLayoutEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { Play } from "lucide-react";
import { Byline } from "./Byline";
import { SidePanel } from "./SidePanel";

type Labels = {
  /** sr-only text of the play button: "Watch: {description}". */
  watch: (description: string) => string;
  /** sr-only after the outbound link. */
  newTab: string;
  /** Button under a clamped quote that opens the whole testimonial. */
  readMore: string;
  /** Close button of the side panel. */
  close: string;
};
const EN: Labels = {
  watch: (description) => `Watch: ${description}`,
  newTab: " (opens in a new tab)",
  readMore: "Read the full testimonial",
  close: "Close",
};

export type TestimonialCaptions = {
  /** WebVTT file in the page's language. Drawn by the browser over the video:
   *  only for clips WITHOUT burned-in captions. */
  src: string;
  /** BCP 47 tag ("en", "pt-BR"). */
  srcLang: string;
  /** Name of the language, for the browser's captions menu. */
  label?: string;
};

export type TestimonialVideo = {
  /** The clip (the site's own mp4). Downloaded only on tap. */
  src?: string;
  /** Or a YouTube id: the player (youtube-nocookie) loads only on tap. */
  youtubeId?: string;
  /** Still frame shown until the person taps. With `youtubeId` and no poster,
   *  YouTube's own thumbnail. */
  poster?: string;
  /** What the video shows, for screen readers ("Tereza's mother tells… (1 min 39 s)"). */
  description: string;
  /** Plays with audio (testimonials have speech). Default: true. The play is
   *  a click by the person, so the browser allows the sound. */
  withSound?: boolean;
  captions?: TestimonialCaptions;
  /** Replaces the default poster <img> (the site's own image component).
   *  Must fill the box (h-full w-full object-cover). */
  media?: ReactNode;
};

type Props = {
  /** The family's words, with their own cuts, in a <blockquote>. */
  quote: ReactNode;
  /** Who speaks, as shown on the site ("Tereza's family"). Goes in <cite>, with
   *  the portrait (or the initials) in front — the family's Byline. */
  author?: string;
  authorPhoto?: string;
  authorAvatar?: ReactNode;
  /** Two or more voices ("Ana and João"): stacked portraits, names joined. Replaces `author`. */
  authors?: { name: string; photo?: string; avatar?: ReactNode }[];
  /** The public source of the quote ("View on Instagram ↗"), opened in a new tab. */
  link?: { href: string; label: ReactNode };
  /** The family's video, on the left. Omit it for a text testimonial (quote +
   *  portrait), as on ttcab: the card becomes a single column. */
  video?: TestimonialVideo;
  /** A still portrait on the left, in the video's place (text testimonials with a
   *  real photo). `media` replaces the <img> (the site's image component; must
   *  fill the box). */
  photo?: { src: string; alt: string; position?: string; media?: ReactNode };
  /** Joiners between two or more names (", " and " e " in Portuguese). */
  joiners?: { sep: string; last: string };
  /** Small line under the name(s) ("Physiotherapist", "Tereza's mother"). */
  role?: ReactNode;
  /** Long testimonials: the quote on the card stops after this many lines and
   *  a "Read the full testimonial" button opens it whole in the SidePanel. The
   *  button only shows when the text really overflows. */
  clampLines?: number;
  /** Element rendered as the card root (default <div>); `li` inside a <ul>. */
  as?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

/** Short video that only downloads and plays on tap, with the family's round
 *  play button (creeta's `VideoAoToque`). Before the tap it is just the poster:
 *  the browser's controls (0:00, volume) over the image clashed. No aspect
 *  ratio: the height comes from the grid row (the text beside it). */
function TapVideo({ src, youtubeId, poster: posterProp, description, withSound = true, captions, media, label }: TestimonialVideo & { label: string }) {
  const [playing, setPlaying] = useState(false);
  // stacked on phones: 16:9 (videos are landscape); side by side: the row's height
  const frame = "relative aspect-video overflow-hidden bg-ink sm:aspect-auto sm:min-h-[16rem]";
  const poster = posterProp ?? (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "");

  if (playing && youtubeId) {
    return (
      <div className={frame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={description}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  if (playing) {
    return (
      <div className={frame}>
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          muted={!withSound}
          playsInline
          aria-label={description}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {captions && <track kind="subtitles" src={captions.src} srcLang={captions.srcLang} label={captions.label} default />}
        </video>
      </div>
    );
  }

  return (
    <div className={frame}>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group absolute inset-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
      >
        {media ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        )}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100"
        >
          <Play size={22} strokeWidth={2} className="ml-0.5 fill-current" />
        </span>
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

/**
 * Testimonial card of the Cuidado Global family — one item of novo.creeta's
 * `Depoimentos`, by tokens. White card: the family's video on the left (only
 * downloads on tap, plays with sound and the browser's controls, in place), the
 * quote on the right, who speaks, and the link to the public post so anyone can
 * check the source. The quote is a real <blockquote> with <cite>: it is someone
 * else's words and the screen reader announces it as such.
 */
// whole class names, so Tailwind generates them
const CLAMP: Record<number, string> = { 3: "line-clamp-3", 4: "line-clamp-4", 5: "line-clamp-5", 6: "line-clamp-6", 8: "line-clamp-8" };

export function TestimonialCard({ quote, author, authorPhoto, authorAvatar, authors, link, video, photo, role, joiners, clampLines, as: Root = "div", labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const people = authors ?? [{ name: author ?? "", photo: authorPhoto, avatar: authorAvatar }];
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el || !clampLines) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    if (typeof ResizeObserver !== "function") return;
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [clampLines]);
  const byline = (
    <Byline
      cite
      people={people}
      action={link ? { label: link.label, href: link.href, external: true } : undefined}
      newTabLabel={t.newTab.trim()}
      subtitle={role}
      joiners={joiners}
      hideAvatars={Boolean(photo)}
    />
  );
  return (
    <Root className={`${video || photo ? "grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : "flex"} overflow-hidden rounded-[28px] bg-card ${className}`}>
      {video ? (
        <TapVideo {...video} label={t.watch(video.description)} />
      ) : photo ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-ink/[0.06] sm:aspect-auto sm:min-h-[16rem]">
          {photo.media ?? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: photo.position }} />
          )}
        </div>
      ) : null}
      <figure className={`flex flex-1 flex-col justify-between gap-5 ${video || photo ? "p-5 md:p-7" : "p-6 md:p-8"}`}>
        <div>
          <blockquote
            ref={quoteRef}
            className={`font-heading text-[0.9375rem] font-medium leading-relaxed text-ink md:text-base ${clampLines ? (CLAMP[clampLines] ?? "line-clamp-5") : ""}`}
          >
            {quote}
          </blockquote>
          {overflows && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-left font-semibold text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {t.readMore}
            </button>
          )}
        </div>
        <figcaption>{byline}</figcaption>
      </figure>
      {clampLines && (
        <SidePanel open={open} onClose={() => setOpen(false)} title={people.map((p) => p.name).join(", ")} labels={{ close: t.close }}>
          <figure className="flex flex-col gap-6 px-6 pt-2 pb-10 md:px-8">
            <blockquote className="font-heading text-lg leading-relaxed font-medium text-ink">{quote}</blockquote>
            <figcaption>{byline}</figcaption>
          </figure>
        </SidePanel>
      )}
    </Root>
  );
}
