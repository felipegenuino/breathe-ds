import { useEffect, useState, type ReactNode } from "react";
import { Accordion } from "../../components/Accordion";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Container } from "../../components/Container";
import { SectionKicker } from "../../components/SectionKicker";
import { PillList } from "../../components/PillList";
import { PageVideoHero } from "../../components/PageVideoHero";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { BottomNav } from "../../components/BottomNav";
import { BreatheMark } from "../../components/BreatheMark";
import { used, IconWind, IconActivity, IconBaby, IconSearch, IconHome, IconBook, IconMessage, IconMapPin, IconGraduationCap, IconVideo, IconUsers, IconArrowUpRight } from "../../components/icons";
import * as Lucide from "lucide-react";

/* ───── paletas (o DS é neutro; a cor vem de cada app) ───── */
const PALETTES: Record<string, Record<string, string>> = {
  Neutro: {
    "--color-surface": "#ffffff", "--color-surface-panel": "#18181b", "--color-ink": "#18181b",
    "--color-ink-soft": "#71717a", "--color-ink-body": "#3f3f46", "--color-action": "#18181b",
    "--color-action-text": "#52525b", "--color-on-action": "#ffffff", "--color-line": "rgb(0 0 0 / 0.12)",
    "--font-heading": "system-ui, sans-serif", "--font-body": "system-ui, sans-serif",
  },
  TTCAB: {
    "--color-surface": "#fbf5e9", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#54707a", "--color-ink-body": "#1e4f5b", "--color-action": "#f6a22a",
    "--color-action-text": "#9a5d07", "--color-on-action": "#144753", "--color-line": "rgb(20 71 83 / 0.16)",
    "--font-heading": "Quicksand, system-ui, sans-serif", "--font-body": "Figtree, system-ui, sans-serif",
  },
  Creeta: {
    "--color-surface": "#eef3f4", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#52707a", "--color-ink-body": "#1e4f5b", "--color-action": "#ab2781",
    "--color-action-text": "#8f1f6c", "--color-on-action": "#ffffff", "--color-line": "rgb(20 71 83 / 0.16)",
    "--font-heading": "Quicksand, system-ui, sans-serif", "--font-body": "Figtree, system-ui, sans-serif",
  },
};

/* ───── ícones do DS (dogfooding a lib de ícones) ───── */
const IcWind = <IconWind size={18} />;
const IcPulse = <IconActivity size={18} />;
const IcBaby = <IconBaby size={18} />;
const IcSearch = <IconSearch size={18} />;
const IcHome = <IconHome size={18} />;
const IcBook = <IconBook size={18} />;
const IcChat = <IconMessage size={18} />;
const IcPin = <IconMapPin size={18} />;
const IcCap = <IconGraduationCap size={18} />;
const IcVideo = <IconVideo size={18} />;
const IcUsers = <IconUsers size={18} />;

function SideNav({ pal, setPal }: { pal: string; setPal: (p: string) => void }) {
  const items = [
    ["symbol", "Símbolo vivo"],
    ["tokens", "Tokens"], ["buttons", "Button"], ["accordion", "Accordion"],
    ["pills", "PillList"], ["header", "Header"], ["hero", "PageVideoHero"],
    ["footer", "Footer"], ["mobile", "Mobile · BottomNav"],
  ];
  return (
    <nav className="sticky top-0 hidden h-screen w-56 flex-none overflow-y-auto border-r border-line p-6 lg:block">
      <p className="mb-1 font-heading text-xl font-bold text-ink">Breathe</p>
      <p className="mb-4 text-sm text-ink-soft">design system · Cuidado Global</p>
      <div className="mb-6">
        <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.1em] text-ink-soft uppercase">Paleta</p>
        <div className="inline-flex rounded-pill border border-line p-0.5">
          {Object.keys(PALETTES).map((name) => (
            <button key={name} type="button" onClick={() => setPal(name)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${pal === name ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>
              {name}
            </button>
          ))}
        </div>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className="block rounded-lg px-3 py-2 font-heading text-sm font-semibold text-ink transition-colors hover:bg-ink/[0.06]">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-line py-[clamp(40px,6vw,72px)]">
      <Container>
        <SectionKicker>{title}</SectionKicker>
        {children}
      </Container>
    </section>
  );
}

const HERO_PILL = "inline-flex items-center gap-2 rounded-pill bg-ink/55 px-4 py-2 font-heading text-sm font-semibold text-surface backdrop-blur-md";
const CHIP = "inline-flex items-center gap-2 rounded-pill bg-ink/[0.06] px-4 py-2 font-heading text-sm font-semibold text-ink";

function Switcher({ pal, setPal }: { pal: string; setPal: (p: string) => void }) {
  return (
    <div className="inline-flex rounded-pill border border-line p-0.5">
      {Object.keys(PALETTES).map((name) => (
        <button key={name} type="button" onClick={() => setPal(name)}
          className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${pal === name ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{name}</button>
      ))}
    </div>
  );
}

type IconComp = (p: { size?: number }) => ReactNode;
const LUCIDE_ALL = (Object.entries(Lucide).filter(
  ([n, v]) => /^[A-Z][A-Za-z0-9]+$/.test(n) && !n.startsWith("Lucide") && !n.endsWith("Icon") && (typeof v === "object" || typeof v === "function") && v != null
) as [string, IconComp][]).sort((a, b) => a[0].localeCompare(b[0]));
const USED_ENTRIES = Object.entries(used) as [string, IconComp][];
const ICON_CAP = 240;

function IconCard({ name, Ic }: { name: string; Ic: IconComp }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line p-3 text-ink" title={name}>
      <Ic size={22} />
      <span className="max-w-full truncate text-[0.62rem] text-ink-soft">{name}</span>
    </div>
  );
}

function IconsSection() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"used" | "all">("used");
  const query = q.trim().toLowerCase();
  const source = query || mode === "all" ? LUCIDE_ALL : USED_ENTRIES;
  const filtered = query ? source.filter(([n]) => n.toLowerCase().includes(query)) : source;
  const shown = filtered.slice(0, ICON_CAP);
  return (
    <div className="grid gap-8 lg:grid-cols-[256px_1fr]">
      {/* coluna 1 — título, busca, filtro */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-4 max-w-[34ch] text-ink-body">A lib do lucide inteira. Busque e use em qualquer interface — os componentes recebem ícones por slot.</p>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft"><IconSearch size={18} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar ícone…"
            className="w-full rounded-pill border border-line bg-surface py-2.5 pr-4 pl-10 text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-offset-2 focus:outline-ink" />
        </div>
        <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Filtro</p>
        <div className="inline-flex rounded-pill border border-line p-0.5">
          {([["used", "Mais usados"], ["all", "Todos"]] as const).map(([m, label]) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${mode === m ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{label}</button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {query ? `${filtered.length} resultado(s)` : mode === "all" ? `${LUCIDE_ALL.length} ícones na lib` : `${USED_ENTRIES.length} principais`}
        </p>
      </div>

      {/* coluna 2 — grade */}
      <div>
        {filtered.length === 0 ? (
          <p className="text-ink-soft">Nenhum ícone encontrado.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-3">
            {shown.map(([name, Ic]) => <IconCard key={name} name={name} Ic={Ic} />)}
          </div>
        )}
        {filtered.length > ICON_CAP && (
          <p className="mt-5 text-sm text-ink-soft">Mostrando {ICON_CAP} de {filtered.length}. Refine a busca pra achar os demais.</p>
        )}
      </div>
    </div>
  );
}

function HeroCTA({ secondary }: { secondary: ReactNode }) {
  // Estrutura do novo.creeta: container escuro + pílula branca + link claro.
  return (
    <div className="inline-flex items-center gap-x-6 rounded-full border border-surface/15 bg-ink/80 py-2 pr-7 pl-2 backdrop-blur-md">
      <a href="#" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 font-body font-semibold text-ink transition hover:-translate-y-px">
        <IconMessage size={18} /> Agendar avaliação
      </a>
      <a href="#" className="inline-flex min-h-11 items-center gap-1.5 font-body font-semibold text-surface underline underline-offset-4">
        {secondary}
      </a>
    </div>
  );
}

export function App() {
  const [pal, setPal] = useState("Neutro");
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(PALETTES[pal]).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [pal]);
  return (
    <div>
      {/* dogfooding: o header do DS É o componente Header do Breathe */}
      <Header
        logo={<span className="flex items-center gap-2 font-heading text-xl font-bold text-ink"><BreatheMark size={30} /> Breathe</span>}
        cta={<Switcher pal={pal} setPal={setPal} />}
        items={[
          { label: "Símbolo", href: "#symbol" },
          { label: "Tokens", href: "#tokens" },
          { label: "Componentes", href: "#buttons", children: [
            { label: "Button", href: "#buttons", icon: IcPulse },
            { label: "Ícones", href: "#icons", icon: IcSearch },
            { label: "Accordion", href: "#accordion", icon: IcBook },
            { label: "PillList", href: "#pills", icon: IcSearch },
            { label: "Header", href: "#header", icon: IcHome },
            { label: "PageVideoHero", href: "#hero", icon: IcVideo },
            { label: "Footer", href: "#footer", icon: IcPin },
          ], seeAll: { label: "Mobile · BottomNav", href: "#mobile" } },
        ]}
      />
      <main className="min-w-0">
        <div className="border-b border-line py-[clamp(48px,7vw,96px)]">
          <Container>
            <div className="mb-4 text-ink"><BreatheMark size={64} /></div>
            <p className="mb-3 font-heading text-[0.82rem] font-bold tracking-[0.14em] text-ink-soft uppercase">Breathe · @cuidado-global/ui</p>
            <h1 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">Playground do design system</h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-[1.6] text-ink-body">Componentes reais renderizados com a paleta <b>{pal}</b>. Troque no topo e tudo retematiza — o Breathe é neutro, a cor vem de cada app.</p>
          </Container>
        </div>

        <Section id="symbol" title="Símbolo vivo">
          <p className="mb-8 max-w-[60ch] text-ink-body">O símbolo do Breathe respira — inspira e expira num pulso suave. Em <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">currentColor</code>, herda o token do contexto. Respeita prefers-reduced-motion.</p>
          <div className="flex flex-wrap items-center gap-10">
            <div className="text-ink"><BreatheMark size={120} /></div>
            <div className="text-action"><BreatheMark size={88} duration={4.5} /></div>
            <div className="rounded-2xl bg-ink p-8 text-surface"><BreatheMark size={88} /></div>
            <div className="text-ink-soft"><BreatheMark size={64} animated={false} /><p className="mt-2 text-xs text-ink-soft">estático</p></div>
          </div>
        </Section>

        <Section id="tokens" title="Tokens">
          <div className="flex flex-wrap gap-3">
            {([["surface", "--color-surface"], ["ink", "--color-ink"], ["ink-soft", "--color-ink-soft"], ["action", "--color-action"], ["line", "--color-line"]] as const).map(([n, k]) => {
              const v = PALETTES[pal][k];
              return (
              <div key={n} className="w-40 overflow-hidden rounded-2xl border border-line">
                <div className="h-14" style={{ background: v }} />
                <div className="p-3"><p className="font-heading text-sm font-bold text-ink">{n}</p><p className="font-mono text-xs text-ink-soft">{v}</p></div>
              </div>
              );
            })}
          </div>
        </Section>

        <Section id="buttons" title="Button">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid">Falar com a equipe</Button>
            <Button variant="accent">Encontre um profissional</Button>
            <Button variant="outline">Conheça o tratamento</Button>
            <Button variant="ghost">Ver todos</Button>
            <Button variant="accent" size="sm">Pequeno</Button>
            <Button variant="solid" size="lg">Grande</Button>
          </div>
        </Section>

        <Section id="icons" title="Ícones">
          <IconsSection />
        </Section>

        <Section id="accordion" title="Accordion">
          <div className="max-w-[760px]">
            <Accordion items={[
              { id: "a", title: "O que o fisioterapeuta avalia", content: <ul className="space-y-2 text-ink-body"><li>Ausculta pulmonar e sinais vitais</li><li>Padrão de respiração</li><li>Qualidade da movimentação global</li></ul> },
              { id: "b", title: "O que pode mudar a forma de respirar", content: <p className="m-0 text-ink-body">Hábitos, posturas e bloqueios que o corpo cria em resposta ao distúrbio respiratório.</p> },
              { id: "c", title: "A técnica, em detalhe", content: <p className="m-0 text-ink-body">Manuseios específicos por faixa etária para reorganizar sinergias e melhorar a função respiratória.</p> },
            ]} />
          </div>
        </Section>

        <Section id="pills" title="PillList">
          <PillList title="Condições que atendemos" seeAll={{ label: "Ver todos os tratamentos", href: "#" }}
            items={["Asma e bronquiolite", "DPOC", "Torcicolo congênito", "Dor crônica", "Assimetrias cranianas e corporais", "Ronco e apneia do sono", "Enxaqueca, cefaleia e ATM"].map((label) => ({ label, href: "#" }))} />
        </Section>

        <Section id="header" title="Header (nav + dropdown)">
          <div className="overflow-hidden rounded-2xl border border-line">
            <Header
              logo={<span className="font-heading text-xl font-bold text-ink">TTCAB</span>}
              cta={<Button variant="accent" size="sm">WhatsApp</Button>}
              localeSwitcher={<span className={CHIP}>{IcPin} PT</span>}
              items={[
                { label: "Início", href: "#", active: true },
                { label: "Tratamento", href: "#", children: [
                  { label: "O que é o TTCAB", href: "#", icon: IcWind },
                  { label: "Idealizadora", href: "#", icon: IcUsers },
                  { label: "Como saber", href: "#", icon: IcSearch },
                ], seeAll: { label: "Ir para o Tratamento", href: "#" } },
                { label: "Para famílias", href: "#" },
                { label: "Profissionais", href: "#" },
                { label: "Depoimentos", href: "#" },
                { label: "Artigos", href: "#" },
              ]}
            />
            <div className="p-6 text-sm text-ink-soft">Passe o mouse em "Tratamento" para o dropdown.</div>
          </div>
        </Section>

        <section id="hero" className="scroll-mt-24 border-b border-line py-[clamp(40px,6vw,72px)]">
          <Container>
            <SectionKicker>PageVideoHero <span className="font-heading text-base font-semibold text-ink-soft">— largura real (full-bleed)</span></SectionKicker>
          </Container>
          <div className="space-y-5">
            {/* versão home — painel + CTA fiel ao creeta (pílula branca com 2 itens) */}
            <PageVideoHero
              videoId="h3a7DHFd6L4"
              topLeft={<span className={HERO_PILL}><IconMapPin size={16} /> Fisioterapia em Florianópolis</span>}
              panel={{
                kicker: "O único centro de tratamento baseado no Método RTA",
                title: <>Respirar melhor.<br />Viver com mais liberdade.</>,
                lead: "Tratamento especializado para condições respiratórias, dor e assimetrias corporais, em todas as fases da vida.",
              }}
              actions={<HeroCTA secondary="Ver o que tratamos" />}
            />
            {/* versão clínica — local + painel + CTA (Agendar + Como chegar) */}
            <PageVideoHero
              videoId="h3a7DHFd6L4"
              topLeft={<span className={HERO_PILL}><IconMapPin size={16} /> Córrego Grande, Florianópolis</span>}
              panel={{ kicker: "A clínica", title: <>Uma clínica feita para acolher de verdade.</> }}
              actions={<HeroCTA secondary={<>Como chegar <IconArrowUpRight size={15} /></>} />}
            />
          </div>
        </section>

        <Section id="footer" title="Footer">
          <Footer
            logo={<span className="font-heading text-xl font-bold text-ink">TTCAB</span>}
            tagline="Tratamento do Torcicolo Congênito e outras Assimetrias no Bebê"
            columns={[{ title: "Navegação", items: ["Início", "Para famílias", "Depoimentos"].map((l) => <a key={l} href="#" className="hover:text-ink-soft">{l}</a>) },
                      { title: "", items: ["Tratamento", "Profissionais", "Artigos"].map((l) => <a key={l} href="#" className="hover:text-ink-soft">{l}</a>) }]}
            contact={{ title: "Contato", lines: ["Rua João Mathias Cordeiro, 33", "Córrego Grande, Florianópolis — SC"], actions: <a href="#" className="inline-flex items-center gap-1 font-semibold text-ink underline underline-offset-4">Ver no Google Maps ↗</a> }}
            legal={<>© 2026 TTCAB · Todos os direitos reservados.</>}
            chips={[<span className={CHIP}>{IcChat} WhatsApp</span>, <span className={CHIP}>48 3234.9919</span>, <span className={CHIP}>E-mail</span>]}
          />
        </Section>

        <Section id="mobile" title="Mobile · BottomNav">
          <p className="max-w-[60ch] text-ink-body">Estreite a janela (abaixo de ~1024px) para ver o <b>BottomNav</b> flutuante aparecer no rodapé e o header mobile. Toque em "Mais" para o painel.</p>
        </Section>

        <div className="h-24" />
      </main>

      <BottomNav
        items={[
          { label: "Início", href: "#", icon: IcHome, active: true },
          { label: "Tratamentos", href: "#", icon: IcWind },
          { label: "Método", href: "#", icon: IcPulse },
          { label: "Clínica", href: "#", icon: IcPin },
          { label: "Equipe", href: "#", icon: IcUsers },
          { label: "Vídeos", href: "#", icon: IcVideo },
        ]}
        more={{ items: [
          { label: "Orientações", href: "#", icon: IcBook },
          { label: "Contato", href: "#", icon: IcChat },
          { label: "Estrutura", href: "#", icon: IcBaby },
          { label: "Cursos para fisioterapeutas", href: "#", icon: IcCap, description: "metodorta.com.br", external: true },
        ] }}
      />
    </div>
  );
}
