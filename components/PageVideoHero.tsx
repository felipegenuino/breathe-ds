"use client";

import { useRef, useState, type ReactNode } from "react";

type Panel = { kicker?: ReactNode; title: ReactNode; lead?: ReactNode };

type Props = {
  videoId: string;
  /** Slot no topo-esquerdo (selo de local, "← voltar" + ícone). */
  topLeft?: ReactNode;
  /** Legenda curta no canto inferior-esquerdo (pílula) — versão simples. */
  caption?: ReactNode;
  /** Painel de conteúdo inferior-esquerdo (kicker + título + lead). */
  panel?: Panel;
  /** CTAs no canto inferior-direito. Sem isto, mostra "Assistir ao vídeo"; null esconde. */
  actions?: ReactNode | null;
  /** Rótulo + meta do botão padrão "Assistir ao vídeo". */
  watch?: { label?: string; meta?: ReactNode };
  videoTitle?: string;
};

function PlayGlyph({ size = 20 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} className="ml-0.5" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>;
}
function PauseGlyph() {
  return <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1.2" /><rect x="14" y="4" width="4" height="16" rx="1.2" /></svg>;
}

/**
 * Hero full-bleed da família Cuidado Global — espelha o "TopoVideo" do
 * novo.creeta (tamanhos/espaçamentos exatos: max-w-1600, rounded-32,
 * min-h 560/820, painel rounded-24 px-6 py-4, botão assistir bottom-6 right-6,
 * pausa top-4 right-4), com a linguagem do Breathe (tokens: ink/surface).
 * Vídeo COBRE o card (cqw/cqh). Botão de pausa controla o vídeo (API do
 * YouTube). Slots injetáveis.
 */
export function PageVideoHero({
  videoId,
  topLeft,
  caption,
  panel,
  actions,
  watch,
  videoTitle,
}: Props) {
  const [som, setSom] = useState(false);
  const [playing, setPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const base = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams({
    autoplay: "1", mute: som ? "0" : "1", loop: "1", playlist: videoId,
    controls: som ? "1" : "0", playsinline: "1", rel: "0", modestbranding: "1",
    cc_load_policy: "0", iv_load_policy: "3", enablejsapi: "1",
  });

  const command = (func: string) =>
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  const togglePlay = () => { command(playing ? "pauseVideo" : "playVideo"); setPlaying((p) => !p); };

  return (
    <div className="px-4 pt-2 md:px-6 md:pt-6">
      <section className="relative isolate mx-auto flex min-h-[min(calc(100svh-7.5rem),560px)] max-w-[1600px] flex-col justify-end overflow-hidden rounded-[32px] bg-ink text-surface lg:min-h-[min(calc(100svh-7.5rem),820px)]">
        {/* fundo — vídeo cobrindo (cqw/cqh) */}
        <div className="absolute inset-0 -z-10 [container-type:size]">
          <iframe
            ref={iframeRef}
            key={som ? "com-som" : "mudo"}
            src={`${base}?${params.toString()}`}
            title={videoTitle ?? (typeof caption === "string" ? caption : "Vídeo")}
            className="absolute top-1/2 left-1/2 h-[56.25cqw] max-h-none min-h-full w-[177.78cqh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {!som && (
          <>
            {/* véus — legibilidade do texto (base) e dos elementos do topo */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/35 to-transparent" />

            {/* topo-esquerdo */}
            {topLeft && <div className="absolute top-4 left-4 z-10">{topLeft}</div>}

            {/* pausa — top-4 right-4 (igual creeta) */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
              className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
            >
              {playing ? <PauseGlyph /> : <PlayGlyph size={18} />}
            </button>

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

            {/* assistir / CTAs — bottom-6 right-6 (actions={null} esconde) */}
            {actions === null ? null : actions ? (
              <div className="absolute right-4 bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 md:right-6 md:bottom-6">{actions}</div>
            ) : (
              <button
                type="button"
                onClick={() => setSom(true)}
                className="absolute right-4 bottom-4 z-10 flex items-center gap-3 rounded-full border border-surface/15 bg-ink/80 py-2 pr-7 pl-2 font-heading font-semibold text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none md:right-6 md:bottom-6"
              >
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink">
                  <PlayGlyph size={20} />
                </span>
                <span className="flex flex-col items-start leading-tight">
                  {watch?.label ?? "Assistir ao vídeo"}
                  {watch?.meta && <span className="text-sm font-normal text-surface/80">{watch.meta}</span>}
                </span>
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
