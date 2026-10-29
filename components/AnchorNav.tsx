"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ElementType } from "react";
import { Container } from "./Container";

export type AnchorItem = { id: string; label: string };

type Props = {
  items: AnchorItem[];
  /** Classe de deslocamento do sticky (altura do header). Padrão `top-20` (header de 80px). */
  stickyTop?: string;
  /** Componente de link do app (ex.: next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  className?: string;
};

/**
 * Navegação contextual de âncoras — cápsula flutuante que acompanha a rolagem
 * (extraída do TreatmentAnchorNav do ttcab). Dois comportamentos:
 *  1. Scroll-spy: um IntersectionObserver marca como ativa a seção que cruza a
 *     faixa ~35% do topo; o pill correspondente acende.
 *  2. Indicador deslizante: um <span> absoluto mede o pill ativo (offsetLeft/
 *     Width, imune ao scroll horizontal da cápsula) e desliza até ele na curva
 *     da família. Em tela estreita a cápsula rola e centraliza o ativo.
 * Sinal do ativo = o indicador (preenchimento ink/12 + contorno), NÃO cor do
 * texto: o texto fica sempre `ink` sobre `surface`, sem frame de contraste
 * fraco. prefers-reduced-motion corta o deslize. As seções-alvo precisam de
 * `scroll-mt-*` compatível com o sticky (ex.: `scroll-mt-40`).
 */
export function AnchorNav({ items, stickyTop = "top-20", linkComponent, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, ready: false });

  // Scroll-spy
  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  // Chegada com #hash por navegação client-side: rola até a âncora (no full
  // load o browser já faz; aqui é idempotente). Reaplica algumas vezes para
  // vencer o reset tardio de scroll do roteador.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !items.some((it) => it.id === hash)) return;
    const el = document.getElementById(hash);
    if (!el) return;
    setActive(hash);
    let tries = 0;
    const id = window.setInterval(() => {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      if (++tries >= 4) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
  }, [items]);

  const measure = () => {
    const el = linkRefs.current[active];
    if (!el) return;
    setPill({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, ready: true });
  };

  // Mede o pill ativo + revela na cápsula em telas estreitas
  useLayoutEffect(() => {
    measure();
    const el = linkRefs.current[active];
    const list = listRef.current;
    if (!el || !list) return;
    const target = el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Recalcula em resize (quebras/fontes mudam a largura)
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <nav aria-label="Nesta página" className={`sticky ${stickyTop} z-30 py-3 ${className}`}>
      <Container>
        <div className="flex justify-center">
          <ul
            ref={listRef}
            className="relative flex max-w-full list-none gap-1 overflow-x-auto rounded-pill border border-line bg-surface/95 p-1.5 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.35)] backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Indicador deslizante */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 rounded-pill bg-ink/[0.12] shadow-[inset_0_0_0_1px_var(--color-line)] transition-[transform,width,height,opacity] duration-[320ms] ease-cg motion-reduce:transition-none"
              style={{ width: pill.w, height: pill.h, opacity: pill.ready ? 1 : 0, transform: `translate(${pill.x}px, ${pill.y}px)` }}
            />
            {items.map((n) => {
              const isActive = n.id === active;
              return (
                <li key={n.id}>
                  <L
                    ref={(el: HTMLAnchorElement | null) => {
                      linkRefs.current[n.id] = el;
                    }}
                    href={`#${n.id}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setActive(n.id)}
                    className={`relative z-10 inline-block whitespace-nowrap rounded-pill border border-transparent px-3.5 py-2 font-heading text-[0.92rem] font-semibold text-ink transition-[background-color,border-color] duration-200 ease-cg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${
                      isActive ? "" : "hover:border-ink/15 hover:bg-ink/[0.06]"
                    }`}
                  >
                    {n.label}
                  </L>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </nav>
  );
}
