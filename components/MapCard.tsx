"use client";

import { useState, type ReactNode } from "react";
import { Button } from "./Button";

type Labels = {
  /** The button that loads the map. */
  open: string;
  /** The outbound link ("Directions"). */
  directions: string;
  /** sr-only after the outbound link. */
  newTab: string;
  /** The note under the actions. */
  note: string;
  /** The close button on the bar under the open map. */
  close: string;
  /** Accessible title of the map frame; receives the address. */
  frameTitle: (address: string) => string;
};
const EN: Labels = {
  open: "View the map",
  directions: "Directions",
  newTab: "(opens in a new tab)",
  note: "The map is Google's and only loads after your tap.",
  close: "Close the map",
  frameTitle: (address) => `Map: ${address}`,
};

type Props = {
  /** First line, large: the street and number. */
  address: string;
  /** Second line: neighbourhood, city/state. */
  locality?: ReactNode;
  /** Still image of the map (a file of the site, never a live tile): says
   *  "there is a map here" without calling Google. Wide, pin near the top-middle. */
  preview: { src: string; width?: number; height?: number; position?: string };
  /** Embed URL, requested only after the tap (e.g. https://www.google.com/maps?q=…&output=embed). */
  embedSrc: string;
  /** Google Maps search/route link; works without JavaScript. */
  directionsHref: string;
  /** Caption on the close bar while the map is open. Default: the address. */
  caption?: ReactNode;
  /** Height of the open map. */
  mapHeight?: string;
  labels?: Partial<Labels>;
  className?: string;
};

const MapPin = ({ size = 20, strokeWidth = 1.75 }: { size?: number; strokeWidth?: number }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} className="cg-arrow-go" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);
const X = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

/**
 * Map card — the Mapa of novo.creeta: a Google map that only loads on tap.
 *
 * The embedded map sets third-party cookies as soon as it appears, and the
 * sites have no consent banner. So the card shows a still preview of the map
 * fading into the card, the address, a "View the map" button and the outbound
 * "Directions" link (works without JavaScript); Google is only called when the
 * person asks. The page is also lighter on phones.
 *
 * Open, the map fills the card and a bar at the bottom (the same as the
 * PageVideoHero's) carries the caption and the close button, so the person
 * can put the still back.
 */
export function MapCard({ address, locality, preview, embedSrc, directionsHref, caption, mapHeight = "min-h-[420px]", labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-card ${className}`}>
      {open ? (
        <div className="flex flex-col">
          <div className={`relative ${mapHeight} bg-surface`}>
            <iframe
              title={t.frameTitle(address)}
              src={embedSrc}
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              // only shown once Google has drawn it, with a fade: before that the frame is an empty white
              className={`absolute inset-0 block h-full w-full border-0 transition-opacity duration-300 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
          {/* close bar — the same as the hero video's: caption on the left, close on the right */}
          <div className="relative z-10 flex h-[4.5rem] items-center justify-between gap-6 bg-ink px-6">
            <p className="m-0 min-w-0 truncate text-sm text-surface/80">{caption ?? address}</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setLoaded(false);
              }}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-surface/25 px-5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-surface/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
            >
              <X />
              {t.close}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-[320px] flex-col">
          {/* Top: a still crop of the map fading into the card towards the bottom.
              The text sits below, outside the image, always on the card color. */}
          <div aria-hidden="true" className="relative min-h-[9rem] flex-1 overflow-hidden">
            <img
              src={preview.src}
              alt=""
              width={preview.width}
              height={preview.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: preview.position ?? "48% 18%" }}
            />
            <span className="absolute inset-0 bg-gradient-to-b from-card/0 via-card/35 via-60% to-card" />
            {/* on the right: on the left it covered the place's name on the map */}
            <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-card text-ink shadow-[0_2px_8px_rgba(0,0,0,0.18)] md:right-8 md:top-8">
              <MapPin />
            </span>
          </div>

          <div className="px-6 pb-6 md:px-8 md:pb-8">
            <address className="m-0 not-italic font-heading text-2xl font-medium leading-snug text-ink">
              {address}
              {locality && <span className="mt-1 block font-body text-base font-normal text-ink/80">{locality}</span>}
            </address>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button variant="solid" onClick={() => setOpen(true)}>
                <MapPin size={19} strokeWidth={2} />
                {t.open}
              </Button>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {t.directions}
                <ArrowUpRight />
                <span className="sr-only"> {t.newTab}</span>
              </a>
            </div>
            <p className="m-0 mt-4 text-sm leading-relaxed text-ink/80">{t.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
