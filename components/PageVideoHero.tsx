"use client";

import { useRef, useState, type ReactNode } from "react";

type Panel = { kicker?: ReactNode; title: ReactNode; lead?: ReactNode };

type Props = {
  videoId: string;
  /** Slot no topo-esquerdo (selo de local, "← voltar" + ícone, etc.). */
  topLeft?: ReactNode;
  /** Legenda curta no canto inferior-esquerdo (pílula de vidro) — versão home. */
  caption?: ReactNode;
  /** Painel de conteúdo inferior-esquerdo (kicker + título + lead). */
  panel?: Panel;
  /** CTAs no canto inferior-direito. Sem isto, mostra o botão "Assistir ao vídeo". */
  actions?: ReactNode;
  /** Rótulo + meta do botão padrão "Assistir ao vídeo" (ex.: "Com som, 3 min 33s"). */
  watch?: { label?: string; meta?: ReactNode };
  /** Título acessível do iframe. */
  videoTitle?: string;
  /** Altura do hero. */
  height?: string;
};

function PlayGlyph() {
  return <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] translate-x-[1px]" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>;
}
function PauseGlyph() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
}

/**
 * Hero full-bleed da família Cuidado Global — modelo do novo.creeta. Vídeo
 * COBRE o card inteiro (cqw/cqh), bordas arredondadas, largura ampla. Elementos
 * (todos opcionais, slots): botão pausar/play no topo-direito, slot no
 * topo-esquerdo, legenda OU painel no inferior-esquerdo, CTAs OU "Assistir ao
 * vídeo" no inferior-direito. Botão de pausa controla o vídeo de verdade
 * (postMessage da API do YouTube). Deps injetáveis (slots por props).
 */
export function PageVideoHero({
  videoId,
  topLeft,
  caption,
  panel,
  actions,
  watch,
  videoTitle,
  height = "clamp(520px, 82vh, 880px)",
}: Props) {
  const [som, setSom] = useState(false);
  const [playing, setPlaying] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    enablejsapi: "1",
  });

  const command = (func: string) =>
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  const togglePlay = () => {
    command(playing ? "pauseVideo" : "playVideo");
    setPlaying((p) => !p);
  };

  const glass = "bg-ink/55 backdrop-blur-md";

  return (
    <div className="px-2 md:px-3">
      <section
        className="relative isolate flex w-full flex-col justify-end overflow-hidden rounded-[22px] bg-ink text-surface [container-type:size] md:rounded-[26px]"
        style={{ height }}
      >
        {/* vídeo cobrindo */}
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

        {/* véu p/ legibilidade do texto (some com som ligado) */}
        {!som && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/15" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/40 to-transparent" />
          </>
        )}

        {/* topo-esquerdo */}
        {topLeft && <div className="absolute top-5 left-5 z-10 md:top-7 md:left-7">{topLeft}</div>}

        {/* topo-direito: pausar / play */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          className={`absolute top-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full ${glass} text-surface transition hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface md:top-7 md:right-7`}
        >
          {playing ? <PauseGlyph /> : <PlayGlyph />}
        </button>

        {/* linha inferior: painel/legenda (esq) + CTAs/assistir (dir) */}
        {!som && (
          <div className="relative z-10 flex items-end justify-between gap-4 p-4 md:p-6">
            <div className="min-w-0">
              {panel ? (
                <div className={`max-w-[40rem] rounded-2xl p-[clamp(20px,3vw,34px)] ${glass}`}>
                  {panel.kicker && (
                    <p className="mb-3 font-heading text-[0.8rem] font-bold tracking-[0.12em] text-surface/80 uppercase">{panel.kicker}</p>
                  )}
                  <h1 className="font-heading text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.015em] text-balance text-surface">{panel.title}</h1>
                  {panel.lead && (
                    <p className="mt-4 max-w-[44ch] text-base leading-[1.55] text-pretty text-surface/90 md:text-lg">{panel.lead}</p>
                  )}
                </div>
              ) : caption ? (
                <div className={`inline-block rounded-2xl px-5 py-3 font-heading text-[1.05rem] font-medium text-surface md:text-xl ${glass}`}>
                  {caption}
                </div>
              ) : null}
            </div>

            <div className="flex flex-none flex-wrap items-center justify-end gap-2">
              {actions ?? (
                <button
                  type="button"
                  onClick={() => setSom(true)}
                  className={`inline-flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 text-left text-surface transition hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface ${glass}`}
                >
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-surface text-ink">
                    <PlayGlyph />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-heading text-sm font-semibold">{watch?.label ?? "Assistir ao vídeo"}</span>
                    {watch?.meta && <span className="block text-xs text-surface/80">{watch.meta}</span>}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
