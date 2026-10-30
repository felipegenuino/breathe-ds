"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackgroundVideo } from "./BackgroundVideo";

/** The glass panel: kicker, title, lead and, when the page has more than one
 *  call to action, the buttons inside the panel (the bottom-right slot fits
 *  one button beside the panel; two would run into the title). */
type Panel = { kicker?: ReactNode; title: ReactNode; lead?: ReactNode; actions?: ReactNode };

/** Local background clip (loop mode): muted, looping. */
type LoopPreview = {
  src: string;
  srcLarge?: string;
  poster: string;
  posterLarge?: string;
  trimEdges?: boolean;
  objectPosition?: string;
};

/** Two kinds of video hero:
 *  - loop:   a local clip on repeat (no player). Background = BackgroundVideo.
 *  - player: the video ITSELF plays muted, on repeat, as the background.
 *            Turning the sound on remounts it from zero — with audio and controls —
 *            and the close bar appears at the bottom. Keeps things consistent: the
 *            preview and the video are the same footage. The source is either a
 *            YouTube id (16:9 iframe covering the card, no false crop/zoom) or an
 *            mp4 hosted by the site (`src` + `poster`; the sound version plays in
 *            the browser's own player, letterboxed like the iframe). */
type VideoLoop = { mode: "loop"; preview: LoopPreview };
type PlayerCommon = { mode: "player"; playerCaption?: ReactNode };
type VideoPlayerYouTube = PlayerCommon & {
  youtubeId: string;
  /** Still frame (reduced motion / data saver). Without it, uses YouTube's own
   *  thumbnail (maxresdefault). */
  poster?: string;
};
type VideoPlayerFile = PlayerCommon & {
  /** The mp4 itself: muted and looping as the background, with sound after the tap. */
  src: string;
  /** Larger file for wide screens (background only). */
  srcLarge?: string;
  /** Still frame (reduced motion / data saver, and the <video> poster). */
  poster: string;
  posterLarge?: string;
  objectPosition?: string;
};
type VideoPlayer = VideoPlayerYouTube | VideoPlayerFile;
const isFile = (v: VideoPlayer): v is VideoPlayerFile => "src" in v;

type Props = {
  /** Video background — defines the hero kind (loop or player). */
  video: VideoLoop | VideoPlayer;
  /** Top-left slot (location badge, "← back" + icon). */
  topLeft?: ReactNode;
  /** Short caption in the bottom-left corner (pill) — simple version. */
  caption?: ReactNode;
  /** Bottom-left content panel (kicker + title + lead). */
  panel?: Panel;
  /** CTAs in the bottom-right corner. In player mode, omitting this shows
   *  "Watch the video"; null hides it. In loop mode, only what is passed here appears. */
  actions?: ReactNode | null;
  /** Label + meta of the default "Watch the video" button (player mode). */
  watch?: { label?: string; meta?: ReactNode };
  /** Label of the close button in the bottom bar (player mode, playing). */
  closeLabel?: string;
  /** Labels of the background pause button (player mode, muted preview). */
  previewLabels?: { pause?: string; play?: string };
  videoTitle?: string;
};

function PlayGlyph({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className="ml-0.5" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>;
}
function XGlyph({ size = 18 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

/**
 * YouTube video background playing MUTED, on repeat, covering the card
 * (player mode, before the sound starts). It is decorative: hidden from screen
 * readers. Respects reduced motion and data saver (then it stays on the still
 * frame without requesting the video). The "cover" is done with container units
 * (cqw/cqh), so the 16:9 ratio is never distorted or falsely cropped.
 * Has a pause button (WCAG 2.2.2). Clicks pass through (pointer-events-none):
 * the watch button on top is what receives the tap.
 */
function YouTubeBackground({
  id,
  poster,
  title,
  labels,
}: {
  id: string;
  poster?: string;
  title?: string;
  labels?: { pause?: string; play?: string };
}) {
  const [show, setShow] = useState(false);
  const [paused, setPaused] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const lessMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (lessMotion || saveData) return; // stay on the still frame
    setShow(true);
  }, []);

  function toggle() {
    const w = frame.current?.contentWindow;
    if (!w) return;
    // YouTube API via postMessage (enablejsapi=1): pause/resume without loading the script.
    w.postMessage(JSON.stringify({ event: "command", func: paused ? "playVideo" : "pauseVideo", args: [] }), "*");
    setPaused((p) => !p);
  }

  const posterSrc = poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ containerType: "size" }}>
      {show ? (
        <iframe
          ref={frame}
          title={title ?? "Video"}
          tabIndex={-1}
          aria-hidden="true"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
          style={{ width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
        />
      ) : (
        // YouTube's own thumbnail (16:9) when the video is not playing
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {show && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? labels?.play ?? "Play video" : labels?.pause ?? "Pause video"}
          className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
        >
          {paused ? (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1.2" /><rect x="14" y="4" width="4" height="16" rx="1.2" /></svg>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * Full-bleed hero of the Cuidado Global family — mirrors the "TopoVideo" of
 * novo.creeta (exact sizes/spacing: max-w-1600, rounded-32, min-h 560/820),
 * in the Breathe language (tokens: ink/surface).
 *
 * - loop:   the background is a local clip on repeat (BackgroundVideo).
 * - player: the background is the video ITSELF (YouTube id or the site's mp4)
 *           playing muted, on repeat. Turning the sound on remounts it from zero
 *           (with audio and controls) inside the card and opens the close bar at
 *           the bottom (caption on the left, "Close" on the right).
 */
export function PageVideoHero({
  video,
  topLeft,
  caption,
  panel,
  actions,
  watch,
  closeLabel = "Close video",
  previewLabels,
  videoTitle,
}: Props) {
  const isPlayer = video.mode === "player";
  // something sits in the bottom-right corner: the panel leaves room for it (md+)
  const corner = actions === null ? false : actions ? true : isPlayer;
  // phones: with a panel, the default watch button moves to the top-left corner
  // and the panel keeps room for it (pt-24), so the two never overlap
  const watchOnTop = Boolean(panel) && !topLeft && actions === undefined && isPlayer;
  const [playing, setPlaying] = useState(false);
  const watchRef = useRef<HTMLButtonElement>(null);
  const playedOnce = useRef(false);

  // On close, focus returns to the watch button.
  useEffect(() => {
    if (playing) playedOnce.current = true;
    else if (playedOnce.current) watchRef.current?.focus();
  }, [playing]);

  const playerCaption = isPlayer ? (video as VideoPlayer).playerCaption : undefined;

  return (
    <div className="px-4 pt-2 md:px-6 md:pt-6">
      <section className="relative isolate mx-auto flex min-h-[min(calc(100svh-7.5rem),560px)] max-w-[1600px] flex-col justify-end overflow-hidden rounded-[32px] bg-ink text-surface lg:min-h-[min(calc(100svh-7.5rem),820px)]">
        {/* media — background (preview) or, when playing, the full video with sound */}
        <div className={`absolute inset-x-0 top-0 ${playing ? "bottom-[4.5rem]" : "bottom-0 -z-10"}`}>
          {playing ? (
            isFile(video as VideoPlayer) ? (
              // the site's own mp4, with sound and the browser's controls; the
              // click came from the person, so autoplay with audio is allowed
              <video
                key="cg-hero-sound"
                src={(video as VideoPlayerFile).src}
                poster={(video as VideoPlayerFile).poster}
                controls
                autoPlay
                playsInline
                aria-label={videoTitle ?? "Video"}
                onEnded={() => setPlaying(false)}
                className="absolute inset-0 h-full w-full bg-black object-contain"
              />
            ) : (
              <iframe
                key="cg-hero-sound"
                title={videoTitle ?? "Video"}
                src={`https://www.youtube-nocookie.com/embed/${(video as VideoPlayerYouTube).youtubeId}?autoplay=1&mute=0&start=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 bg-black"
              />
            )
          ) : (
            <>
              {isPlayer && isFile(video as VideoPlayer) ? (
                // the mp4 itself, muted and on repeat (BackgroundVideo: reduced
                // motion, data saver and the pause button come with it)
                <BackgroundVideo
                  key={(video as VideoPlayerFile).src}
                  src={(video as VideoPlayerFile).src}
                  srcLarge={(video as VideoPlayerFile).srcLarge}
                  poster={(video as VideoPlayerFile).poster}
                  posterLarge={(video as VideoPlayerFile).posterLarge}
                  objectPosition={(video as VideoPlayerFile).objectPosition}
                  labels={previewLabels}
                  className="absolute inset-0"
                />
              ) : isPlayer ? (
                <YouTubeBackground
                  id={(video as VideoPlayerYouTube).youtubeId}
                  poster={(video as VideoPlayerYouTube).poster}
                  title={videoTitle}
                  labels={previewLabels}
                />
              ) : (
                <BackgroundVideo
                  key={(video as VideoLoop).preview.src}
                  src={(video as VideoLoop).preview.src}
                  srcLarge={(video as VideoLoop).preview.srcLarge}
                  poster={(video as VideoLoop).preview.poster}
                  posterLarge={(video as VideoLoop).preview.posterLarge}
                  trimEdges={(video as VideoLoop).preview.trimEdges}
                  objectPosition={(video as VideoLoop).preview.objectPosition}
                  labels={previewLabels}
                  className="absolute inset-0"
                />
              )}
              {/* scrims — legibility of the text (bottom) and of the top elements */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/35 to-transparent" />
            </>
          )}
        </div>

        {!playing && (
          <>
            {/* top-left */}
            {topLeft && <div className="absolute top-4 left-4 z-10">{topLeft}</div>}

            {/* panel / caption — in flow (justify-end), m-6 */}
            <div className={`relative z-10 p-6 md:m-6 md:p-0 ${watchOnTop ? "pt-24" : ""}`}>
              {panel ? (
                <div className={`inline-flex max-w-full items-center rounded-[24px] bg-ink/75 px-6 py-4 backdrop-blur-md lg:px-7 lg:py-5 ${corner ? "md:max-w-[calc(100%-16rem)]" : ""}`}>
                  <div>
                    {panel.kicker && (
                      <p className="mb-3 font-heading text-[0.82rem] font-bold tracking-[0.1em] text-surface/80 uppercase">{panel.kicker}</p>
                    )}
                    <h1 className="font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.015em] text-balance text-surface">{panel.title}</h1>
                    {panel.lead && (
                      <p className="mt-4 max-w-[46ch] text-base leading-[1.55] text-pretty text-surface/85 md:text-lg">{panel.lead}</p>
                    )}
                    {panel.actions && <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{panel.actions}</div>}
                  </div>
                </div>
              ) : caption ? (
                <div className="inline-block rounded-[22px] bg-ink/70 px-5 py-3 font-heading text-[1.05rem] font-medium text-surface backdrop-blur-md md:text-xl">{caption}</div>
              ) : null}
            </div>

            {/* bottom-right action (on phones, with a panel, the watch button goes to the
                free top-left corner so it never covers the panel's buttons) */}
            {actions === null ? null : actions ? (
              <div className="absolute right-4 bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 md:right-6 md:bottom-6">{actions}</div>
            ) : isPlayer ? (
              <button
                ref={watchRef}
                type="button"
                onClick={() => setPlaying(true)}
                className={`absolute z-10 flex items-center gap-3 rounded-full border border-surface/15 bg-ink/80 py-2 pr-7 pl-2 font-body font-semibold text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none md:top-auto md:left-auto md:right-6 md:bottom-6 ${watchOnTop ? "top-4 left-4" : "right-4 bottom-4"}`}
              >
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink">
                  <PlayGlyph size={20} />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  {watch?.label ?? "Watch the video"}
                  {watch?.meta && <span className="text-sm font-normal text-surface/80">{watch.meta}</span>}
                </span>
              </button>
            ) : null}
          </>
        )}

        {/* close bar — bottom of the playing video (caption on the left, close on the right) */}
        {playing && (
          <div className="relative z-10 flex h-[4.5rem] items-center justify-between gap-6 bg-ink px-6">
            <p className="min-w-0 truncate text-sm text-surface/80">{playerCaption}</p>
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-surface/25 px-5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
            >
              <XGlyph size={18} />
              {closeLabel}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
