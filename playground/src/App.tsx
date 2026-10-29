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
import { AnchorNav } from "../../components/AnchorNav";
import { BottomNav } from "../../components/BottomNav";
import { BreatheMark } from "../../components/BreatheMark";
import { Curtain } from "../../components/Curtain";
import { Lockup, type LockupVariant } from "../../components/Lockup";
import { TtcabSymbol, TtcabWordmark, TTCAB_LOCKUP } from "../../components/marks/ttcab";
import { CreetaSymbol, CreetaWordmark, CREETA_LOCKUP } from "../../components/marks/creeta";
import { used, IconWind, IconActivity, IconBaby, IconSearch, IconHome, IconBook, IconMessage, IconMapPin, IconGraduationCap, IconVideo, IconUsers, IconArrowUpRight, IconPhone, IconMail, IconInstagram } from "../../components/icons";
import * as Lucide from "lucide-react";

/* ───── palettes (the DS is neutral; color comes from each app) ───── */
const PALETTES: Record<string, Record<string, string>> = {
  Neutral: {
    "--color-surface": "#ffffff", "--color-surface-panel": "#18181b", "--color-ink": "#18181b",
    "--color-ink-soft": "#71717a", "--color-ink-body": "#3f3f46", "--color-action": "#18181b",
    "--color-action-text": "#52525b", "--color-on-action": "#ffffff", "--color-line": "rgb(0 0 0 / 0.12)",
  },
  TTCAB: {
    "--color-surface": "#fbf5e9", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#54707a", "--color-ink-body": "#1e4f5b", "--color-action": "#f6a22a",
    "--color-action-text": "#9a5d07", "--color-on-action": "#144753", "--color-line": "rgb(20 71 83 / 0.16)",
  },
  Creeta: {
    "--color-surface": "#eef3f4", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#52707a", "--color-ink-body": "#1e4f5b", "--color-action": "#ab2781",
    "--color-action-text": "#8f1f6c", "--color-on-action": "#ffffff", "--color-line": "rgb(20 71 83 / 0.16)",
  },
};

/* ───── DS icons (dogfooding the icon lib) ───── */
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
    ["symbol", "Living symbol"],
    ["tokens", "Tokens"], ["buttons", "Button"], ["accordion", "Accordion"],
    ["pills", "PillList"], ["header", "Header"], ["hero", "PageVideoHero"],
    ["footer", "Footer"], ["mobile", "Mobile · BottomNav"],
  ];
  return (
    <nav className="sticky top-0 hidden h-screen w-56 flex-none overflow-y-auto border-r border-line p-6 lg:block">
      <p className="mb-1 font-heading text-xl font-bold text-ink">Breathe</p>
      <p className="mb-4 text-sm text-ink-soft">design system · Cuidado Global</p>
      <div className="mb-6">
        <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.1em] text-ink-soft uppercase">Palette</p>
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
      {/* column 1 — title, search, filter */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-4 max-w-[34ch] text-ink-body">The whole lucide lib. Search and use in any interface — components take icons through slots.</p>
        <div className="relative mb-5">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft"><IconSearch size={18} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icon…"
            className="w-full rounded-pill border border-line bg-surface py-2.5 pr-4 pl-10 text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-offset-2 focus:outline-ink" />
        </div>
        <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Filter</p>
        <div className="inline-flex rounded-pill border border-line p-0.5">
          {([["used", "Most used"], ["all", "All"]] as const).map(([m, label]) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${mode === m ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{label}</button>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          {query ? `${filtered.length} result(s)` : mode === "all" ? `${LUCIDE_ALL.length} icons in the lib` : `${USED_ENTRIES.length} main ones`}
        </p>
      </div>

      {/* column 2 — grid */}
      <div>
        {filtered.length === 0 ? (
          <p className="text-ink-soft">No icon found.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-3">
            {shown.map(([name, Ic]) => <IconCard key={name} name={name} Ic={Ic} />)}
          </div>
        )}
        {filtered.length > ICON_CAP && (
          <p className="mt-5 text-sm text-ink-soft">Showing {ICON_CAP} of {filtered.length}. Refine the search to find the rest.</p>
        )}
      </div>
    </div>
  );
}

function HeroCTA({ primary = "Primary action", secondary }: { primary?: ReactNode; secondary: ReactNode }) {
  // Structure from novo.creeta: dark container + white pill + light link (with icon on the side).
  return (
    <div className="inline-flex items-center gap-x-6 rounded-full border border-surface/15 bg-ink/80 py-2 pr-7 pl-2 backdrop-blur-md">
      <a href="#hero" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 font-body font-semibold text-ink transition hover:-translate-y-px">
        <IconMessage size={18} /> {primary}
      </a>
      <Button href="#hero" variant="link" className="min-h-11 text-surface">{secondary} <IconArrowUpRight size={16} /></Button>
    </div>
  );
}

function PillToggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => set(!on)} aria-pressed={on}
      className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${on ? "border-ink bg-ink text-surface" : "border-line text-ink-soft hover:text-ink"}`}>
      {label}
    </button>
  );
}

function SegGroup<T extends string>({ label, value, set, options }: { label: string; value: T; set: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      <div className="inline-flex rounded-pill border border-line p-0.5">
        {options.map(([v, l]) => (
          <button key={v} type="button" onClick={() => set(v)}
            className={`rounded-pill px-3 py-1 text-xs font-semibold transition-colors ${value === v ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// Loop = local clip of asymmetries (landscape). Player = the YouTube video itself playing muted, looping (16:9, covers the card, no crop).
const PREVIEW_LOOP = { src: "/demo/clip.mp4", poster: "/demo/clip-poster.jpg" };

function HeroDemo() {
  const [kind, setKind] = useState<"player" | "loop">("player");
  const [showLocation, setShowLocation] = useState(true);
  const [content, setContent] = useState<"panel" | "caption" | "none">("panel");
  const [action, setAction] = useState<"watch" | "cta" | "none">("watch");
  const [kicker, setKicker] = useState(true);
  const [lead, setLead] = useState(true);

  // In loop mode there is no player: the "watch" action does not apply.
  const effectiveAction = kind === "loop" && action === "watch" ? "cta" : action;
  const actionOptions: ["watch" | "cta" | "none", string][] =
    kind === "player"
      ? [["watch", "Watch"], ["cta", "CTA"], ["none", "None"]]
      : [["cta", "CTA"], ["none", "None"]];

  const video =
    kind === "player"
      ? { mode: "player" as const, youtubeId: "h3a7DHFd6L4", playerCaption: "Mariangela Pinheiro de Lima, criadora do método, explica o Reequilíbrio Toracoabdominal." }
      : { mode: "loop" as const, preview: PREVIEW_LOOP };

  const actions =
    effectiveAction === "cta" ? <HeroCTA primary="Primary action" secondary="Secondary action" />
      : effectiveAction === "none" ? null
        : undefined;

  return (
    <>
      {/* hero element selector */}
      <Container>
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Elements</span>
          <SegGroup label="Type" value={kind} set={setKind} options={[["player", "Player"], ["loop", "Loop"]]} />
          <PillToggle label="Location" on={showLocation} set={setShowLocation} />
          <SegGroup label="Content" value={content} set={setContent} options={[["panel", "Panel"], ["caption", "Caption"], ["none", "None"]]} />
          <SegGroup label="Action" value={effectiveAction} set={setAction} options={actionOptions} />
          {content === "panel" && (<><PillToggle label="Kicker" on={kicker} set={setKicker} /><PillToggle label="Lead" on={lead} set={setLead} /></>)}
        </div>
      </Container>
      <PageVideoHero
        video={video}
        videoTitle="Demo video"
        topLeft={showLocation ? <span className={HERO_PILL}><IconMapPin size={16} /> Location · City</span> : undefined}
        panel={content === "panel" ? { kicker: kicker ? "Hero kicker" : undefined, title: <>Hero title<br />on two lines.</>, lead: lead ? "A short supporting paragraph that sums up the offer in one or two sentences." : undefined } : undefined}
        caption={content === "caption" ? "Short video caption." : undefined}
        actions={actions}
        watch={{ label: "Watch the video", meta: "With sound, 2 min 45 s" }}
      />
    </>
  );
}

/* Brand for each palette: Breathe is neutral; TTCAB and Creeta bring the real
   symbol and wordmark from the sites (components/marks). The wordmark height
   comes from each brand manual's ratio (wordmarkRatio), not an eyeballed value. */
const BRAND_BY_PALETTE: Record<string, { name: string; tagline: string; logo?: ReactNode; wordmark?: ReactNode; wordmarkRatio?: number; symbolSide?: "left" | "right" }> = {
  Neutral: { name: "Breathe", tagline: "Design system of the Cuidado Global family" },
  TTCAB: {
    name: "TTCAB",
    tagline: "Torcicolo Congênito e Assimetrias do Bebê",
    logo: <TtcabSymbol size={60} />,
    wordmark: <TtcabWordmark />,
    wordmarkRatio: TTCAB_LOCKUP.wordmarkPerSymbol,
    symbolSide: TTCAB_LOCKUP.symbolSide,
  },
  Creeta: {
    name: "creeta",
    tagline: "Centro de Reequilíbrio Toracoabdominal",
    logo: <CreetaSymbol size={60} />,
    wordmark: <CreetaWordmark />,
    wordmarkRatio: CREETA_LOCKUP.wordmarkPerSymbol,
    symbolSide: CREETA_LOCKUP.symbolSide,
  },
};

/* Real playground navigation (same as the header): on phones it becomes the
   actual BottomNav at the bottom of the window. The visible section is marked
   by scroll-spy; the bar shows as many as fit and the rest goes to "More". */
const PAGE_NAV = [
  { id: "symbol", label: "Symbol", Icon: IconWind },
  { id: "tokens", label: "Tokens", Icon: IconActivity },
  { id: "lockup", label: "Lockup", Icon: IconHome },
  { id: "buttons", label: "Button", Icon: IconActivity },
  { id: "icons", label: "Icons", Icon: IconSearch },
  { id: "accordion", label: "Accordion", Icon: IconBook },
  { id: "pills", label: "PillList", Icon: IconSearch },
  { id: "header", label: "Header", Icon: IconHome },
  { id: "mobile", label: "Mobile", Icon: IconMapPin },
  { id: "anchornav", label: "AnchorNav", Icon: IconMapPin },
  { id: "hero", label: "Hero", Icon: IconVideo },
  { id: "footer", label: "Footer", Icon: IconMessage },
] as const;

function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis.length) setActive(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function App() {
  const [pal, setPal] = useState("Neutral");
  const activeSection = useScrollSpy(PAGE_NAV.map((p) => p.id));
  const [curtainKey, setCurtainKey] = useState(0);
  // Mobile demo frame: phone (390) is the minimum; tablet (768) still shows the BottomNav (hidden only at lg+).
  const [mobW, setMobW] = useState<"phone" | "tablet">("phone");
  // optional parts of the page footer (the footer is its own demo)
  const [ft, setFt] = useState({ quote: true, hours: true, directions: true, notice: true, contacts: true, languages: false, credits: true });
  const brand = BRAND_BY_PALETTE[pal] ?? BRAND_BY_PALETTE.Neutral;
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(PALETTES[pal]).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [pal]);
  return (
    <div id="top">
      <Curtain key={curtainKey} name={brand.wordmark ?? brand.name} tagline={brand.tagline} logo={brand.logo} wordmarkRatio={brand.wordmarkRatio} symbolSide={brand.symbolSide} />
      {/* dogfooding: the DS header IS Breathe's Header component, with the
          same rules as the demo — brand at size md (44px symbol) with an
          animated entrance after the curtain, home icon as "Home" (back to top). */}
      <Header
        logo={
          <a href="#top" aria-label="Breathe, top of page" className="inline-flex rounded-xl transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink">
            <Lockup key={curtainKey} entrance entranceDelay={2700} variant="horizontal" size="md" name="Breathe" />
          </a>
        }
        cta={<Switcher pal={pal} setPal={setPal} />}
        items={[
          { label: "Home", href: "#top", icon: <IconHome size={18} strokeWidth={1.75} />, iconOnly: true },
          { label: "Symbol", href: "#symbol" },
          { label: "Tokens", href: "#tokens" },
          { label: "Components", href: "#buttons", children: [
            { label: "Lockup (logo)", href: "#lockup", icon: IcHome },
            { label: "Button", href: "#buttons", icon: IcPulse },
            { label: "Icons", href: "#icons", icon: IcSearch },
            { label: "Accordion", href: "#accordion", icon: IcBook },
            { label: "PillList", href: "#pills", icon: IcSearch },
            { label: "Header", href: "#header", icon: IcHome },
            { label: "Mobile · BottomNav", href: "#mobile", icon: IcHome },
            { label: "AnchorNav", href: "#anchornav", icon: IcPin },
            { label: "PageVideoHero", href: "#hero", icon: IcVideo },
            { label: "Footer", href: "#footer", icon: IcPin },
          ], seeAll: { label: "Mobile · BottomNav", href: "#mobile" } },
        ]}
      />
      <main className="min-w-0">
        <div className="border-b border-line py-[clamp(48px,7vw,96px)]">
          <Container>
            <div className="mb-4 text-ink"><BreatheMark size={44} /></div>
            <p className="mb-3 font-heading text-[0.82rem] font-bold tracking-[0.14em] text-ink-soft uppercase">Breathe · @breathe-ds/ui</p>
            <h1 className="font-heading text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-ink">Design system playground</h1>
            <p className="mt-5 max-w-[56ch] text-lg leading-[1.6] text-ink-body">Real components rendered with the <b>{pal}</b> palette. Switch it at the top and everything re-themes — Breathe is neutral, color comes from each app.</p>
            <button type="button" onClick={() => setCurtainKey((k) => k + 1)} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill border border-line px-5 font-body font-semibold text-ink transition hover:bg-ink/[0.05]"><BreatheMark size={14} animated={false} /> Replay the curtain</button>
          </Container>
        </div>

        <Section id="symbol" title="Living symbol">
          <p className="mb-8 max-w-[60ch] text-ink-body">The Breathe symbol breathes — it inhales and exhales in a soft pulse. In <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">currentColor</code>, it inherits the token from its context. Respects prefers-reduced-motion.</p>
          <div className="flex flex-wrap items-center gap-10">
            <div className="text-ink"><BreatheMark size={80} /></div>
            <div className="text-action"><BreatheMark size={60} duration={4.5} /></div>
            <div className="rounded-2xl bg-ink p-8 text-surface"><BreatheMark size={60} /></div>
            <div className="text-ink-soft"><BreatheMark size={44} animated={false} /><p className="mt-2 text-xs text-ink-soft">static</p></div>
          </div>
        </Section>

        <Section id="lockup" title="Lockup — logo system">
          <p className="mb-8 max-w-[62ch] text-ink-body">The same symbol and name in five arrangements, one for each context. Neutral by token (color comes from the <b>{pal}</b> palette) and with the family's fixed typography. Switch the palette at the top — name and color follow.</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ["Stacked", "stacked", "Profiles, app splash, poster", true],
              ["Horizontal", "horizontal", "Site header, document", true],
              ["Wordmark", "wordmark", "Ads, when readability is essential", true],
              ["Symbol", "symbol", "Favicon, app icon, watermark", false],
              ["Merged", "merged", "Avatar, profile picture, packaging", false],
            ] as [string, LockupVariant, string, boolean][]).map(([label, v, usage, withTag]) => (
              <div key={v} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                <div className="flex min-h-[148px] flex-1 items-center justify-center">
                  <Lockup
                    variant={v}
                    name={brand.name}
                    logo={brand.logo}
                    wordmark={brand.wordmark}
                    wordmarkRatio={brand.wordmarkRatio} symbolSide={brand.symbolSide}
                    tagline={withTag ? brand.tagline : undefined}
                    size={v === "symbol" || v === "merged" ? "lg" : "md"}
                  />
                </div>
                <div className="mt-4 border-t border-line pt-3">
                  <p className="font-heading text-sm font-bold text-ink">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{usage}</p>
                </div>
              </div>
            ))}
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
          <p className="mb-8 max-w-[64ch] text-ink-body">The family's one button — the same one in the nav, the hero and the footer. Five variants (including <b>link</b>, the underlined text action of "See all" / "Secondary action"), three sizes, with icon and disabled. With <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">href</code> any variant becomes an <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">&lt;a&gt;</code>.</p>
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="solid">Solid</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link" href="#buttons">Link <IconArrowUpRight size={16} /></Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="solid" size="sm">Small</Button>
                <Button variant="solid" size="md">Medium</Button>
                <Button variant="solid" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">With icon (lucide injected)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="accent"><IconWind size={18} /> Icon on the left</Button>
                <Button variant="outline">Icon on the right <IconArrowUpRight size={18} /></Button>
                <Button variant="ghost" aria-label="Icon only"><IconMessage size={18} /></Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">States</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="solid" disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Link variant · on light</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-ink">
                <Button href="#buttons" variant="link">See all <IconArrowUpRight size={16} /></Button>
                <Button href="#buttons" variant="link">No arrow</Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Link variant · on dark background (inherits color)</p>
              <div className="inline-flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl bg-ink px-6 py-5 text-surface">
                <Button href="#buttons" variant="link">Secondary action <IconArrowUpRight size={16} /></Button>
                <Button href="#buttons" variant="link">View on Google Maps <IconArrowUpRight size={16} /></Button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">Polymorphism · any variant with href becomes &lt;a&gt;</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button href="#buttons" variant="solid">Link solid</Button>
                <Button href="#buttons" variant="outline">Link outline</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="icons" title="Icons">
          <IconsSection />
        </Section>

        <Section id="accordion" title="Accordion">
          <div className="max-w-[760px]">
            <Accordion items={[
              { id: "a", title: "What the physiotherapist assesses", content: <ul className="space-y-2 text-ink-body"><li>Lung auscultation and vital signs</li><li>Breathing pattern</li><li>Quality of global movement</li></ul> },
              { id: "b", title: "What can change the way you breathe", content: <p className="m-0 text-ink-body">Habits, postures and blocks the body creates in response to the respiratory disorder.</p> },
              { id: "c", title: "The technique, in detail", content: <p className="m-0 text-ink-body">Age-specific handling to reorganize synergies and improve respiratory function.</p> },
            ]} />
          </div>
        </Section>

        <Section id="pills" title="PillList">
          <PillList title="Conditions we treat" seeAll={{ label: "See all treatments", href: "#pills" }}
            items={["Asthma and bronchiolitis", "COPD", "Congenital torticollis", "Chronic pain", "Cranial and body asymmetries", "Snoring and sleep apnea", "Migraine, headache and TMJ"].map((label) => ({ label, href: "#pills" }))} />
        </Section>

        <Section id="header" title="Header (nav + dropdown)">
          {/* no overflow-hidden: the dropdown needs to escape the demo box.
              Generic structure: brand (link to home) · home icon · item with dropdown · items · locale · CTA. */}
          <div className="relative z-10 rounded-2xl border border-line [&>header]:rounded-t-2xl">
            <Header
              logo={
                <a href="#header" aria-label="Home page" className="inline-flex rounded-xl transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink">
                  {/* entrance as in novo.creeta: symbol, then the name; waits for the Curtain to lift (2200 + 700ms) */}
                  <Lockup key={curtainKey} entrance entranceDelay={2700} variant="horizontal" size="md" name={brand.name} logo={brand.logo} wordmark={brand.wordmark} wordmarkRatio={brand.wordmarkRatio} symbolSide={brand.symbolSide} />
                </a>
              }
              cta={<Button variant="accent" size="sm">WhatsApp</Button>}
              localeSwitcher={<span className={CHIP}>{IcPin} EN</span>}
              items={[
                { label: "Home", href: "#header", active: true, icon: <IconHome size={18} strokeWidth={1.75} />, iconOnly: true },
                { label: "Services", href: "#header", children: [
                  { label: "First service", href: "#header", icon: IcWind },
                  { label: "Second service", href: "#header", icon: IcUsers },
                  { label: "Third service", href: "#header", icon: IcSearch },
                ], seeAll: { label: "See all services", href: "#header" } },
                { label: "About", href: "#header" },
                { label: "Team", href: "#header" },
                { label: "Testimonials", href: "#header" },
                { label: "Contact", href: "#header" },
              ]}
            />
            <div className="p-6 text-sm text-ink-soft">Hover "Services" for the dropdown. "Home" is just the house icon; the label stays for screen readers. Brand at the sites' header size (44px symbol), with the animated entrance (symbol, then the name) — "Replay the curtain" repeats it.</div>
          </div>
        </Section>

        <Section id="mobile" title="Mobile · BottomNav">
          <p className="mb-8 max-w-[60ch] text-ink-body">On phones and tablets the navigation leaves the header and becomes this floating bar at the bottom. Here it is embedded in a frame so you can see it on desktop; below ~1024px it actually appears at the bottom of the window. Tap "More" for the panel.</p>
          <div className="mb-6">
            <p className="mb-2 text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Size</p>
            <div className="inline-flex rounded-pill border border-line p-0.5">
              {([["phone", "Phone · 390"], ["tablet", "Tablet · 768"]] as const).map(([m, label]) => (
                <button key={m} type="button" onClick={() => setMobW(m)} aria-pressed={mobW === m}
                  className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${mobW === m ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{label}</button>
              ))}
            </div>
          </div>
          <div
            className="relative mx-auto max-w-full overflow-hidden rounded-[2.5rem] border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(20,71,83,0.35)] transition-[width,height] duration-300 ease-cg motion-reduce:transition-none"
            style={mobW === "tablet" ? { width: 768, height: 820 } : { width: 390, height: 640 }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <Lockup variant="horizontal" size="sm" name={brand.name} logo={brand.logo} wordmark={brand.wordmark} wordmarkRatio={brand.wordmarkRatio} symbolSide={brand.symbolSide} />
              <span className={CHIP}>{IcPin} EN</span>
            </div>
            <div className="space-y-3 px-5 pt-6" aria-hidden="true">
              <div className="h-40 rounded-2xl bg-ink/[0.07]" />
              <div className="h-4 w-4/5 rounded-full bg-ink/[0.09]" />
              <div className="h-4 w-3/5 rounded-full bg-ink/[0.09]" />
              <div className="h-4 w-2/3 rounded-full bg-ink/[0.09]" />
            </div>
            {/* All pages in order of importance: the bar shows as many as fit
                (64px per tab) and the rest goes to "More" — on phones 4 + More,
                on tablets all of them. The external link always lives in More. */}
            <BottomNav
              embedded
              pages={[
                { label: "Home", href: "#mobile", Icon: IconHome, active: true },
                { label: "Services", href: "#mobile", Icon: IconWind },
                { label: "About", href: "#mobile", Icon: IconActivity },
                { label: "Team", href: "#mobile", Icon: IconUsers },
                { label: "Testimonials", href: "#mobile", Icon: IconMessage },
                { label: "Contact", href: "#mobile", Icon: IconMapPin },
              ]}
              extras={[{ label: "Partner site", href: "https://exemplo.com.br", Icon: IconGraduationCap, external: true }]}
            />
          </div>
        </Section>

        <Section id="anchornav" title="AnchorNav — page anchors">
          <p className="mb-6 max-w-[62ch] text-ink-body">Floating capsule that follows the scroll on a long page (extracted from ttcab's Treatment page): scroll-spy marks the visible section and the indicator slides to it. Scroll through these three sections.</p>
          <AnchorNav items={[{ id: "an-1", label: "First section" }, { id: "an-2", label: "Second section" }, { id: "an-3", label: "Third section, with a longer title" }]} />
          <div className="space-y-10 pt-6">
            {["an-1", "an-2", "an-3"].map((id, i) => (
              <section key={id} id={id} className="scroll-mt-40 rounded-2xl border border-line p-8">
                <h3 className="font-heading text-2xl font-bold text-ink">{["First", "Second", "Third"][i]} section</h3>
                <p className="mt-3 max-w-[60ch] text-ink-body">Generic content just to give the page height so the nav has something to follow. Each section needs a <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">scroll-mt</code> that matches the header height plus the capsule.</p>
                <div className="mt-6 h-48 rounded-2xl bg-ink/[0.06]" aria-hidden="true" />
              </section>
            ))}
          </div>
        </Section>

        <section id="hero" className="scroll-mt-24 border-b border-line py-[clamp(40px,6vw,72px)]">
          <Container>
            <SectionKicker>PageVideoHero <span className="font-heading text-base font-semibold text-ink-soft">— real width (full-bleed)</span></SectionKicker>
          </Container>
          <HeroDemo />
        </section>

      </main>

      {/* dogfooding: the page footer IS the Footer of Breathe DS. The bar above
          it switches the optional parts on and off — the footer is its own demo. */}
      <div id="footer" className="scroll-mt-24">
        <Container>
          <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4 lg:mt-24">
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Footer parts</span>
            {/* grouped by region of the footer, left to right, top to bottom */}
            {([
              ["Brand column", [["quote", "Sentence"]]],
              ["Where column", [["hours", "Info line"], ["directions", "Outbound links"]]],
              ["Notice band", [["notice", "Band"]]],
              ["Bottom bar", [["contacts", "Contact chips"], ["languages", "Language links"], ["credits", "Credits line"]]],
            ] as [string, [keyof typeof ft, string][]][]).map(([region, parts]) => (
              <div key={region} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-soft">{region}</span>
                {parts.map(([k, label]) => (
                  <PillToggle key={k} label={label} on={ft[k]} set={(v) => setFt((f) => ({ ...f, [k]: v }))} />
                ))}
              </div>
            ))}
          </div>
        </Container>
        <Footer
          className="!mt-6"
          logo={<Lockup variant="horizontal" size="md" name="Breathe" tagline="Design system of the Cuidado Global family" />}
          brandName="Breathe DS — design system of the Cuidado Global family"
          quote={ft.quote ? "Token decisions by role and measured contrast, never by eye." : undefined}
          pages={{ title: "On this page", links: PAGE_NAV.map(({ id, label }) => ({ href: `#${id}`, label })) }}
          where={{
            title: "Where to find it",
            address: ["npm: @breathe-ds/ui", "GitHub: felipegenuino/breathe-ds"],
            hours: ft.hours ? "Built for creeta, ttcab and metodorta." : undefined,
            directions: ft.directions ? [{ href: "https://www.npmjs.com/package/@breathe-ds/ui", label: "npm" }, { href: "https://github.com/felipegenuino/breathe-ds", label: "GitHub" }] : undefined,
          }}
          notice={ft.notice ? {
            title: "Themeable by design: the sites don't share a palette.",
            items: ["Token roles are shared (surface, ink, action, line); each site sets its own hex values.", "Every token carries its role and a measured contrast, never a color picked by eye.", "Brand marks come from each site's manual, with the wordmark ratio and symbol side."],
            action: <Button variant="solid" href="https://github.com/felipegenuino/breathe-ds#readme">Read the README</Button>,
          } : undefined}
          legal={<>Breathe DS · MIT License · © 2026 Felipe Genuino</>}
          contacts={ft.contacts ? [
            { href: "https://github.com/felipegenuino/breathe-ds/issues", label: "Issues", Icon: IconMessage, external: true },
            { href: "https://github.com/felipegenuino", label: "felipegenuino", Icon: IconInstagram, external: true },
          ] : undefined}
          languages={ft.languages ? [
            { lang: "pt-BR", label: "Português", href: "#footer", current: true },
            { lang: "en", label: "English", href: "#footer" },
            { lang: "es", label: "Español", href: "#footer" },
          ] : undefined}
          credits={ft.credits ? "Icons by Lucide · Quicksand and Figtree, open-source fonts." : undefined}
        />
      </div>

      <BottomNav
        pages={PAGE_NAV.map(({ id, label, Icon }) => ({ href: `#${id}`, label, Icon, active: id === activeSection }))}
        extras={[{ label: "Code on GitHub", href: "https://github.com/felipegenuino/breathe-ds", Icon: IconGraduationCap, external: true }]}
      />
    </div>
  );
}
