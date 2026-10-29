"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BreatheMark } from "./BreatheMark";

type Props = {
  /** Nome da marca (ex.: "creeta", "TTCAB", "Breathe"). */
  name: ReactNode;
  /** Linha abaixo do nome (ex.: "Centro de Reequilíbrio Toracoabdominal"). */
  tagline?: ReactNode;
  /** Símbolo à esquerda do nome. Padrão: o BreatheMark (anel + ponto). Cada
   *  site injeta o seu logotipo aqui. */
  logo?: ReactNode;
  /** Quando `name` é um wordmark svg: altura dele como fração da altura do
   *  símbolo, do manual da marca (ex.: `CREETA_LOCKUP.wordmarkPerSymbol`). */
  wordmarkRatio?: number;
  /** Chave do sessionStorage (quando há o script de cabeça). */
  storageKey?: string;
  /** Chamado quando a cortina termina de subir. */
  onDone?: () => void;
  className?: string;
};

/**
 * Cortina de entrada da família Cuidado Global — tela cheia, na cor do site
 * (tokens surface/ink), com o logotipo + nome se formando no centro e a
 * tagline embaixo; depois ela sobe e mostra a página. Espelha a `Cortina` do
 * creeta, mas neutra: a paleta e o logotipo vêm de cada app.
 *
 * - É toda em CSS (estilo embutido): sem JavaScript ela sobe do mesmo jeito,
 *   então nunca fica presa na frente do site.
 * - Não recebe clique nem foco e não existe para leitor de tela (aria-hidden).
 * - Com movimento reduzido (ou impressão) não aparece.
 * - Para aparecer só na 1ª visita da sessão, ponha `cortinaHeadScript()` no
 *   <head> (antes da pintura): em visita repetida o <html> já nasce com
 *   data-cg-cortina="vista" e a cortina não é desenhada — sem piscar.
 *
 * Ao terminar de subir, o <html> ganha data-cg-cortina-fim (para o topo das
 * páginas "pousar" só depois dela, nunca numa troca de tela) e chama onDone.
 */
export function Cortina({ name, tagline, logo, wordmarkRatio, storageKey, onDone, className }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const aoTerminar = (e: AnimationEvent) => {
      if (e.animationName !== "cg-cortina-sobe") return;
      document.documentElement.setAttribute("data-cg-cortina-fim", "");
      try {
        if (storageKey) sessionStorage.setItem(storageKey, "1");
      } catch {
        /* sessionStorage bloqueado: a cortina só aparece de novo, nada quebra */
      }
      onDone?.();
      setGone(true);
    };
    node.addEventListener("animationend", aoTerminar);
    return () => node.removeEventListener("animationend", aoTerminar);
  }, [onDone, storageKey]);

  if (gone) return null;

  return (
    <div ref={el} className={`cg-cortina${className ? ` ${className}` : ""}`} aria-hidden="true">
      <style>{CORTINA_CSS}</style>
      <div className="cg-cortina__lockup">
        <span className="cg-cortina__mark">{logo ?? <BreatheMark size={60} duration={5} />}</span>
        <span className="cg-cortina__text">
          <span
            className="cg-cortina__name"
            style={wordmarkRatio ? ({ "--cg-wordmark": `calc(var(--cg-cortina-mark) * ${wordmarkRatio})` } as CSSProperties) : undefined}
          >
            {name}
          </span>
          {tagline && <span className="cg-cortina__tag">{tagline}</span>}
        </span>
      </div>
    </div>
  );
}

/**
 * Script para o <head> (antes da pintura): marca a cortina como vista nesta
 * sessão, para não repetir ao navegar nem ao recarregar. Sem ele, a cortina
 * aparece a cada carregamento.
 *   // Next (app/layout):
 *   <script dangerouslySetInnerHTML={{ __html: cortinaHeadScript("cg-cortina") }} />
 */
export function cortinaHeadScript(storageKey = "cg-cortina") {
  const k = JSON.stringify(storageKey);
  return `try{var d=document.documentElement;if(sessionStorage.getItem(${k})){d.setAttribute('data-cg-cortina','vista')}else{sessionStorage.setItem(${k},'1')}}catch(e){}`;
}

const CORTINA_CSS = `
.cg-cortina{
  --cg-cortina-mark: clamp(40px,7.4vw,60px); /* altura do símbolo */
  position:fixed; inset:0 0 -40px; padding-bottom:40px;
  z-index:120; display:grid; place-items:center;
  border-radius:0 0 32px 32px;
  background:var(--color-surface,#fff); color:var(--color-ink,#14323a);
  box-shadow:0 24px 60px -20px rgba(0,0,0,.28);
  pointer-events:none;
  animation:cg-cortina-sobe 700ms cubic-bezier(.77,0,.175,1) 2200ms both;
}
/* gap ≈ 1/3 do corpo do nome: o anel é curvo, então o vão óptico lê um pouco maior que o geométrico */
.cg-cortina__lockup{ display:flex; align-items:center; gap:clamp(10px,1.6vw,16px); padding:0 24px; }
.cg-cortina__mark{ display:inline-flex; color:var(--color-ink,#14323a);
  animation:cg-cortina-mark 700ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) both; }
/* símbolo ~1.25× o corpo do nome (a caixa do SVG é justa ao glifo), fluido.
   Por altura: um símbolo injetado não-quadrado (TTCAB) mantém a proporção. */
.cg-cortina__mark svg{ height:var(--cg-cortina-mark); width:auto; }
.cg-cortina__text{ display:flex; flex-direction:column; min-width:0; }
.cg-cortina__name{
  font-family:var(--font-heading,system-ui,sans-serif);
  font-weight:700; font-size:clamp(2rem,6vw,3rem); line-height:1; letter-spacing:-.02em;
  animation:cg-cortina-nome 600ms var(--ease-cg,cubic-bezier(.2,.8,.2,1)) 480ms both;
}
.cg-cortina__tag{
  margin-top:.55rem; font-family:var(--font-body,system-ui,sans-serif);
  font-size:clamp(.8rem,2.4vw,1rem); line-height:1.3; color:var(--color-ink-soft,#54707a);
  animation:cg-cortina-tag 500ms ease 820ms both;
}
@keyframes cg-cortina-sobe{ to{ transform:translateY(-100%); visibility:hidden; } }
@keyframes cg-cortina-mark{ from{ opacity:0; transform:scale(.6) rotate(-16deg); } }
@keyframes cg-cortina-nome{ from{ opacity:0; transform:translateX(-8px); } }
@keyframes cg-cortina-tag{ from{ opacity:0; transform:translateY(4px); } }
html[data-cg-cortina="vista"] .cg-cortina{ display:none; }
@media (prefers-reduced-motion:reduce){ .cg-cortina{ display:none; } }
@media print{ .cg-cortina{ display:none; } }
`;
