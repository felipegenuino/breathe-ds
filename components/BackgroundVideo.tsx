"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Clipe curto, sem som, em repetição (arquivo do próprio site). */
  src: string;
  /** Versão maior, baixada só em telas largas (a partir de `from`). */
  srcLarge?: string;
  /** Largura mínima (px) para a versão maior. 1024 por padrão. */
  from?: 768 | 1024;
  /** Quadro parado: aparece antes de o vídeo carregar, sem JS e com movimento reduzido. */
  poster: string;
  /** Quadro parado da versão maior, quando ela é outro vídeo (ex.: vertical no celular, deitado no desktop). */
  posterLarge?: string;
  /** Aproxima o vídeo para cortar bordas gravadas no arquivo. */
  trimEdges?: boolean;
  /** object-position do vídeo (ex.: "center 20%" p/ manter o rosto num clipe vertical). */
  objectPosition?: string;
  /** Rótulos do botão de pausa (injetáveis p/ i18n). */
  labels?: { pause?: string; play?: string };
  className?: string;
};

/**
 * Vídeo de fundo da família Cuidado Global — espelha o `VideoFundo` do creeta
 * com os tokens do Breathe (ink/surface). Clipe mudo em repetição, é enfeite:
 * fica fora da leitura de tela (aria-hidden). Não usa o atributo `autoplay`:
 * só começa depois de conferir prefers-reduced-motion e economia de dados
 * (save-data). Tem botão de pausa (WCAG 2.2.2) no canto superior-direito.
 */
export function BackgroundVideo({
  src,
  srcLarge,
  from = 1024,
  poster,
  posterLarge,
  trimEdges = false,
  objectPosition,
  labels,
  className,
}: Props) {
  const wide = `(min-width: ${from}px)`;
  const video = useRef<HTMLVideoElement>(null);
  const [running, setRunning] = useState(false);
  const [posterNow, setPosterNow] = useState(poster);

  useEffect(() => {
    if (posterLarge && typeof window.matchMedia === "function" && window.matchMedia(wide).matches) {
      setPosterNow(posterLarge);
    }
  }, [posterLarge, wide]);

  useEffect(() => {
    const lessMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (lessMotion || saveData) return;
    video.current
      ?.play()
      .then(() => setRunning(true))
      .catch(() => setRunning(false));
  }, []);

  function toggle() {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setRunning(true)).catch(() => setRunning(false));
    } else {
      v.pause();
      setRunning(false);
    }
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterNow}
        aria-hidden="true"
        tabIndex={-1}
        style={objectPosition ? { objectPosition } : undefined}
        className={`h-full w-full object-cover ${trimEdges ? "scale-[1.18]" : ""}`}
      >
        {srcLarge && <source src={srcLarge} type="video/mp4" media={wide} />}
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={running ? labels?.pause ?? "Pausar vídeo" : labels?.play ?? "Reproduzir vídeo"}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-surface backdrop-blur-md transition-colors duration-200 hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none"
      >
        {running ? (
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1.2" /><rect x="14" y="4" width="4" height="16" rx="1.2" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-[18px] w-[18px]" fill="currentColor" aria-hidden="true"><path d="M6 3v18l15-9z" /></svg>
        )}
      </button>
    </div>
  );
}
