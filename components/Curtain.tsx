"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BreatheMark } from "./BreatheMark";

type Props = {
  /** Brand name (e.g. "creeta", "TTCAB", "Breathe"). */
  name: ReactNode;
  /** Line below the name (e.g. "Centro de Reequilíbrio Toracoabdominal"). */
  tagline?: ReactNode;
  /** Symbol next to the name. Default: the BreatheMark (ring + dot). Each
   *  site injects its own logo here. */
  logo?: ReactNode;
  /** When `name` is an svg wordmark: its height as a fraction of the symbol
   *  height, from the brand manual (e.g. `CREETA_LOCKUP.wordmarkPerSymbol`). */
  wordmarkRatio?: number;
  /** Which side the symbol sits on. Default `left`; TTCAB is `right` (`TTCAB_LOCKUP.symbolSide`). */
  symbolSide?: "left" | "right";
  /** sessionStorage key (when the head script is in place). */
  storageKey?: string;
  /** Called when the curtain finishes rising. */
  onDone?: () => void;
  className?: string;
};

/**
 * Entrance curtain of the Cuidado Global family: full screen, in the site's
 * colors (surface/ink tokens), with the logo + name forming in the center and
 * the tagline below; then it rises and reveals the page. Mirrors creeta's
 * `Curtain`, but neutral: palette and logo come from each app.
 *
 * - Pure CSS (inline styles): without JavaScript it still rises the same way,
 *   so it never gets stuck in front of the site.
 * - Takes no click or focus and does not exist for screen readers (aria-hidden).
 * - With reduced motion (or print) it is not shown.
 * - To show it only on the first visit of the session, put `curtainHeadScript()`
 *   in the <head> (before paint): on a repeat visit the <html> is born with
 *   data-cg-curtain="seen" and the curtain is never drawn, so there is no flash.
 *
 * When it finishes rising, the <html> gets data-cg-curtain-done (so page tops
 * "land" only after it, never on a route change) and onDone is called.
 */
export function Curtain({ name, tagline, logo, wordmarkRatio, symbolSide = "left", storageKey, onDone, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const handleEnd = (e: AnimationEvent) => {
      if (e.animationName !== "cg-curtain-rise") return;
      document.documentElement.setAttribute("data-cg-curtain-done", "");
      try {
        if (storageKey) sessionStorage.setItem(storageKey, "1");
      } catch {
        /* sessionStorage blocked: the curtain just shows again, nothing breaks */
      }
      onDone?.();
      setGone(true);
    };
    node.addEventListener("animationend", handleEnd);
    return () => node.removeEventListener("animationend", handleEnd);
  }, [onDone, storageKey]);

  if (gone) return null;

  return (
    <div ref={el} className={`cg-curtain${className ? ` ${className}` : ""}`} aria-hidden="true">
      <style>{CURTAIN_CSS}</style>
      {/* Symbol on the left: it hugs the name+tagline block. On the right (TTCAB):
          it sits next to the name, on the same line, with the tagline below;
          otherwise the symbol would end up after the tagline, far from the wordmark. */}
      {(() => {
        const mark = <span className="cg-curtain__mark">{logo ?? <BreatheMark size={60} duration={5} />}</span>;
        const nameEl = (
          <span
            className="cg-curtain__name"
            style={wordmarkRatio ? ({ "--cg-wordmark": `calc(var(--cg-curtain-mark) * ${wordmarkRatio})` } as CSSProperties) : undefined}
          >
            {name}
          </span>
        );
        const tag = tagline ? <span className="cg-curtain__tag">{tagline}</span> : null;
        return symbolSide === "right" ? (
          <div className="cg-curtain__lockup cg-curtain__lockup--right">
            <span className="cg-curtain__row">{nameEl}{mark}</span>
            {tag}
          </div>
        ) : (
          <div className="cg-curtain__lockup">
            {mark}
            <span className="cg-curtain__text">{nameEl}{tag}</span>
          </div>
        );
      })()}
    </div>
  );
}

/**
 * Script for the <head> (before paint): marks the curtain as seen in this
 * session, so it does not repeat on navigation or reload. Without it, the
 * curtain shows on every load.
 *   // Next (app/layout):
 *   <script dangerouslySetInnerHTML={{ __html: curtainHeadScript("cg-curtain") }} />
 */
export function curtainHeadScript(storageKey = "cg-curtain") {
  const k = JSON.stringify(storageKey);
  return `try{var d=document.documentElement;if(sessionStorage.getItem(${k})){d.setAttribute('data-cg-curtain','seen')}else{sessionStorage.setItem(${k},'1')}}catch(e){}`;
}

const CURTAIN_CSS = `
.cg-curtain{
  --cg-curtain-mark: clamp(40px,7.4vw,60px); /* symbol height */
  position:fixed; inset:0 0 -40px; padding-bottom:40px;
  z-index:120; display:grid; place-items:center;
  border-radius:0 0 32px 32px;
  background:var(--color-surface,#fff); color:var(--color-ink,#14323a);
  box-shadow:0 24px 60px -20px rgba(0,0,0,.28);
  pointer-events:none;
  animation:cg-curtain-rise 700ms cubic-bezier(.77,0,.175,1) 2200ms both;
}
/* gap ≈ 1/3 of the name's body size: the ring is curved, so the optical gap reads a bit larger than the geometric one */
.cg-curtain__lockup{ display:flex; align-items:center; gap:clamp(10px,1.6vw,16px); padding:0 24px; }
.cg-curtain__lockup--right{ flex-direction:column; align-items:flex-start; }
.cg-curtain__row{ display:flex; align-items:center; gap:clamp(10px,1.6vw,16px); }
.cg-curtain__lockup--right .cg-curtain__name{ animation-name:cg-curtain-name-right; }
.cg-curtain__mark{ display:inline-flex; color:var(--color-ink,#14323a);
  animation:cg-curtain-mark 700ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) both; }
/* symbol ~1.25× the name's body size (the SVG box is tight to the glyph), fluid.
   Sized by height: a non-square injected symbol (TTCAB) keeps its aspect ratio. */
.cg-curtain__mark svg{ height:var(--cg-curtain-mark); width:auto; }
.cg-curtain__text{ display:flex; flex-direction:column; min-width:0; }
.cg-curtain__name{
  font-family:var(--font-heading,system-ui,sans-serif);
  font-weight:700; font-size:clamp(2rem,6vw,3rem); line-height:1; letter-spacing:-.02em;
  animation:cg-curtain-name 600ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) 480ms both;
}
.cg-curtain__tag{
  margin-top:.55rem; font-family:var(--font-body,system-ui,sans-serif);
  font-size:clamp(.8rem,2.4vw,1rem); line-height:1.3; color:var(--color-ink-soft,#54707a);
  animation:cg-curtain-tag 500ms ease 820ms both;
}
@keyframes cg-curtain-rise{ to{ transform:translateY(-100%); visibility:hidden; } }
@keyframes cg-curtain-mark{ from{ opacity:0; transform:scale(.6) rotate(-16deg); } }
@keyframes cg-curtain-name{ from{ opacity:0; transform:translateX(-8px); } }
@keyframes cg-curtain-name-right{ from{ opacity:0; transform:translateX(8px); } }
@keyframes cg-curtain-tag{ from{ opacity:0; transform:translateY(4px); } }
html[data-cg-curtain="seen"] .cg-curtain{ display:none; }
@media (prefers-reduced-motion:reduce){ .cg-curtain{ display:none; } }
@media print{ .cg-curtain{ display:none; } }
`;
