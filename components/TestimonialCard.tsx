"use client";

import { useState, type ElementType, type ReactNode } from "react";
import { Play } from "lucide-react";
import { Byline } from "./Byline";

type Labels = {
  /** sr-only text of the play button: "Watch: {description}". */
  watch: (description: string) => string;
  /** sr-only after the outbound link. */
  newTab: string;
};
const EN: Labels = { watch: (description) => `Watch: ${description}`, newTab: " (opens in a new tab)" };

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
  /** The clip. Downloaded only on tap. */
  src: string;
  /** Still frame shown until the person taps. */
  poster: string;
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
  /** The family's video, on the left. */
  video: TestimonialVideo;
  /** Element rendered as the card root (default <div>); `li` inside a <ul>. */
  as?: ElementType;
  labels?: Partial<Labels>;
  className?: string;
};

/** Short video that only downloads and plays on tap, with the family's round
 *  play button (creeta's `VideoAoToque`). Before the tap it is just the poster:
 *  the browser's controls (0:00, volume) over the image clashed. No aspect
 *  ratio: the height comes from the grid row (the text beside it). */
function TapVideo({ src, poster, description, withSound = true, captions, media, label }: TestimonialVideo & { label: string }) {
  const [playing, setPlaying] = useState(false);
  const frame = "relative min-h-[16rem] overflow-hidden bg-ink";

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
export function TestimonialCard({ quote, author, authorPhoto, authorAvatar, authors, link, video, as: Root = "div", labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const people = authors ?? [{ name: author ?? "", photo: authorPhoto, avatar: authorAvatar }];
  return (
    <Root className={`grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] overflow-hidden rounded-[28px] bg-card ${className}`}>
      <TapVideo {...video} label={t.watch(video.description)} />
      <figure className="flex flex-col justify-between gap-5 p-5 md:p-7">
        <blockquote className="font-heading text-[0.9375rem] font-medium leading-relaxed text-ink md:text-base">{quote}</blockquote>
        <figcaption>
          <Byline
            cite
            people={people}
            action={link ? { label: link.label, href: link.href, external: true } : undefined}
            newTabLabel={t.newTab.trim()}
          />
        </figcaption>
      </figure>
    </Root>
  );
}
