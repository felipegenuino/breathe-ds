"use client";

import { useEffect, useRef, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** How far it zooms in (1.1 = 10%). */
  zoom?: number;
  /** One way of the boomerang, in ms (in, then the same back out). */
  duration?: number;
  /** How long it takes to settle back when the pointer leaves, in ms. */
  returnDuration?: number;
};

const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";

/**
 * Ken Burns (boomerang) — the family's slow documentary zoom on covers. While
 * the pointer is on the card (the closest `.group`, or the image itself) or focus
 * is inside it, the photo zooms in and back out, over and over; when it leaves,
 * the photo eases back to rest from wherever it was (no snap). Web Animations
 * API, so it can start from the current frame. Off with prefers-reduced-motion.
 * Use it in place of the <img> of a cover (`position: absolute; inset: 0` etc. via
 * className, as usual).
 */
export function KenBurnsImage({ zoom = 1.1, duration = 9000, returnDuration = 1600, style, ...img }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = (el.closest(".group") as HTMLElement | null) ?? el;
    const end = { scale: String(zoom), translate: "-1.5% -1%" };
    let anim: Animation | null = null;

    const now = () => {
      const cs = getComputedStyle(el);
      return { scale: cs.scale === "none" ? "1" : cs.scale, translate: cs.translate === "none" ? "0px 0px" : cs.translate };
    };
    const start = () => {
      const from = now();
      anim?.cancel();
      // first leg from wherever it is, then the endless in-and-out
      anim = el.animate([from, end], { duration, easing: EASE, fill: "forwards" });
      anim.onfinish = () => {
        anim = el.animate([end, { scale: "1", translate: "0px 0px" }], { duration, easing: EASE, iterations: Infinity, direction: "alternate" });
      };
    };
    const stop = () => {
      if (host.matches(":hover") || host.matches(":focus-within")) return;
      const from = now();
      anim?.cancel();
      anim = el.animate([from, { scale: "1", translate: "0px 0px" }], { duration: returnDuration, easing: EASE });
    };

    host.addEventListener("pointerenter", start);
    host.addEventListener("pointerleave", stop);
    host.addEventListener("focusin", start);
    host.addEventListener("focusout", stop);
    return () => {
      host.removeEventListener("pointerenter", start);
      host.removeEventListener("pointerleave", stop);
      host.removeEventListener("focusin", start);
      host.removeEventListener("focusout", stop);
      anim?.cancel();
    };
  }, [zoom, duration, returnDuration]);

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img ref={ref} style={{ transformOrigin: style?.objectPosition as string | undefined, ...style }} {...img} />;
}
