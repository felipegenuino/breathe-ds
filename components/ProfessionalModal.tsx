"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Play, X } from "lucide-react";
import { MediaCardBadge } from "./MediaCard";
import { CaptionBand, useCaption } from "./CaptionBand";
import { formatDuration } from "./VideoStoryCard";

export type ProfessionalCaptions = {
  /** WebVTT file in the page's language. With it, the current line is shown in
   *  the CaptionBand at the top of the text column (never over the picture). */
  src: string;
  /** BCP 47 tag of the captions ("en", "pt-BR"). */
  srcLang: string;
  /** Name of the language, for the browser's captions menu. */
  label?: string;
};

export type ProfessionalPresentation = {
  /** The presentation video, recorded for the clinic's Instagram. Downloaded
   *  only when the modal opens; plays with sound (it was a tap by the person). */
  src: string;
  poster?: string;
  captions?: ProfessionalCaptions;
  /** Seconds (formatted as "1 min 15 s"), or an already formatted string for
   *  other languages. Goes into the sr-only text of the trigger. */
  duration?: number | string;
};

export type ProfessionalModalLabels = {
  /** The chip over the portrait: says the photo opens a video. */
  presentation: string;
  /** sr-only text of the trigger. `duration` is undefined when none was given. */
  watch: (firstName: string, duration?: string) => string;
  /** aria-label of the <video>. */
  video: (firstName: string) => string;
  close: string;
};

/** Lucide's icon type is wider than MediaCardBadge's `IconType` under strict
 *  TS (propTypes allow a string `size`); this thin wrapper fits the slot. */
const PlayIcon = (p: { size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }) => <Play {...p} />;

const EN: ProfessionalModalLabels = {
  presentation: "Presentation",
  watch: (firstName, duration) => `Watch ${firstName}'s video presentation${duration ? ` (${duration})` : ""}`,
  video: (firstName) => `${firstName}'s video presentation`,
  close: "Close",
};

type Props = {
  name: string;
  /** Second line under the name (the profession). */
  role?: ReactNode;
  /** Registration line (CREFITO). Kept at /80: it has a legal visibility duty
   *  (COFFITO 414/2012). */
  registration?: ReactNode;
  /** Full bio: a string (one paragraph) or your own paragraphs. */
  bio?: ReactNode;
  presentation: ProfessionalPresentation;
  /** The portrait the trigger shows (plain photo or living portrait), rendered
   *  by the card so both share one media contract. Decorative: the sr-only
   *  text of the button already says who it is. */
  portrait: ReactNode;
  labels?: Partial<ProfessionalModalLabels>;
};

/**
 * Team portrait that opens the video presentation in a modal — novo.creeta's
 * `Apresentacao` (components/apresentacao.tsx) with the Breathe tokens.
 *
 * - The portrait is a button with a small play chip in the corner. On tap, the
 *   modal grows out of the photo's place (FLIP: starts with the photo's scale
 *   and position, transform and opacity only) up to the centre. On close it
 *   goes back the same way.
 * - It is a native <dialog>: focus trapped, Esc closes, focus returns to the
 *   button, dark blurred backdrop. Body scroll is locked by the browser's
 *   modal layer (`showModal()`), nothing else to do.
 * - The video is only downloaded when the modal opens, and plays with sound
 *   (it was a tap by the person). Under reduced motion it just appears.
 * - With `captions`, the current line is shown in the CaptionBand that opens
 *   the text column: under the video on phones, beside it from `md`.
 */
export function ProfessionalModal({ name, role, registration, bio, presentation, portrait, labels }: Props) {
  const t = { ...EN, ...labels };
  const trigger = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const headingId = useId();
  const captions = presentation.captions;
  const { line, attach } = useCaption();
  const firstName = name.split(" ")[0];
  const duration =
    typeof presentation.duration === "number" ? formatDuration(presentation.duration) : presentation.duration;

  // Where the modal is born from: the difference between the photo and the box, as a transform.
  function origin() {
    const d = box.current;
    const f = trigger.current;
    if (!d || !f) return;
    const a = f.getBoundingClientRect();
    const b = d.getBoundingClientRect();
    d.style.setProperty("--dx", `${a.left + a.width / 2 - (b.left + b.width / 2)}px`);
    d.style.setProperty("--dy", `${a.top + a.height / 2 - (b.top + b.height / 2)}px`);
    d.style.setProperty("--sx", `${a.width / b.width}`);
    d.style.setProperty("--sy", `${a.height / b.height}`);
  }

  function show() {
    const d = box.current;
    if (!d) return;
    setOpen(true);
    d.showModal();
    // origin() reads the layout, which flushes the closed styles; the attribute
    // set right after is what the transition runs from.
    origin();
    d.setAttribute("data-open", "");
  }

  // The <video> is only mounted while the modal is open: this effect presses
  // play, once it exists. The tap on the photo counts as the person's
  // gesture, so it plays with sound.
  useEffect(() => {
    if (!open) return;
    const v = video.current;
    if (!v) return;
    v.play().catch(() => {});
  }, [open]);

  function close() {
    const d = box.current;
    if (!d) return;
    video.current?.pause();
    origin();
    d.removeAttribute("data-open");
    // wait for the way back to finish before taking it off the screen
    const wait = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
    window.setTimeout(() => {
      d.close();
      setOpen(false);
    }, wait);
  }

  // Esc and click on the backdrop: close with the same animation.
  useEffect(() => {
    const d = box.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target === d) close();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onClick);
    };
  });

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={show}
        className="group/photo relative block w-full overflow-hidden rounded-[20px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {portrait}
        {/* the play chip in the corner: says the photo opens a video */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 transition-transform duration-200 ease-out group-active/photo:scale-95 motion-reduce:transition-none"
        >
          <MediaCardBadge Icon={PlayIcon}>{t.presentation}</MediaCardBadge>
        </span>
        <span className="sr-only">{t.watch(firstName, duration)}</span>
      </button>

      {/* The <dialog> is born from the photo's place: --dx/--dy/--sx/--sy are
          the photo's position and scale relative to the box, computed on open.
          Transform and opacity only; `data-open` runs the transition, closing
          runs it back. Under reduced motion: a short fade, no transform. */}
      <dialog
        ref={box}
        aria-labelledby={headingId}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(100vw-1.5rem,64rem)] overflow-y-auto rounded-[32px] bg-card p-0 text-ink shadow-2xl md:rounded-[40px] opacity-0 [transform:translate(var(--dx,0),var(--dy,0))_scale(var(--sx,0.9),var(--sy,0.9))] [transition:transform_320ms_var(--ease-cg),opacity_200ms_ease-out] data-open:opacity-100 data-open:transform-none motion-reduce:transform-none motion-reduce:[transition:opacity_150ms_ease] backdrop:bg-ink/60 backdrop:backdrop-blur-md backdrop:opacity-0 backdrop:[transition:opacity_240ms_ease-out] [&[data-open]::backdrop]:opacity-100"
      >
        <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* on phones the box is shorter than 9:16: the video fits whole
              (object-contain), without cutting the head */}
          <div className="relative aspect-[9/16] max-h-[55dvh] w-full bg-ink md:max-h-none">
            {open && (
              <video
                ref={video}
                src={presentation.src}
                poster={presentation.poster}
                controls
                playsInline
                aria-label={t.video(firstName)}
                className="absolute inset-0 h-full w-full object-contain md:object-cover"
              >
                {captions && (
                  <track ref={attach} kind="subtitles" src={captions.src} srcLang={captions.srcLang} label={captions.label} default />
                )}
              </video>
            )}
          </div>
          <div className="flex flex-col p-6 md:p-10">
            {/* the spoken line, in the page's language: opens the text column,
                which sits right under the video on phones and beside it on desktop */}
            {open && captions && (
              <div className="-mt-2 mb-5 md:mr-12">
                <CaptionBand text={line} lang={captions.srcLang} />
              </div>
            )}
            <h2 id={headingId} className="font-heading text-2xl font-medium leading-snug md:text-[2rem]">
              {name}
            </h2>
            {role && <p className="mt-1 text-sm font-semibold text-ink-soft">{role}</p>}
            {registration && <p className="mt-1 text-xs text-ink/80">{registration}</p>}
            {typeof bio === "string" ? (
              <p className="mt-5 leading-relaxed text-ink/80">{bio}</p>
            ) : (
              bio && <div className="mt-5 space-y-3 leading-relaxed text-ink/80">{bio}</div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-transform duration-150 ease-out hover:bg-ink/90 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          <X aria-hidden="true" size={20} strokeWidth={2} />
          <span className="sr-only">{t.close}</span>
        </button>
      </dialog>
    </>
  );
}
