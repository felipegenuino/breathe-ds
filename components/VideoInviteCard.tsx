"use client";

import { useState, type ReactNode } from "react";
import { BackgroundVideo } from "./BackgroundVideo";

/** Muted looping clip shown while idle (same fields as BackgroundVideo). */
export type InviteLoop = {
  src: string;
  /** Larger version, downloaded only on wide screens (from `from` up). */
  srcLarge?: string;
  /** Minimum width (px) for the larger version. Defaults to 1024. */
  from?: 768 | 1024;
  /** Still frame: shown before the clip loads, without JS, and with reduced motion. */
  poster: string;
  posterLarge?: string;
};

/** Text track drawn by the browser over the full video (.vtt). */
export type InviteTrack = {
  src: string;
  /** BCP 47 language tag, e.g. "pt-BR", "en". */
  srcLang: string;
  /** Name shown in the browser's track menu, e.g. "Português". */
  label: string;
  kind?: "captions" | "subtitles";
  default?: boolean;
};

/** Full video with sound, played on tap. Only downloaded then. */
export type InviteVideo = {
  src: string;
  poster?: string;
  tracks?: InviteTrack[];
};

type Labels = {
  /** Screen-reader label of the play button (the circle, bottom-right). */
  listen: string;
  /** aria-label of the full video while it plays. */
  video: string;
  /** Labels of the loop's pause button (top-right), passed to BackgroundVideo. */
  pause: string;
  play: string;
};

const EN: Labels = {
  listen: "Listen to the invitation",
  video: "Video invitation, with sound",
  pause: "Pause the video",
  play: "Play the video",
};

export type VideoInviteCardProps = {
  /** Overlay title, top-left, in both phases (on the site: who appears). Ink text, no background. */
  title: ReactNode;
  /** Second line under the title (on the site: the person's role). */
  description?: ReactNode;
  /** Idle phase: muted looping clip. */
  loop: InviteLoop;
  /** Tap phase: the full video with sound, browser controls and captions. */
  video: InviteVideo;
  /** Called when the person taps play (e.g. to pause other media on the page). */
  onPlay?: () => void;
  /** Called when the full video ends and the card goes back to the loop. */
  onEnded?: () => void;
  labels?: Partial<Labels>;
  /** Size/position of the frame (aspect, min-height, grid order…). */
  className?: string;
};

function PlayGlyph({ size = 22 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className="ml-0.5" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>;
}

/**
 * Video invitation card of the Cuidado Global family — mirrors the
 * `VideoConvite` of novo.creeta with the Breathe tokens, in two phases.
 *
 * Idle, it is a background video: the speaker on a muted loop (BackgroundVideo:
 * respects reduced motion and data saver, has the pause button top-right —
 * WCAG 2.2.2). Over it, the title and description top-left and a play button
 * bottom-right, outside the face. On tap, the second video takes over, with
 * sound: the invitation itself, with captions and the browser's controls.
 * Because play is a click by the person, the browser allows the audio. When
 * the invitation ends, the card goes back to the loop.
 *
 * The full video only downloads on tap. The frame is a 28px-radius card
 * (`rounded-2xl` in the DS scale); the consumer sets aspect/min-height via
 * `className`.
 */
export function VideoInviteCard({ title, description, loop, video, onPlay, onEnded, labels, className = "" }: VideoInviteCardProps) {
  const [inviting, setInviting] = useState(false);
  const t = { ...EN, ...labels };

  /* No background, straight over the video, in ink top-left, where the frame
     is the light wall in both phases (measured on the site's footage: 6.18:1
     median on the loop, 5.86:1 on the invitation). The light text-shadow
     holds it on the darker frames. */
  const caption = (
    <p className="inline-block text-sm font-medium leading-snug text-ink [text-shadow:0_1px_2px_rgba(255,255,255,0.5)]">
      <span className="block">{title}</span>
      {description && <span className="block font-normal">{description}</span>}
    </p>
  );

  const frame = `relative overflow-hidden rounded-2xl bg-ink ${className}`;

  if (inviting) {
    return (
      <div className={frame}>
        <video
          src={video.src}
          poster={video.poster}
          controls
          autoPlay
          playsInline
          onEnded={() => {
            setInviting(false);
            onEnded?.();
          }}
          aria-label={t.video}
          className="absolute inset-0 h-full w-full bg-ink object-cover"
        >
          {video.tracks?.map((track) => (
            <track
              key={track.src}
              kind={track.kind ?? "captions"}
              src={track.src}
              srcLang={track.srcLang}
              label={track.label}
              default={track.default}
            />
          ))}
        </video>
        <div className="pointer-events-none absolute top-4 left-4 right-4">{caption}</div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <BackgroundVideo
        src={loop.src}
        srcLarge={loop.srcLarge}
        from={loop.from}
        poster={loop.poster}
        posterLarge={loop.posterLarge}
        labels={{ pause: t.pause, play: t.play }}
        className="absolute inset-0"
      />
      {/* right-16: the loop's pause button sits in the top-right corner. */}
      <div className="pointer-events-none absolute top-4 left-4 right-16">{caption}</div>
      {/* Only the circle is a button, so the loop's pause button (top corner)
          stays reachable. Bottom-right, outside the face. */}
      <button
        type="button"
        onClick={() => {
          onPlay?.();
          setInviting(true);
        }}
        className="group absolute right-4 bottom-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-card text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
      >
        <PlayGlyph size={22} />
        <span className="sr-only">{t.listen}</span>
      </button>
    </div>
  );
}
