"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackgroundVideo } from "./BackgroundVideo";

type Panel = { kicker?: ReactNode; title: ReactNode; lead?: ReactNode };

/** Clipe de fundo (arquivo do próprio site), sem som, em repetição. */
type Preview = { src: string; srcLarge?: string; poster: string; posterLarge?: string; trimEdges?: boolean; objectPosition?: string };

/** Dois tipos de hero com vídeo:
 *  - loop:   só o clipe ambiente em repetição (sem player).
 *  - player: o clipe é a prévia; ao apertar o play, o vídeo inteiro (YouTube)
 *            toca no próprio card e surge a barra de fechar no pé. */
type VideoLoop = { mode: "loop"; preview: Preview };
type VideoPlayer = { mode: "player"; preview: Preview; youtubeId: string; legenda?: ReactNode };

type Props = {
  /** Fundo em vídeo — define o tipo do hero (loop ou player). */
  video: VideoLoop | VideoPlayer;
  /** Slot no topo-esquerdo (selo de local, "← voltar" + ícone). */
  topLeft?: ReactNode;
  /** Legenda curta no canto inferior-esquerdo (pílula) — versão simples. */
  caption?: ReactNode;
  /** Painel de conteúdo inferior-esquerdo (kicker + título + lead). */
  panel?: Panel;
  /** CTAs no canto inferior-direito. No modo player, sem isto mostra "Assistir
   *  ao vídeo"; null esconde. No modo loop, só aparece o que vier aqui. */
  actions?: ReactNode | null;
  /** Rótulo + meta do botão padrão "Assistir ao vídeo" (modo player). */
  watch?: { label?: string; meta?: ReactNode };
  /** Rótulo do botão de fechar na barra inferior (modo player tocando). */
  closeLabel?: string;
  videoTitle?: string;
};

function PlayGlyph({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className="ml-0.5" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>;
}
function XGlyph({ size = 18 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

/**
 * Hero full-bleed da família Cuidado Global — espelha o "TopoVideo" do
 * novo.creeta (tamanhos/espaçamentos exatos: max-w-1600, rounded-32,
 * min-h 560/820), com a linguagem do Breathe (tokens: ink/surface).
 *
 * O fundo é SEMPRE um clipe local em repetição (BackgroundVideo). No modo
 * "player", um botão de assistir carrega o vídeo inteiro no próprio card e
 * abre a barra de fechar no pé (legenda à esquerda, "Fechar" à direita).
 * Nada é pedido ao YouTube antes do play (domínio sem cookies).
 */
export function PageVideoHero({
  video,
  topLeft,
  caption,
  panel,
  actions,
  watch,
  closeLabel = "Fechar o vídeo",
  videoTitle,
}: Props) {
  const isPlayer = video.mode === "player";
  const [playing, setPlaying] = useState(false);
  const watchRef = useRef<HTMLButtonElement>(null);
  const playedOnce = useRef(false);

  // Ao fechar, o foco volta para o botão de assistir.
  useEffect(() => {
    if (playing) playedOnce.current = true;
    else if (playedOnce.current) watchRef.current?.focus();
  }, [playing]);

  const legenda = isPlayer ? (video as VideoPlayer).legenda : undefined;

  return (
    <div className="px-4 pt-2 md:px-6 md:pt-6">
      <section className="relative isolate mx-auto flex min-h-[min(calc(100svh-7.5rem),560px)] max-w-[1600px] flex-col justify-end overflow-hidden rounded-[32px] bg-ink text-surface lg:min-h-[min(calc(100svh-7.5rem),820px)]">
        {/* mídia — clipe em loop (prévia) ou, tocando, o vídeo inteiro */}
        <div className={`absolute inset-x-0 top-0 ${playing ? "bottom-[4.5rem]" : "bottom-0 -z-10"}`}>
          {playing ? (
            <iframe
              title={videoTitle ?? "Vídeo"}
              src={`https://www.youtube-nocookie.com/embed/${(video as VideoPlayer).youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 bg-black"
            />
          ) : (
            <>
              <BackgroundVideo
                key={video.preview.src}
                src={video.preview.src}
                srcLarge={video.preview.srcLarge}
                poster={video.preview.poster}
                posterLarge={video.preview.posterLarge}
                trimEdges={video.preview.trimEdges}
                objectPosition={video.preview.objectPosition}
                className="absolute inset-0"
              />
              {/* véus — legibilidade do texto (base) e dos elementos do topo */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/35 to-transparent" />
            </>
          )}
        </div>

        {!playing && (
          <>
            {/* topo-esquerdo */}
            {topLeft && <div className="absolute top-4 left-4 z-10">{topLeft}</div>}

            {/* painel / legenda — no fluxo (justify-end), m-6 */}
            <div className="relative z-10 p-6 md:m-6 md:p-0">
              {panel ? (
                <div className="inline-flex max-w-full items-center rounded-[24px] bg-ink/75 px-6 py-4 backdrop-blur-md md:max-w-[calc(100%-16rem)] lg:px-7 lg:py-5">
                  <div>
                    {panel.kicker && (
                      <p className="mb-3 font-heading text-[0.82rem] font-bold tracking-[0.1em] text-surface/80 uppercase">{panel.kicker}</p>
                    )}
                    <h1 className="font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.015em] text-balance text-surface">{panel.title}</h1>
                    {panel.lead && (
                      <p className="mt-4 max-w-[46ch] text-base leading-[1.55] text-pretty text-surface/85 md:text-lg">{panel.lead}</p>
                    )}
                  </div>
                </div>
              ) : caption ? (
                <div className="inline-block rounded-[22px] bg-ink/70 px-5 py-3 font-heading text-[1.05rem] font-medium text-surface backdrop-blur-md md:text-xl">{caption}</div>
              ) : null}
            </div>

            {/* ação inferior-direita */}
            {actions === null ? null : actions ? (
              <div className="absolute right-4 bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 md:right-6 md:bottom-6">{actions}</div>
            ) : isPlayer ? (
              <button
                ref={watchRef}
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute right-4 bottom-4 z-10 flex items-center gap-3 rounded-full border border-surface/15 bg-ink/80 py-2 pr-7 pl-2 font-body font-semibold text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none md:right-6 md:bottom-6"
              >
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink">
                  <PlayGlyph size={20} />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  {watch?.label ?? "Assistir ao vídeo"}
                  {watch?.meta && <span className="text-sm font-normal text-surface/80">{watch.meta}</span>}
                </span>
              </button>
            ) : null}
          </>
        )}

        {/* barra de fechar — pé do vídeo tocando (legenda à esquerda, fechar à direita) */}
        {playing && (
          <div className="relative z-10 flex h-[4.5rem] items-center justify-between gap-6 bg-ink px-6">
            <p className="min-w-0 truncate text-sm text-surface/80">{legenda}</p>
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
