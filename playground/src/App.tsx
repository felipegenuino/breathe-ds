import type { ReactNode } from "react";
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

/* ───── ícones inline (só pro demo) ───── */
const I = (p: ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{p}</svg>
);
const IcWind = I(<><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h7a2.5 2.5 0 1 1-2 4" /></>);
const IcPulse = I(<path d="M3 12h4l2 6 4-14 2 8h6" />);
const IcBaby = I(<><circle cx="12" cy="7" r="3" /><path d="M6 21v-3a6 6 0 0 1 12 0v3" /></>);
const IcSearch = I(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
const IcHome = I(<><path d="M3 10l9-7 9 7" /><path d="M5 9v11h14V9" /></>);
const IcBook = I(<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2z" />);
const IcChat = I(<path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />);
const IcPin = I(<><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
const IcCap = I(<><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></>);
const IcVideo = I(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3z" /></>);
const IcUsers = I(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M17 8a3 3 0 0 1 0 6" /></>);

function SideNav() {
  const items = [
    ["tokens", "Tokens"], ["buttons", "Button"], ["accordion", "Accordion"],
    ["pills", "PillList"], ["header", "Header"], ["hero", "PageVideoHero"],
    ["footer", "Footer"], ["mobile", "Mobile · BottomNav"],
  ];
  return (
    <nav className="sticky top-0 hidden h-screen w-56 flex-none overflow-y-auto border-r border-line p-6 lg:block">
      <p className="mb-1 font-heading text-xl font-bold text-ink">Breathe</p>
      <p className="mb-6 text-sm text-ink-soft">design system · Cuidado Global</p>
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
    <section id={id} className="scroll-mt-6 border-b border-line py-[clamp(40px,6vw,72px)]">
      <Container>
        <SectionKicker>{title}</SectionKicker>
        {children}
      </Container>
    </section>
  );
}

const CHIP = "inline-flex items-center gap-2 rounded-pill bg-ink/[0.06] px-4 py-2 font-heading text-sm font-semibold text-ink";

export function App() {
  return (
    <div className="flex">
      <SideNav />
      <main className="min-w-0 flex-1">
        <div className="border-b border-line py-[clamp(48px,7vw,96px)]">
          <Container>
            <p className="mb-3 font-heading text-[0.82rem] font-bold tracking-[0.14em] text-ink-soft uppercase">Breathe · @cuidado-global/ui</p>
            <h1 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">Playground do design system</h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-[1.6] text-ink-body">Componentes reais renderizados com a paleta ttcab. Troque os tokens e tudo retematiza.</p>
          </Container>
        </div>

        <Section id="tokens" title="Tokens">
          <div className="flex flex-wrap gap-3">
            {[["surface", "#fbf5e9"], ["ink", "#144753"], ["ink-soft", "#54707a"], ["action", "#f6a22a"], ["line", "rgb(20 71 83 / .16)"]].map(([n, v]) => (
              <div key={n} className="w-40 overflow-hidden rounded-2xl border border-line">
                <div className="h-14" style={{ background: v }} />
                <div className="p-3"><p className="font-heading text-sm font-bold text-ink">{n}</p><p className="font-mono text-xs text-ink-soft">{v}</p></div>
              </div>
            ))}
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

        <Section id="hero" title="PageVideoHero">
          <PageVideoHero
            videoId="h3a7DHFd6L4"
            kicker="O único centro baseado no Método RTA"
            title={<>Respirar melhor.<br />Viver com mais liberdade.</>}
            lead="Tratamento especializado para condições respiratórias, dor e assimetrias corporais, em todas as fases da vida."
            locationLabel={<>{IcPin} Fisioterapia em Florianópolis</>}
            actions={<><Button variant="solid" size="sm">Agendar avaliação</Button><Button variant="outline" size="sm" className="!bg-surface">Ver o que tratamos</Button></>}
          />
        </Section>

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
