# Breathe

**Breathe** — o design system da **família Cuidado Global** (ecossistema RTA / Mariangela:
creeta, ttcab, metodorta…). Os sites **herdam** este pacote e aplicam a
própria paleta sobre o mesmo contrato.

> Pacote npm: `@breathe-ds/ui` (endereço técnico). **Breathe** é o nome do sistema.

> **v0.1** — tokens + componentes (ver `components/`) + marcas dos sites.
> Confira tudo renderizado no playground (abaixo).

## Ideia

Os sites da família **não compartilham paleta** (ttcab é petróleo/creme,
creeta é petróleo/névoa/magenta). O que se compartilha são os **papéis de
token** — `surface`, `ink`, `action`, `line`… — com nomes e estrutura iguais.
Cada site define os valores (`--cg-*`) da sua paleta.

Token nunca é "a cor X": é **papel + contraste medido**. (O Felipe é daltônico;
decisão de cor sempre por papel e contraste, nunca a olho.)

## Instalar

```bash
npm i @breathe-ds/ui
```

Pacote público no npm: https://www.npmjs.com/package/@breathe-ds/ui · código em
https://github.com/felipegenuino/breathe-ds (licença MIT). Os componentes são TSX fonte (sem
build): no Next, adicione `transpilePackages: ["@breathe-ds/ui"]` ao `next.config`.

## Uso (Tailwind v4)

No `globals.css` do site:

```css
@import "tailwindcss";
@import "@breathe-ds/ui/theme.css";
@import "@breathe-ds/ui/tokens/ttcab.css";   /* ou defina os --cg-* inline */
```

Depois, as utilitárias do Tailwind usam os papéis: `bg-surface`, `text-ink`,
`border-line`, `bg-action`, `text-action-text`, `rounded-2xl`, etc.

Para um site sem arquivo de tokens pronto, defina os papéis no próprio `:root`:

```css
:root {
  --cg-surface: #fbf5e9;
  --cg-ink: #144753;
  /* … ver tokens/ttcab.css para a lista completa */
}
```

## Papéis de token

| Token (Tailwind) | Papel | `--cg-*` |
|---|---|---|
| `surface` | fundo base | `--cg-surface` |
| `surface-panel` | painel escuro (footer, CTA final) | `--cg-surface-panel` |
| `ink` | texto principal / títulos | `--cg-ink` |
| `ink-soft` | texto secundário | `--cg-ink-soft` |
| `ink-body` | corpo de leitura | `--cg-ink-body` |
| `action` | CTA / destaque — **nunca texto puro** | `--cg-action` |
| `action-text` | texto na cor de ação (AA) | `--cg-action-text` |
| `line` | hairlines / bordas | `--cg-line` |
| `font-heading` / `font-body` | tipografia | `--cg-font-*` |
| `radius-xl/2xl/pill` · `ease-cg` | raio e curva de motion | fixos |

## Contrastes medidos — TTCAB (`tokens/ttcab.css`)

Valores pela fórmula WCAG padrão (os mesmos que o `preview/` calcula ao vivo):

| Par | Contraste | Nível |
|---|---|---|
| surface `#fbf5e9` / ink `#144753` | 9,41:1 | AAA |
| surface `#fbf5e9` / ink-soft `#54707a` | 4,86:1 | AA |
| surface `#fbf5e9` / ink-body `#1e4f5b` | 8,32:1 | AAA |
| surface `#fbf5e9` / action-text `#9a5d07` | 4,90:1 | AA |
| surface-panel `#144753` / texto creme | 9,41:1 | AAA |

`action` `#f6a22a` é decorativo/CTA — não usar como texto sobre creme.

## Tipografia da família

Decisão (28/10/2026): **só fontes open-source** — nada de licenciadas (Gotham saiu).

| Papel | Fonte | Observação |
|---|---|---|
| `font-heading` | **Quicksand** | títulos, toda a família (Google Fonts) |
| `font-body` | **Figtree** | corpo, toda a família (Google Fonts) |

**Hierarquia/escala tipográfica:** usar a do **novo.creeta** como guia (bem trabalhada
e refinada). _A extrair para tokens de tamanho/peso/entrelinha._

## Primeiros consumidores

**ttcab** e **creeta**. A paleta do creeta em `tokens/creeta.css` está
ilustrativa (marcada `[conferir]`) — fecha ao migrar o creeta.

## O que muda por tema (e o que é fixo)

**Muda por tema:** apenas **cores** e **grafismos** (ThreadRail, OrganicFrame,
marca d'água…). Cada site/marca da família tem a sua cor e os seus grafismos.

**Fixo em toda a família:** **tipografia** (Quicksand nos títulos + Figtree no
corpo, em qualquer tema — inclusive o Neutro) e os **ícones** (lucide). Botões
usam a fonte de corpo semibold (o 600 da Quicksand rende leve demais).

## Decisão — estilo de card

Linguagem de card do DS: **bordas discretas + sombra discreta** (referência: "Famílias
 contam" do novo.creeta). Nada de borda forte ou sombra pesada. _A virar tokens `--shadow-card` + `--border`._

## Decisão — estilo de card

Linguagem de card do DS: **bordas discretas + sombra discreta** (referência: "Famílias contam" do novo.creeta). Nada de borda forte ou sombra pesada. _A virar tokens `--shadow-card` + `--border`._

## Decisão — largura de hero

Heros **mais largos / full-bleed**, na proporção do **novo.creeta** (mais imersivos, menos
margem lateral). Vale para `PageVideoHero` e `PageHero`. O hero atual do ttcab é mais contido
— alargar para o padrão creeta ao migrar. _Vira token/escala de largura de hero._

## Marcas dos sites (`components/marks/`)

Cada site da família tem o símbolo e o wordmark reais, copiados dos arquivos de
marca (`public/brand`) dos repositórios, separados em dois componentes para a
`Cortina` e o `Lockup` montarem os arranjos:

| Site | Símbolo | Wordmark | Import |
|---|---|---|---|
| TTCAB | `TtcabSymbol` (mãe + bebê, laranja `#F6A22A`) | `TtcabWordmark` (caixa-alta, `currentColor`) | `@breathe-ds/ui/components/marks/ttcab` |
| Creeta | `CreetaSymbol` (três ondas + ponto, cores da marca) | `CreetaWordmark` (minúsculas, `currentColor`) | `@breathe-ds/ui/components/marks/creeta` |

```tsx
<Cortina logo={<TtcabSymbol />} name={<TtcabWordmark />} wordmarkRatio={TTCAB_LOCKUP.wordmarkPerSymbol} tagline="…" />
<Lockup variant="horizontal" size="md" logo={<CreetaSymbol />} wordmark={<CreetaWordmark />} wordmarkRatio={CREETA_LOCKUP.wordmarkPerSymbol} name="creeta" />
```

**Proporção vem do manual, não do olho.** Cada arquivo de marca exporta
`*_LOCKUP.wordmarkPerSymbol` (altura do wordmark ÷ altura do símbolo no
logotipo horizontal: TTCAB 0,557 · creeta 0,469) e `symbolSide` (no TTCAB o
símbolo fica à **direita** do nome; no creeta e nos demais, à esquerda). O `Lockup` e a `Cortina`
passam isso ao svg pela variável `--cg-wordmark`; o símbolo injetado recebe a
altura do tamanho (`size`). Medido nos sites (29/10/2026): no header dos dois o
símbolo tem **44px** de altura — é o `size="md"` do Lockup. O símbolo aceita
`color` para versão monocromática (branco sobre painel escuro). O desenho não se
edita à mão: é o do manual de cada marca.

`Lockup` com `entrance` (e `entranceDelay` em ms) faz a entrada do header do
novo.creeta: símbolo, depois o nome, depois a tagline; com movimento reduzido vira
um fade curto.

## Navegação

- **Header**: marca (o app passa o link para a home) · itens · item com dropdown
  (ícones nos subitens; link final com seta → ou ↗ se `external`) · idioma · CTA.
  Padrão dos sites: "Início" é só a casa (`icon` + `iconOnly`), rótulo para
  leitor de tela.
- **BottomNav**: no celular/tablet a navegação sai do header e vira a barra
  flutuante inferior. É o código da BarraNavegacao do novo.creeta (= BottomNav
  do ttcab), neutro por tokens: recebe TODAS as páginas em ordem de importância
  (`pages`, com o `Icon` lucide) e mostra quantas couberem (64px por aba,
  ResizeObserver); o resto e as saídas externas (`extras`, com o domínio escrito
  e seta ↗) vão para o painel "Mais", um popover nativo (Esc, toque fora, sem
  JS). Véu de gradiente atrás da barra. `hideFrom` = `md` (creeta) ou `lg`
  (ttcab). `labels` para outro idioma. `embedded` para a moldura da demo.
- **AnchorNav**: cápsula flutuante de âncoras da página (scroll-spy + indicador
  deslizante), extraída do TreatmentAnchorNav do ttcab. As seções-alvo precisam
  de `scroll-mt-*` compatível com o sticky.

## Playground (ver os componentes)

`cd playground && npm install && npm run dev` → kitchen-sink em http://localhost:5177 com os componentes reais renderizados (paleta ttcab).

## Roadmap

- [x] v0.1 — tokens (preset + paletas ttcab/creeta) + preview
- [x] Accordion (1º componente; padrão de deps injetáveis)
- [x] Tipografia da família (Quicksand + Figtree, só livres)
- [ ] **Escalas do novo.creeta** (referência total, aprovado): **tipografia** (tamanhos/pesos/entrelinha)
      **+ espaçamento/ritmo** (padding de seção, gaps) **+ border-radius padrão** → viram tokens do DS
- [ ] **Ícones**: empacotar o conjunto do lucide usado pela família, para os
      componentes importarem/injetarem (sem cada site depender do lucide direto)
- [ ] **MediaCard** (vídeo/imagem atrás + badge de ícone + título + lead + seta;
      variante **carrossel horizontal no mobile** com barra de progresso + pause) — aprovado
- [ ] **TestimonialCard** (depoimento) — aprovado. Variantes: **citação** (card de texto),
      **vídeo hero** (full-bleed com citação sobreposta), **vídeo ao lado** ("Famílias contam": vídeo + texto).
      Avaliar um **mix** das duas. **Já existe no ttcab** (TestimonialVideoHero/Card) → extrair/generalizar.
- [ ] **VideoStoryCard** (vídeo curto, vertical) — aprovado. Play + badge de duração +
      título + lead + **"Ler a transcrição"** (colapso, reusa o Accordion). Padrão da página de Vídeos.
      _Nota: o card ainda pode melhorar num update futuro (ok deixar pra depois)._
- [ ] **ProfessionalCard** (equipe) — aprovado. Duas versões: **small** (foto + nome, fila/linha)
      e **big** (foto + nome + função + CREFITO + accordions "Trajetória"/"Orientações").
      Variante com **vídeo**: badge "Apresentação", hover anima o vídeo, e **modal** (vídeo + bio).
      **Regra de dado:** todo profissional PRECISA ter **CREFITO** vinculado (exigência COFFITO).
- [x] **PillList** (chips tipo "Condições que atendemos": rótulo + seta, grade que quebra, link "Ver todos")
- [x] **AnchorNav** (cápsula flutuante de âncoras, scroll-spy + indicador deslizante) — extraída do ttcab (29/10)
- [x] **Footer** · **PageVideoHero** (loop e player) · **Header** (dropdown, casa) · **BottomNav** · **Cortina** · **Lockup** (5 arranjos) · **BreatheMark**
- [x] **Marcas dos sites** (`components/marks/`): símbolo + wordmark reais do TTCAB e do Creeta (29/10)
- [ ] **ThreadRail** (grafismo lateral — fio que desce pela esquerda ligando seções) — aprovado,
      **já existe no ttcab** → extrair.
- [ ] **OrganicFrame** (recorte de imagem orgânico, tipo blob) — registrado como **OPÇÃO**
      (não default pra todos os sites). **Já existe no ttcab** → extrair como variante opcional.
- [x] Primitivos: Button (com variant link), Container, SectionKicker, Card
- [ ] Migrar ttcab e creeta para consumir o pacote + `npm publish`
