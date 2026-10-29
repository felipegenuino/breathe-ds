"use client";

import { useEffect, useRef, useState } from "react";

/** whole:   the drawing finished, not animating (no JavaScript, no
 *           IntersectionObserver, or reduced motion).
 *  waiting: hidden, until it shows up on screen.
 *  playing: it showed up; the animation runs. */
export type AppearState = "whole" | "waiting" | "playing";

export const reducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** For drawings that animate once half of them is on screen (creeta's
 *  `useAoAparecer`). The default is the finished drawing: it only hides to
 *  animate when it can animate. `onScreen` follows the drawing the whole time:
 *  a looping animation only runs while someone can see it. */
export function useOnAppear<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<AppearState>("whole");
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || reducedMotion()) return;
    setState("waiting");
    const eye = new IntersectionObserver(
      ([e]) => {
        setOnScreen(!!e.isIntersecting);
        if (e.isIntersecting) setState("playing");
      },
      { threshold: 0.5 },
    );
    eye.observe(el);
    return () => eye.disconnect();
  }, []);

  return { ref, state, onScreen };
}
