"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The line being spoken right now, read from the video's WebVTT <track>
 * (novo.creeta's `useLegenda`, components/legenda.tsx).
 *
 * The captions are not drawn over the picture: many of the site's videos
 * already carry burned-in Portuguese captions, in positions that vary, and one
 * on top of the other is unreadable. The track is the browser's (a hidden
 * <track> it loads and syncs itself) and the text comes out beside/under the
 * video, in `CaptionBand`.
 *
 * Usage: `const { line, attach } = useCaption()` and `<track ref={attach} … />`.
 */
export function useCaption() {
  const [line, setLine] = useState("");

  const attach = useCallback((el: HTMLTrackElement | null) => {
    const track = el?.track;
    if (!track) return;
    // 'hidden': the browser loads the file and fires the events, but does not draw
    track.mode = "hidden";
    track.addEventListener("cuechange", () => {
      const cue = track.activeCues?.[0] as VTTCue | undefined;
      setLine(cue ? cue.text : "");
    });
  }, []);

  return { line, attach };
}

type Props = {
  /** The current cue text (from `useCaption`). Empty between cues: the band
   *  stays, so the layout does not jump at every line. */
  text: string;
  /** BCP 47 tag of the captions ("en", "pt-BR"). */
  lang: string;
  className?: string;
};

/**
 * Caption band of the Cuidado Global family (novo.creeta's `FaixaDeLegenda`).
 * Fixed height of three lines so the page does not jump at every line. White
 * on `ink` (creeta's petrol: 10.2:1). Hidden from screen readers: who neither
 * hears nor sees uses the transcript on the page; here the text would change
 * every two seconds.
 *
 * When it appears (the person pressed play) the page scrolls the least needed
 * for the band to be in view: on phones it would be born behind the bottom
 * bar, and the person would watch without knowing there are captions. The
 * scroll margin is the bar's height.
 */
export function CaptionBand({ text, lang, className = "" }: Props) {
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
      data-caption-band=""
      className={`mt-2 flex min-h-[4.75rem] scroll-mb-28 items-center justify-center rounded-[20px] bg-ink px-4 py-2.5 text-center text-[0.9375rem] font-medium leading-snug text-white md:scroll-mb-6 ${className}`}
    >
      {text}
    </p>
  );
}
