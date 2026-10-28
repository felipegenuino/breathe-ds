# @cuidado-global/ui

Design system da **família Cuidado Global** (ecossistema RTA / Mariangela:
creeta, ttcab, metodorta…). Os sites **herdam** este pacote e aplicam a
própria paleta sobre o mesmo contrato.

> **v0.1 — tokens-first.** Só a camada de tokens. Os primitivos (Button,
> PageHero/PageVideoHero, SectionKicker, Container, nav flutuante + dropdown,
> Card) entram nas próximas versões.

## Ideia

Os sites da família **não compartilham paleta** (ttcab é petróleo/creme,
creeta é petróleo/névoa/magenta). O que se compartilha são os **papéis de
token** — `surface`, `ink`, `action`, `line`… — com nomes e estrutura iguais.
Cada site define os valores (`--cg-*`) da sua paleta.

Token nunca é "a cor X": é **papel + contraste medido**. (O Felipe é daltônico;
decisão de cor sempre por papel e contraste, nunca a olho.)

## Uso (Tailwind v4)

No `globals.css` do site:

```css
@import "tailwindcss";
@import "@cuidado-global/ui/theme.css";
@import "@cuidado-global/ui/tokens/ttcab.css";   /* ou defina os --cg-* inline */
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

## Roadmap

- [x] v0.1 — tokens (preset + paletas ttcab/creeta) + preview
- [x] Accordion (1º componente; padrão de deps injetáveis)
- [x] Tipografia da família (Quicksand + Figtree, só livres)
- [ ] **Escala tipográfica** a partir do novo.creeta (guia aprovado pelo Felipe)
- [ ] **Ícones**: empacotar o conjunto do lucide usado pela família, para os
      componentes importarem/injetarem (sem cada site depender do lucide direto)
- [ ] **MediaCard** (vídeo/imagem atrás + badge de ícone + título + lead + seta;
      variante **carrossel horizontal no mobile** com barra de progresso + pause) — aprovado
- [ ] **PillList** (chips tipo "Condições que atendemos": rótulo + seta, grade que quebra, link "Ver todos") — aprovado
- [ ] **Footer** (aprovado) · **PageVideoHero** (hero full-bleed) · **Header** (dropdown)
- [ ] Primitivos: Button, Container, SectionKicker, Card
- [ ] Migrar ttcab e creeta para consumir o pacote + `npm publish`
