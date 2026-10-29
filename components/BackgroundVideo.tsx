"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Short, muted, looping clip (file hosted by the site itself). */
  src: string;
  /** Larger version, downloaded only on wide screens (from `from` up). */
  srcLarge?: string;
  /** Minimum width (px) for the larger version. Defaults to 1024. */
  from?: 768 | 1024;
  /** Still frame: shown before the video loads, without JS, and with reduced motion. */
  poster: string;
  /** Still frame of the larger version, when it is a different video (e.g. vertical on mobile, landscape on desktop). */
  posterLarge?: string;
  /** Zooms the video in to crop edges baked into the file. */
  trimEdges?: boolean;
  /** object-position of the video (e.g. "center 20%" to keep the face in a vertical clip). */
  objectPosition?: string;
  /** Pause button labels (injectable for i18n). */
  labels?: { pause?: string; play?: string };
  className?: string;
};

/**
 * Background video of the Cuidado Global family — mirrors creeta's `VideoFundo`
 * with the Breathe tokens (ink/surface). Muted looping clip, purely decorative:
 * hidden from screen readers (aria-hidden). Does not use the `autoplay`
 * attribute: it only starts after checking prefers-reduced-motion and data
 * saver (save-data). Has a pause button (WCAG 2.2.2) in the top-right corner.
 */
export function BackgroundVideo({
  src,
  srcLarge,
  from = 1024,
  poster,
  posterLarge,
  trimEdges = false,
  objectPosition,
  labels,
  className,
}: Props) {
  const wide = `(min-width: ${from}px)`;
  const video = useRef<HTMLVideoElement>(null);
  const [running, setRunning] = useState(false);
  const [posterNow, setPosterNow] = useState(poster);

  useEffect(() => {
    if (posterLarge && typeof window.matchMedia === "function" && window.matchMedia(wide).matches) {
      setPosterNow(posterLarge);
    }
  }, [posterLarge, wide]);

  useEffect(() => {
    const lessMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (lessMotion || saveData) return;
    video.current
      ?.play()
      .then(() => setRunning(true))
      .catch(() => setRunning(false));
  }, []);

  function toggle() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setRunning(true)).catch(() => setRunning(false));
    } else {
      v.pause();
      setRunning(false);
    }
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterNow}
        aria-hidden="true"
        tabIndex={-1}
        style={objectPosition ? { objectPosition } : undefined}
        className={`h-full w-full object-cover ${trimEdges ? "scale-[1.18]" : ""}`}
      >
        {srcLarge && <source src={srcLarge} type="video/mp4" media={wide} />}
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={running ? labels?.pause ?? "Pause video" : labels?.play ?? "Play video"}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
      >
        {running ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1.2" /><rect x="14" y="4" width="4" height="16" rx="1.2" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>
        )}
      </button>
    </div>
  );
}
