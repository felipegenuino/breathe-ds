"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackgroundVideo } from "./BackgroundVideo";

type Panel = { kicker?: ReactNode; title: ReactNode; lead?: ReactNode };

/** Clipe de fundo local (modo loop), sem som, em repetição. */
type LoopPreview = {
  src: string;
  srcLarge?: string;
  poster: string;
  posterLarge?: string;
  trimEdges?: boolean;
  objectPosition?: string;
};

/** Dois tipos de hero com vídeo:
 *  - loop:   um clipe local em repetição (sem player). Fundo = BackgroundVideo.
 *  - player: o PRÓPRIO vídeo do YouTube roda mudo, em repetição, como fundo
 *            (16:9, cobrindo o cartão, sem corte/zoom). Ao apertar o som ele
 *            remonta do zero — com áudio e controles — e surge a barra de
 *            fechar no pé. Mantém a consistência: a prévia e o vídeo são o
 *            mesmo material. */
type VideoLoop = { mode: "loop"; preview: LoopPreview };
type VideoPlayer = {
  mode: "player";
  youtubeId: string;
  /** Quadro parado (movimento reduzido / economia de dados). Sem ele, usa a
   *  miniatura do próprio YouTube (maxresdefault). */
  poster?: string;
  legenda?: ReactNode;
};

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
  /** Rótulos do botão de pausa do fundo (modo player, prévia muda). */
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
 * Fundo em vídeo do YouTube rodando MUDO, em repetição, cobrindo o cartão
 * (modo player, antes de o som começar). É enfeite: fica fora da leitura de
 * tela. Respeita movimento reduzido e economia de dados (aí fica no quadro
 * parado, sem pedir o vídeo). O "cover" é feito com unidades de container
 * (cqw/cqh), então a proporção 16:9 nunca é distorcida nem cortada em falso.
 * Tem botão de pausa (WCAG 2.2.2). O clique passa reto (pointer-events-none):
 * quem recebe o toque é o botão de assistir, por cima.
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
    if (lessMotion || saveData) return; // fica no quadro parado
    setShow(true);
  }, []);

  function toggle() {
    const w = frame.current?.contentWindow;
    if (!w) return;
    // API do YouTube por postMessage (enablejsapi=1): pausa/retoma sem carregar o script.
    w.postMessage(JSON.stringify({ event: "command", func: paused ? "playVideo" : "pauseVideo", args: [] }), "*");
    setPaused((p) => !p);
  }

  const posterSrc = poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ containerType: "size" }}>
      {show ? (
        <iframe
          ref={frame}
          title={title ?? "Vídeo"}
          tabIndex={-1}
          aria-hidden="true"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
          style={{ width: "max(100cqw, 177.78cqh)", height: "max(100cqh, 56.25cqw)" }}
        />
      ) : (
        // miniatura do próprio YouTube (16:9) quando não se toca o vídeo
        // eslint-disable-next-line @next/next/no-img-element
        <img src={posterSrc} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      )}
      {show && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? labels?.play ?? "Reproduzir vídeo" : labels?.pause ?? "Pausar vídeo"}
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
 * Hero full-bleed da família Cuidado Global — espelha o "TopoVideo" do
 * novo.creeta (tamanhos/espaçamentos exatos: max-w-1600, rounded-32,
 * min-h 560/820), com a linguagem do Breathe (tokens: ink/surface).
 *
 * - loop:   o fundo é um clipe local em repetição (BackgroundVideo).
 * - player: o fundo é o PRÓPRIO vídeo do YouTube rodando mudo, em repetição.
 *           Ao apertar o som, ele remonta do zero (com áudio e controles) no
 *           próprio cartão e abre a barra de fechar no pé (legenda à esquerda,
 *           "Fechar" à direita).
 */
export function PageVideoHero({
  video,
  topLeft,
  caption,
  panel,
  actions,
  watch,
  closeLabel = "Fechar o vídeo",
  previewLabels,
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
        {/* mídia — fundo (prévia) ou, tocando, o vídeo inteiro com som */}
        <div className={`absolute inset-x-0 top-0 ${playing ? "bottom-[4.5rem]" : "bottom-0 -z-10"}`}>
          {playing ? (
            <iframe
              key="cg-hero-som"
              title={videoTitle ?? "Vídeo"}
              src={`https://www.youtube-nocookie.com/embed/${(video as VideoPlayer).youtubeId}?autoplay=1&mute=0&start=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 bg-black"
            />
          ) : (
            <>
              {isPlayer ? (
                <YouTubeBackground
                  id={(video as VideoPlayer).youtubeId}
                  poster={(video as VideoPlayer).poster}
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
                  className="absolute inset-0"
                />
              )}
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
