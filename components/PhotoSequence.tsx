import type { CSSProperties } from "react";
import { Pause, Play } from "lucide-react";

export type SequencePhoto = { src: string; alt: string; srcSet?: string; sizes?: string };

type Labels = {
  /** sr-only of the pause control. */
  pause: string;
};
const EN: Labels = { pause: "Pause the photos" };

type Props = {
  photos: SequencePhoto[];
  /** Unique in the page: ties the pause control to the sequence. */
  id: string;
  /** Seconds each photo stays, not counting the fade. */
  seconds?: number;
  labels?: Partial<Labels>;
  className?: string;
};

/** Seconds of fade between one photo and the next. */
const FADE = 1;
/** Ken Burns: how much the photo grows while it shows. */
const ZOOM = 1.08;
const CURVE = "cubic-bezier(0.77, 0, 0.175, 1)";
const pct = (n: number) => `${Number(n.toFixed(3))}%`;

/** Keyframes for a sequence of `n` photos. The cycle lasts n × seconds and
 *  each photo owns its slice: middle ones fade in, stay and vanish at once
 *  when the next has covered them; the last fades out revealing the first;
 *  the zoom grows while the photo shows and resets while hidden. */
export function sequenceKeyframes(n: number, seconds: number): string {
  const cycle = n * seconds;
  const enter = (FADE / cycle) * 100;
  const stay = (seconds / cycle) * 100;
  const leave = ((seconds + FADE) / cycle) * 100;
  return [
    `@keyframes cg-seq-mid-${n}{0%{opacity:0}${pct(enter)}{opacity:1}${pct(leave)}{opacity:1}${pct(leave + 0.01)},100%{opacity:0}}`,
    `@keyframes cg-seq-end-${n}{0%{opacity:0}${pct(enter)}{opacity:1}${pct(stay)}{opacity:1}${pct(leave)},100%{opacity:0}}`,
    `@keyframes cg-seq-zoom-${n}{0%{transform:scale(1)}${pct(leave)}{transform:scale(${ZOOM})}${pct(leave + 0.01)},100%{transform:scale(1)}}`,
  ].join("");
}

/** Photos that alternate with a fade and slowly zoom in, no JavaScript
 *  (creeta's `SequenciaFotos`). Only opacity and transform. Content that moves
 *  by itself for more than 5s must be pausable (WCAG 2.2.2): the hidden
 *  checkbox does it through CSS (theme.css). Reduced motion: first photo, still. */
export function PhotoSequence({ photos, id, seconds = 4, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const n = photos.length;
  const cycle = n * seconds;

  const animation = (i: number): CSSProperties => {
    const zoom = `cg-seq-zoom-${n} ${cycle}s linear infinite`;
    if (i === 0) return { animation: zoom };
    const fade = `${i === n - 1 ? `cg-seq-end-${n}` : `cg-seq-mid-${n}`} ${cycle}s ${CURVE} infinite`;
    return { animation: `${fade}, ${zoom}`, animationDelay: `${i * seconds}s` };
  };

  // position and radius are defaults: a className with `absolute` or `rounded-*`
  // (filling a CareSteps frame) takes their place instead of fighting them
  const position = /\babsolute\b|\bfixed\b/.test(className) ? "" : "relative";
  const radius = /\brounded/.test(className) ? "" : "rounded-[28px]";
  return (
    <div className={`${position} ${radius} overflow-hidden bg-ink ${className}`}>
      {n > 1 && <style dangerouslySetInnerHTML={{ __html: sequenceKeyframes(n, seconds) }} />}
      <input id={id} type="checkbox" className="cg-seq-pause peer sr-only" />

      <div className="cg-seq absolute inset-0">
        {photos.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.src}
            src={p.src}
            srcSet={p.srcSet}
            sizes={p.sizes}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            style={n > 1 ? animation(i) : undefined}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </div>

      {n > 1 && (
        <label
          htmlFor={id}
          className="cg-seq-control absolute bottom-3 right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink/85 text-surface backdrop-blur-md peer-checked:[&_.cg-on-pause]:block peer-checked:[&_.cg-on-play]:hidden peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-surface"
        >
          <Pause aria-hidden="true" size={18} strokeWidth={2} className="cg-on-play" />
          <Play aria-hidden="true" size={18} strokeWidth={2} className="cg-on-pause ml-0.5 hidden" />
          <span className="sr-only">{t.pause}</span>
        </label>
      )}
    </div>
  );
}
