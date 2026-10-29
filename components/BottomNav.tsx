"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type ElementType, type ReactNode } from "react";

/** Ícone no padrão lucide (o componente, não o nó): a barra decide o tamanho. */
export type IconType = ComponentType<{ size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

/** Uma página do site, em ordem de importância. As primeiras ficam na barra;
 *  as que não couberem vão para o "Mais". */
export type BottomPage = {
  href: string;
  label: ReactNode;
  Icon: IconType;
  /** A página atual é esta? (o app decide: rota/idioma são dele) */
  active?: boolean;
};

/** Saída extra do painel "Mais" (ex.: cursos em outro site): endereço escrito
 *  embaixo e seta para fora, como no novo.creeta. */
export type BottomExtra = {
  href: string;
  label: ReactNode;
  Icon: IconType;
  /** Linha menor sob o rótulo (ex.: o domínio). Com `external` e sem isto, mostra o domínio do href. */
  description?: ReactNode;
  external?: boolean;
  active?: boolean;
};

type Labels = {
  /** aria-label da barra */
  nav: string;
  /** rótulo da aba "Mais" */
  more: string;
  /** aria-label do painel */
  morePages: string;
  /** sr-only depois de "Mais": "mais páginas" */
  morePagesSr: string;
  /** sr-only quando a página atual está no "Mais" */
  currentHere: string;
  /** sr-only em link externo */
  newTab: string;
};

const PT: Labels = {
  nav: "Navegação principal",
  more: "Mais",
  morePages: "Mais páginas",
  morePagesSr: "mais páginas",
  currentHere: "(a página atual está aqui)",
  newTab: "(abre em outra aba)",
};

type Props = {
  pages: BottomPage[];
  extras?: BottomExtra[];
  /** Componente de link do app (ex.: next-intl Link). Default: <a>. */
  linkComponent?: ElementType;
  /** A partir de que largura o header assume e a barra some. creeta: `md`; ttcab: `lg`. */
  hideFrom?: "md" | "lg";
  /** Textos (padrão pt-BR); o app passa os do idioma. */
  labels?: Partial<Labels>;
  /** Embutida num contêiner `relative` (demo, moldura de celular): barra, véu e
   *  painel ficam `absolute` dentro dele e aparecem em qualquer largura. */
  embedded?: boolean;
};

/** Largura mínima de uma aba, em px: abaixo disso o rótulo não cabe. */
export const TAB_MIN_WIDTH = 64;

/** Quantas páginas aparecem direto na barra, para uma largura útil. A última
 *  aba é sempre o "Mais" (é nele que ficam as páginas que não couberam e as
 *  saídas extras), então cabe uma página a menos que o número de abas. */
export function howManyFit(width: number, total: number): number {
  const tabs = Math.floor(width / TAB_MIN_WIDTH);
  return Math.max(2, Math.min(total, tabs - 1));
}

const MenuIcon: IconType = ({ size = 20, strokeWidth = 1.75 }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg>
);

// Aba: coluna ícone+rótulo. Ativa ganha FORMA (pílula clara), não só cor —
// legível pra quem não distingue cor. Encolhe no toque, como botão de app.
// O nome de transição faz o destaque deslizar entre as abas na troca de página.
const tab = (active: boolean) =>
  [
    "flex h-14 w-full flex-col items-center justify-center gap-1 rounded-[20px] px-1 text-[10.5px] font-medium leading-none tracking-tight",
    "transition duration-150 active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface",
    active ? "bg-surface text-ink [view-transition-name:aba-ativa]" : "text-surface/85 hover:bg-white/10",
  ].join(" ");

const row = (active?: boolean) =>
  `flex min-h-14 items-center gap-3 rounded-[18px] px-3 font-medium transition-colors duration-150 active:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none ${
    active ? "bg-surface text-ink" : "text-ink"
  }`;
const bubble = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/[0.12] text-ink";

/**
 * Navegação principal no celular: barra flutuante ao alcance do polegar, como
 * em app. É o código da BarraNavegacao do novo.creeta (e do BottomNav do
 * ttcab), neutro por tokens: `ink` na barra, `surface` na aba ativa.
 *
 * - Dinâmica: mostra quantas páginas couberem na largura (ResizeObserver,
 *   64px por aba). A última aba é sempre o "Mais", com o resto e as saídas
 *   extras. Num celular comum são quatro páginas e o "Mais".
 * - Véu atrás da barra: o conteúdo some aos poucos antes de chegar nela.
 * - O painel "Mais" é um popover nativo: fecha com Esc e com toque fora,
 *   devolve o foco ao botão e abre mesmo sem JavaScript. Embutido (demo),
 *   vira um painel absoluto dentro da moldura, com a mesma entrada.
 * - Some a partir de `hideFrom` (md no creeta, lg no ttcab), onde o header assume.
 */
export function BottomNav({ pages, extras = [], linkComponent, hideFrom = "lg", labels, embedded = false }: Props) {
  const L: ElementType = linkComponent ?? "a";
  const t = { ...PT, ...labels };
  const list = useRef<HTMLUListElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const panelId = useId();
  // antes de medir: o caso do celular comum (5 abas = 4 páginas + Mais)
  const [visible, setVisible] = useState(() => howManyFit(5 * TAB_MIN_WIDTH, pages.length));
  const [open, setOpen] = useState(false); // só no modo embutido

  useEffect(() => {
    const ul = list.current;
    if (!ul || typeof ResizeObserver !== "function") return;
    const measure = () => {
      const cs = getComputedStyle(ul);
      const useful = ul.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (useful > 0) setVisible(howManyFit(useful, pages.length));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [pages.length]);

  const close = () => {
    if (embedded) return setOpen(false);
    const el = panel.current as (HTMLDivElement & { hidePopover?: () => void }) | null;
    try {
      if (el?.matches(":popover-open")) el.hidePopover?.();
    } catch {
      /* navegador sem popover: não há o que fechar */
    }
  };

  // Trocou de página: o painel fecha.
  const activeHref = pages.find((p) => p.active)?.href;
  useEffect(close, [activeHref]); // eslint-disable-line react-hooks/exhaustive-deps

  // Embutido: fecha com Esc e com toque fora (o popover nativo faz isso sozinho).
  useEffect(() => {
    if (!embedded || !open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => document.addEventListener("pointerdown", onDown), 0);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [embedded, open]);

  const onBar = pages.slice(0, visible);
  const inMore = pages.slice(visible);
  const moreActive = inMore.some((p) => p.active) || extras.some((x) => x.active);
  const pos = embedded ? "absolute" : "fixed";
  // classes por inteiro (o Tailwind só gera o que acha escrito no código)
  const hide = embedded ? "" : hideFrom === "md" ? " md:hidden" : " lg:hidden";

  const panelInner = (
    <nav aria-label={t.morePages}>
      {/* Um item por linha: em duas colunas o painel ficava confuso. */}
      {inMore.length > 0 && (
        <ul className="grid list-none gap-1">
          {inMore.map(({ href, label, Icon, active }, i) => (
            <li key={`${i}-${href}`}>
              <L href={href} aria-current={active ? "page" : undefined} onClick={close} className={row(active)}>
                <span className={bubble}><Icon aria-hidden="true" size={19} strokeWidth={1.75} /></span>
                {label}
              </L>
            </li>
          ))}
        </ul>
      )}
      {extras.length > 0 && (
        <ul className={`grid list-none gap-1${inMore.length > 0 ? " mt-1 border-t border-ink/10 pt-1" : ""}`}>
          {extras.map(({ href, label, Icon, description, external, active }, i) => {
            const Tag: ElementType = external ? "a" : L;
            const desc = description ?? (external ? href.replace(/^https?:\/\//, "").replace(/\/$/, "") : null);
            return (
              <li key={`${i}-${href}`}>
                <Tag
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={active ? "page" : undefined}
                  onClick={close}
                  className={`${row(active)} py-2`}
                >
                  <span className={bubble}><Icon aria-hidden="true" size={19} strokeWidth={1.75} /></span>
                  <span className="flex-1">
                    {label}
                    {desc && <span className="block text-xs font-normal text-ink/80">{desc}</span>}
                    {external && <span className="sr-only"> {t.newTab}</span>}
                  </span>
                  {external && <span className="text-ink"><ArrowUpRight /></span>}
                </Tag>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );

  return (
    <div ref={wrap} className={embedded ? "contents" : undefined}>
      <style>{CSS}</style>
      {/* Véu atrás da barra: o conteúdo que rola some aos poucos antes de
          chegar nela, em vez de aparecer cortado pelas bordas. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none ${pos} inset-x-0 bottom-0 z-40 h-28 bg-gradient-to-t from-surface from-35% via-surface/85 via-65% to-transparent [view-transition-name:veu]${hide}`}
      />
      <nav
        aria-label={t.nav}
        className={`${pos} inset-x-3 bottom-3 z-50 pb-[env(safe-area-inset-bottom)] [view-transition-name:barra]${hide}`}
      >
        <ul
          ref={list}
          className="flex list-none items-stretch justify-between gap-0.5 rounded-[26px] bg-ink/95 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {onBar.map(({ href, label, Icon, active }, i) => (
            <li key={`${i}-${href}`} className="min-w-0 flex-1">
              <L href={href} aria-current={active ? "page" : undefined} className={tab(!!active)}>
                <Icon aria-hidden="true" size={20} strokeWidth={1.75} />
                <span className="w-full truncate text-center">{label}</span>
              </L>
            </li>
          ))}
          <li className="min-w-0 flex-1">
            {/* popovertarget em minúsculas: o React 18 não conhece o atributo e o repassa como está. */}
            <button
              type="button"
              {...(embedded ? { "aria-expanded": open, "aria-controls": panelId, onClick: () => setOpen((o) => !o) } : { popovertarget: panelId })}
              className={tab(embedded ? open || moreActive : moreActive)}
            >
              <MenuIcon />
              <span className="w-full truncate text-center">{t.more}</span>
              <span className="sr-only"> {t.morePagesSr}{moreActive ? ` ${t.currentHere}` : ""}</span>
            </button>
          </li>
        </ul>
      </nav>

      {embedded ? (
        open && (
          <div id={panelId} className="cg-more-panel cg-more-panel--embedded">
            {panelInner}
          </div>
        )
      ) : (
        <div ref={panel} id={panelId} {...{ popover: "auto" }} className={`cg-more-panel cg-more-panel--${hideFrom}`}>
          {panelInner}
        </div>
      )}
    </div>
  );
}

/* Painel "Mais": logo acima da barra; entra crescendo a partir do canto do
   botão "Mais", em 0,18s (igual ao .mais-painel do novo.creeta). */
const CSS = `
.cg-more-panel{
  position:fixed; inset:auto .75rem calc(5.75rem + env(safe-area-inset-bottom)) .75rem;
  width:auto; margin:0; border:0; border-radius:26px; padding:.5rem;
  background:#fff; color:var(--color-ink);
  box-shadow:0 20px 48px -16px rgb(0 0 0 / .35), 0 1px 2px rgb(0 0 0 / .1);
  opacity:0; transform:translateY(8px) scale(.97); transform-origin:88% 100%;
  transition:opacity 180ms cubic-bezier(.23,1,.32,1), transform 180ms cubic-bezier(.23,1,.32,1), overlay 180ms allow-discrete, display 180ms allow-discrete;
}
.cg-more-panel:popover-open, .cg-more-panel--embedded{ opacity:1; transform:none; }
@starting-style{ .cg-more-panel:popover-open, .cg-more-panel--embedded{ opacity:0; transform:translateY(8px) scale(.97); } }
.cg-more-panel::backdrop{ background:transparent; }
.cg-more-panel--embedded{ position:absolute; z-index:50; }
@media (prefers-reduced-motion:reduce){
  .cg-more-panel{ transform:none; transition:opacity 120ms ease; }
  @starting-style{ .cg-more-panel:popover-open, .cg-more-panel--embedded{ transform:none; } }
}
/* A partir do breakpoint a barra não existe: o painel também não. */
@media (min-width:768px){ .cg-more-panel--md{ display:none !important; } }
@media (min-width:1024px){ .cg-more-panel--lg{ display:none !important; } }
`;
