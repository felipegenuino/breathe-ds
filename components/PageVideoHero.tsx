"use client";

import { useState, type ReactNode } from "react";

type Props = {
  videoId: string;
  /** Sobrelinha curta (ex.: marca ou contexto). */
  kicker?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Selo de local no topo-esquerdo (ex.: "Fisioterapia em Florianópolis"). */
  locationLabel?: ReactNode;
  /** Texto do botão que religa o som. */
  soundLabel?: string;
  /** Título acessível do iframe. */
  videoTitle?: string;
  /** CTAs do hero (passe seus próprios Links/Buttons). Ficam no canto inferior-direito. */
  actions?: ReactNode;
};

/**
 * Hero full-bleed da família Cuidado Global. O vídeo COBRE o card inteiro
 * (cqw/cqh: dimensões do próprio card, cobre em qualquer proporção sem corte
 * torto), com um painel de vidro `surface-panel` sobre ele. Largura ampla
 * (full-bleed) — padrão do novo.creeta. Deps injetáveis: os CTAs vêm por
 * `actions`, então o componente não depende de Link/roteador do app.
 *
 * Tokens: texto creme (surface) sobre painel petróleo (surface-panel) — o
 * contraste do papel é definido por cada site (ver tokens/*).
 */
export function PageVideoHero({
  videoId,
  kicker,
  title,
  lead,
  locationLabel,
  soundLabel = "Assistir com som",
  videoTitle,
  actions,
}: Props) {
  const [som, setSom] = useState(false);
  const base = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams({
    autoplay: "1",
    mute: som ? "0" : "1",
    loop: "1",
    playlist: videoId,
    controls: som ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    cc_load_policy: "0",
    iv_load_policy: "3",
  });

  return (
    <div className="px-3 pt-2 md:px-4 md:pt-3">
      <section className="relative isolate flex h-[clamp(520px,78vh,860px)] w-full flex-col justify-end overflow-hidden rounded-2xl bg-ink text-surface [container-type:size]">
        {/* Vídeo cobrindo o card */}
        <iframe
          key={som ? "com-som" : "mudo"}
          src={`${base}?${params.toString()}`}
          title={videoTitle ?? (typeof title === "string" ? title : "Vídeo")}
          aria-hidden={!som}
          tabIndex={som ? 0 : -1}
          className="absolute top-1/2 left-1/2 h-[56.25cqw] max-h-none min-h-full w-[177.78cqh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        {/* Selo de local (topo-esquerdo) */}
        {locationLabel && (
          <span className="absolute top-4 left-4 z-[1] inline-flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 font-heading text-sm font-semibold text-surface backdrop-blur-md md:top-6 md:left-6">
            {locationLabel}
          </span>
        )}

        {!som && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent"
            />
            {/* Botão de som — topo-direito */}
            <button
              type="button"
              onClick={() => setSom(true)}
              className="absolute top-4 right-4 z-[1] inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 py-2 font-heading text-sm font-semibold text-ink shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 md:top-6 md:right-6"
            >
              <SoundIcon />
              {soundLabel}
            </button>

            {/* Painel de vidro — inferior-esquerdo */}
            <div className="relative m-4 max-w-[42rem] rounded-2xl bg-ink/75 p-[clamp(22px,3.2vw,40px)] backdrop-blur-md md:m-6 lg:m-8">
              {kicker && (
                <p className="mb-4 font-heading text-[0.82rem] font-bold tracking-[0.1em] text-surface/80 uppercase">
                  {kicker}
                </p>
              )}
              <h1 className="font-heading text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] font-semibold tracking-[-0.015em] text-balance text-surface">
                {title}
              </h1>
              {lead && (
                <p className="mt-4 max-w-[46ch] text-base leading-[1.6] text-pretty text-surface/90 md:text-lg">
                  {lead}
                </p>
              )}
            </div>

            {/* CTAs injetáveis — inferior-direito */}
            {actions && (
              <div className="absolute right-4 bottom-4 z-[1] flex flex-wrap items-center justify-end gap-2 md:right-6 md:bottom-6">
                {actions}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function SoundIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
