import { useEffect, useState, type ReactNode } from "react";
import { Accordion } from "../../components/Accordion";
import { CollapseRow, LinkRow, RowList } from "../../components/Rows";
import { Rail, RailItem } from "../../components/Rail";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Container } from "../../components/Container";
import { SectionKicker } from "../../components/SectionKicker";
import { PillList } from "../../components/PillList";
import { PageVideoHero } from "../../components/PageVideoHero";
import { Footer } from "../../components/Footer";
import { CareSteps } from "../../components/CareSteps";
import { StoryPanel } from "../../components/StoryPanel";
import { PostCard } from "../../components/PostCard";
import { FeaturedPosts } from "../../components/FeaturedPosts";
import { PostArticle } from "../../components/PostArticle";
import { CourseCard } from "../../components/CourseCard";
import { EventList } from "../../components/EventList";
import { EventFacts, DateBadge } from "../../components/EventFacts";
import { RegistrationBox } from "../../components/RegistrationBox";
import { SidePanel } from "../../components/SidePanel";
import { BackgroundVideo } from "../../components/BackgroundVideo";
import { ChatPreview } from "../../components/ChatPreview";
import { PlanTimeline } from "../../components/PlanTimeline";
import { PhotoSequence } from "../../components/PhotoSequence";
import { Header } from "../../components/Header";
import { AnchorNav } from "../../components/AnchorNav";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { List } from "../../components/List";
import { Timeline } from "../../components/Timeline";
import { Byline } from "../../components/Byline";
import { Heading, SectionHeading } from "../../components/Heading";
import { Text, Prose } from "../../components/Text";
import { CtaCard } from "../../components/CtaCard";
import { InfoCard } from "../../components/InfoCard";
import { FactStrip } from "../../components/FactStrip";
import { VideoStoryCard } from "../../components/VideoStoryCard";
import { TestimonialCard } from "../../components/TestimonialCard";
import { MediaCard, MediaCardBadge } from "../../components/MediaCard";
import { MapCard } from "../../components/MapCard";
import { PersonChip } from "../../components/PersonChip";
import { ProfessionalCard } from "../../components/ProfessionalCard";
import { Breadcrumb } from "../../components/Breadcrumb";
import { BottomNav } from "../../components/BottomNav";
import { BreatheMark } from "../../components/BreatheMark";
import { Curtain } from "../../components/Curtain";
import { Lockup, type LockupVariant } from "../../components/Lockup";
import { TtcabSymbol, TtcabWordmark, TTCAB_LOCKUP } from "../../components/marks/ttcab";
import { CreetaSymbol, CreetaWordmark, CREETA_LOCKUP } from "../../components/marks/creeta";
import { used, IconWind, IconActivity, IconBaby, IconSearch, IconHome, IconBook, IconInfo, IconMessage, IconMapPin, IconGraduationCap, IconVideo, IconUsers, IconArrowUpRight, IconPhone, IconMail, IconInstagram } from "../../components/icons";
import * as Lucide from "lucide-react";

/* ───── palettes (the DS is neutral; color comes from each app) ───── */
const PALETTES: Record<string, Record<string, string>> = {
  Neutral: {
    "--color-surface": "#f4f4f5", "--color-card": "#ffffff", "--color-surface-panel": "#18181b", "--color-ink": "#18181b",
    "--color-ink-soft": "#65656e", "--color-ink-body": "#3f3f46", "--color-action": "#18181b",
    "--color-action-text": "#52525b", "--color-on-action": "#ffffff", "--color-line": "rgb(0 0 0 / 0.12)", "--color-action-tint": "#e9e9ea", "--color-action-line": "#18181b",
  },
  TTCAB: {
    "--color-surface": "#fbf5e9", "--color-card": "#ffffff", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#54707a", "--color-ink-body": "#1e4f5b", "--color-action": "#e8541e",
    "--color-action-text": "#bd3f0c", "--color-on-action": "#ffffff", "--color-line": "rgb(20 71 83 / 0.16)", "--color-action-tint": "#faebdd", "--color-action-line": "#e8541e",
  },
  Creeta: {
    "--color-surface": "#eef3f4", "--color-card": "#ffffff", "--color-surface-panel": "#144753", "--color-ink": "#144753",
    "--color-ink-soft": "#266675", "--color-ink-body": "#1e4f5b", "--color-action": "#ab2781",
    "--color-action-text": "#8f1f6c", "--color-on-action": "#ffffff", "--color-line": "rgb(20 71 83 / 0.16)", "--color-action-tint": "#eae7ed", "--color-action-line": "#ab2781",
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

// Loop = local clip (landscape). Player = the video itself playing muted, looping, then with sound on tap:
// a YouTube id (16:9 iframe, covers the card, no crop) or an mp4 of the site (generated podcast-style clip).
const PREVIEW_LOOP = { src: "/demo/clip.mp4", poster: "/demo/clip-poster.jpg" };
const PLAYER_FILE = { src: "/demo/podcast.mp4", poster: "/demo/podcast-poster.jpg" };
const PLAYER_YOUTUBE_ID = "DdOoWDQutmk";
const PLAYER_CAPTION = "Speaker name, role, explains the method in the studio.";

function HeroDemo() {
  const [kind, setKind] = useState<"player" | "loop">("player");
  const [source, setSource] = useState<"file" | "youtube">("file");
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
      ? source === "file"
        ? { mode: "player" as const, ...PLAYER_FILE, playerCaption: PLAYER_CAPTION }
        : { mode: "player" as const, youtubeId: PLAYER_YOUTUBE_ID, playerCaption: PLAYER_CAPTION }
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
          {kind === "player" && <SegGroup label="Source" value={source} set={setSource} options={[["file", "MP4"], ["youtube", "YouTube"]]} />}
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
/* Demo languages: they don't translate the playground, the three links point back here. */
const DEMO_LANGUAGES = [
  { lang: "pt-BR", label: "Português", href: "#header", current: true },
  { lang: "en", label: "English", href: "#header" },
  { lang: "es", label: "Español", href: "#header" },
];

const PAGE_NAV = [
  { id: "symbol", label: "Symbol", Icon: IconWind },
  { id: "tokens", label: "Tokens", Icon: IconActivity },
  { id: "type", label: "Typography", Icon: IconBook },
  { id: "lockup", label: "Lockup", Icon: IconHome },
  { id: "buttons", label: "Button", Icon: IconActivity },
  { id: "action", label: "Action dose", Icon: IconActivity },
  { id: "icons", label: "Icons", Icon: IconSearch },
  { id: "accordion", label: "Accordion", Icon: IconBook },
  { id: "list", label: "List", Icon: IconBook },
  { id: "rows", label: "Rows", Icon: IconBook },
  { id: "timeline", label: "Timeline", Icon: IconActivity },
  { id: "people", label: "People", Icon: IconUsers },
  { id: "breadcrumb", label: "Breadcrumb", Icon: IconMapPin },
  { id: "pills", label: "PillList", Icon: IconSearch },
  { id: "header", label: "Header", Icon: IconHome },
  { id: "mobile", label: "Mobile", Icon: IconMapPin },
  { id: "anchornav", label: "AnchorNav", Icon: IconMapPin },
  { id: "cards", label: "Cards", Icon: IconBook },
  { id: "videos", label: "Videos", Icon: IconVideo },
  { id: "map", label: "Map", Icon: IconMapPin },
  { id: "hero", label: "Hero", Icon: IconVideo },
  { id: "care", label: "CareSteps", Icon: IconActivity },
  { id: "story", label: "StoryPanel", Icon: IconBook },
  { id: "blog", label: "Blog", Icon: IconBook },
  { id: "course", label: "CourseCard", Icon: IconGraduationCap },
  { id: "events", label: "Events", Icon: IconGraduationCap },
  { id: "cta", label: "CtaCard", Icon: IconMessage },
  { id: "footer", label: "Footer", Icon: IconMessage },
] as const;

// the footer with many pages: titled columns instead of one long list
const FOOTER_GROUPS = (
  [
    ["Foundations", ["symbol", "tokens", "type", "lockup", "icons"]],
    ["Navigation", ["header", "mobile", "anchornav", "breadcrumb", "footer"]],
    ["Content", ["buttons", "action", "accordion", "list", "rows", "timeline", "pills"]],
    ["Cards & media", ["people", "cards", "videos", "map", "hero", "care", "story", "blog", "course", "events", "cta"]],
  ] as const
).map(([title, ids]) => ({
  title,
  links: ids.map((id) => ({ href: `#${id}`, label: PAGE_NAV.find((p) => p.id === id)!.label })),
}));


// Real classes of the school, read from the public pages of metodorta.com.br on
// 2026-10-29 (titles, dates, venues, prices, rules); instructors per class from
// the portraits on each class (30 Oct). Covers here are generated images.

// Instructors of the school (metodorta.com.br/metodo-rta/equipe, 30 Oct 2026):
// public portraits, linked from the school's server, not stored here.
const T = {
  mariangela: { name: "Mariangela P. de Lima", photo: "https://metodorta.com.br/wp-content/uploads/2000/02/Mariangela.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  gabriela: { name: "Gabriela Di Filippo Souza", photo: "https://metodorta.com.br/wp-content/uploads/2025/07/54b82fa3-85d4-4c8c-b8b0-b261345572e3.jpg", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  anacarolina: { name: "Ana Carolina Xavier", photo: "https://metodorta.com.br/wp-content/uploads/2024/04/4.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  aline: { name: "Aline Cara Torturete", photo: "https://metodorta.com.br/wp-content/uploads/2024/04/8.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  bianca: { name: "Bianca Peixoto", photo: "https://metodorta.com.br/wp-content/uploads/2025/07/bianca-site.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  danielle: { name: "Danielle Fortuna", photo: "https://metodorta.com.br/wp-content/uploads/2024/04/5.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  mariana: { name: "Mariana Sierra de Cruz", photo: "https://metodorta.com.br/wp-content/uploads/2024/04/9.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
  luciana: { name: "Luciana Ribeiro Pienta", photo: "https://metodorta.com.br/wp-content/uploads/2024/04/6.png", href: "https://metodorta.com.br/metodo-rta/equipe/" },
};

type DemoCourse = {
  id: string;
  course: string;
  city: string;
  cover: string;
  coverPosition?: string;
  start: { month: string; day: string };
  when: { title: string; subtitle?: string };
  where?: { title: string; subtitle?: string; href?: string };
  workload: string;
  seats?: string;
  soldOut?: boolean;
  price: { value: string; note: string; cash: string; down: string };
  cart?: string;
  page: string;
  about: string;
  programme: string[];
  audience: string;
  discounts: string[];
  rules: string[];
  instructors: { name: string; photo: string; href: string }[];
};
const COURSES: DemoCourse[] = [
  {
    id: "ttcab-2026-fortaleza",
    instructors: [T.mariangela],
    course: "TTCAB 2026 · Tratamento do Torcicolo Congênito e outras Assimetrias Corporais do Bebê",
    city: "Fortaleza · CE",
    cover: "/demo/assessment.jpg",
    start: { month: "Nov", day: "3" },
    when: { title: "3 a 9 de novembro de 2026 · 08h30–17h30", subtitle: "+ 10 de novembro · 08h30–13h00" },
    where: { title: "Instituto Olá, auditório Luz", subtitle: "Rua Felipe Nery, 1000, Guararapes, Fortaleza · CE", href: "https://www.google.com/maps/search/?api=1&query=Rua+Felipe+Nery+1000+Fortaleza" },
    workload: "69 horas/aula",
    seats: "14 vagas",
    price: { value: "R$ 7.280", note: "à vista · até 12x no cartão", cash: "R$ 7.280,00", down: "R$ 1.456,00" },
    cart: "https://metodorta.com.br/carrinho/?add-to-cart=60079",
    page: "https://metodorta.com.br/cursos-e-eventos/ttcab-tratamento-do-torcicolo-congenito-e-outras-assimetrias-corporais-do-bebe-2/",
    about: "Biomecânica das assimetrias corporais do bebê no primeiro ano de vida: desenvolvimento sensório-motor e estratégias de captação sensorial e atividades funcionais.",
    programme: ["Tipos de torcicolo (congênito, obstétrico, postural) e graduação da gravidade", "Biomecânica craniocervical e torácica; pressão pélvica e abdominal", "Relação com as assimetrias cranianas e efeitos sensório-motores", "Assimetrias por gastrostomia, cirurgia e escoliose congênita", "Prática: avaliação funcional e tratamento gentil de corpo inteiro em quatro faixas (0–3, 4–6, 7–9 e 10–12 meses)"],
    audience: "Somente fisioterapeutas podem participar.",
    discounts: ["Grupos de cinco ou mais da mesma turma: 5% de desconto (cupom pelo WhatsApp)", "Reciclagem para quem já fez o curso básico: 25% de desconto"],
    rules: ["A pré-inscrição não garante a vaga: a matrícula se confirma com a primeira parcela ou o pagamento integral", "Certificado incluso, emitido no nome usado na matrícula e entregue no último dia (segunda via R$ 70,00)", "Alunos presenciais precisam de ao menos três doses da vacina contra a COVID-19 até o início"],
  },
  {
    id: "basico-2026-florianopolis",
    instructors: [T.mariangela],
    course: "Curso Básico de RTA 2026 · Reequilíbrio Toracoabdominal",
    city: "Florianópolis · SC",
    cover: "/demo/clip-poster.jpg",
    coverPosition: "50% 40%",
    start: { month: "Dez", day: "2" },
    when: { title: "2 a 8 de dezembro de 2026 · 08h30–17h30", subtitle: "+ 9 de dezembro · 08h30–13h30" },
    where: { title: "Centro de Reequilíbrio Toracoabdominal (Creeta)", subtitle: "Rua João Mathias Cordeiro, 33, Santa Mônica, Florianópolis · SC", href: "https://www.google.com/maps/search/?api=1&query=Rua+Jo%C3%A3o+Mathias+Cordeiro+33+Florian%C3%B3polis" },
    workload: "69 horas/aula",
    seats: "28 vagas",
    price: { value: "R$ 7.280", note: "à vista · até 12x no cartão", cash: "R$ 7.280,00", down: "R$ 1.456,00" },
    cart: "https://metodorta.com.br/carrinho/?add-to-cart=77155",
    page: "https://metodorta.com.br/cursos-e-eventos/curso-basico-em-reequilibrio-toracoabdominal/",
    about: "Avaliação e tratamento global, funcional e humanizado do sistema respiratório, em pacientes de todas as idades.",
    programme: ["Biomecânica respiratória e raciocínio clínico do método", "Atividade muscular respiratória e não respiratória; desenvolvimento muscular no primeiro ano", "Bloqueio inspiratório nas doenças obstrutivas e restritivas; padrões respiratórios", "Facilitação do diafragma, alongamento e fortalecimento, reexpansão pulmonar, desbloqueio da caixa torácica", "Biomecânica neonatal e manuseio do prematuro"],
    audience: "Somente fisioterapeutas, com comprovação do registro no Crefito.",
    discounts: ["Grupos de cinco ou mais da mesma turma: 5% de desconto", "Reciclagem para quem já fez o curso básico: 25% de desconto"],
    rules: ["A pré-inscrição não garante a vaga: a matrícula se confirma com a primeira parcela ou o pagamento integral", "Certificado incluso (segunda via R$ 70,00)", "Troca de turma com 30 dias de antecedência, taxa de 15% e vaga disponível"],
  },
  {
    id: "basico-2026-rio",
    instructors: [T.mariangela, T.gabriela, T.anacarolina, T.aline, T.bianca],
    course: "Curso Básico de RTA 2026 · Reequilíbrio Toracoabdominal",
    city: "Rio de Janeiro · RJ",
    cover: "/demo/podcast-poster.jpg",
    start: { month: "Set", day: "21" },
    when: { title: "21 a 27 de setembro de 2026 · 08h30–17h30", subtitle: "+ 28 de setembro · 08h30–13h30" },
    where: { title: "Centro de Estudos Physioscience", subtitle: "Av. N. Senhora de Copacabana, 928, sala 1202, Copacabana, Rio de Janeiro · RJ" },
    workload: "69 horas/aula",
    soldOut: true,
    price: { value: "R$ 7.280", note: "à vista · até 12x no cartão", cash: "R$ 7.280,00", down: "R$ 1.456,00" },
    page: "https://metodorta.com.br/cursos-e-eventos/curso-basico-em-reequilibrio-toracoabdominal/",
    about: "Avaliação e tratamento global, funcional e humanizado do sistema respiratório, em pacientes de todas as idades.",
    programme: ["Biomecânica respiratória e raciocínio clínico do método", "Facilitação do diafragma, reexpansão pulmonar, desbloqueio da caixa torácica", "Biomecânica neonatal e manuseio do prematuro"],
    audience: "Somente fisioterapeutas, com comprovação do registro no Crefito.",
    discounts: ["Grupos de cinco ou mais da mesma turma: 5% de desconto", "Reciclagem: 25% de desconto"],
    rules: ["Turma esgotada: a escola pode indicar outra cidade com vaga"],
  },
  {
    id: "avancado-2027-florianopolis",
    instructors: [T.mariangela, T.luciana, T.mariana],
    course: "Curso Avançado de RTA em Pediatria Ambulatorial 2027",
    city: "Florianópolis · SC",
    cover: "/demo/invite-loop-poster.jpg",
    start: { month: "Ago", day: "18" },
    when: { title: "18 a 24 de agosto de 2027", subtitle: "08h30–12h30 e 14h00–18h00" },
    where: { title: "Centro de Reequilíbrio Toracoabdominal (Creeta)", subtitle: "Rua João Mathias Cordeiro, 33, Santa Mônica, Florianópolis · SC", href: "https://www.google.com/maps/search/?api=1&query=Rua+Jo%C3%A3o+Mathias+Cordeiro+33+Florian%C3%B3polis" },
    workload: "67 horas/aula",
    seats: "18 vagas",
    price: { value: "R$ 8.350", note: "à vista · até 12x no cartão", cash: "R$ 8.350,00", down: "R$ 1.670,00" },
    page: "https://metodorta.com.br/cursos-e-eventos/avancado-de-rta-em-pediatria-ambulatorial-2027/",
    about: "Aprofunda a avaliação clínica e a tomada de decisão no atendimento pediátrico ambulatorial, com a formação avançada em RTA.",
    programme: ["Avaliação clínica e decisão terapêutica no ambulatório pediátrico", "Alunos da mesma cidade podem trazer o próprio paciente; encaminhamentos são aceitos"],
    audience: "Somente fisioterapeutas com a formação básica em RTA.",
    discounts: [],
    rules: ["A pré-inscrição não garante a vaga: a matrícula se confirma com a primeira parcela ou o pagamento integral", "Certificado incluso", "Alunos presenciais precisam de ao menos três doses da vacina contra a COVID-19 até o início"],
  },
];

// Curso Básico de RTA 2027: the eight classes of the year (R$ 8.350, 69 horas/aula), as an EventList
const BASICO_2027 = [
  { month: "Abril", iso: "2027-04", items: [{ date: "1 a 7 abr", city: "Dourados · MS", venue: "Local a confirmar", seats: 33, people: [T.mariangela, T.gabriela] }] },
  { month: "Maio", iso: "2027-05", items: [{ date: "3 a 9 mai", city: "João Pessoa · PB", venue: "Local a confirmar", seats: 36, people: [T.mariangela, T.gabriela] }, { date: "24 a 30 mai", city: "Curitiba · PR", venue: "Neurointensiva, Rua Victório Malucelli, 360, Hauer", seats: 34, people: [T.mariangela, T.gabriela] }] },
  { month: "Junho", iso: "2027-06", items: [{ date: "8 a 14 jun", city: "Florianópolis · SC", venue: "Creeta, Rua João Mathias Cordeiro, 33, Santa Mônica", seats: 31, people: [T.mariangela, T.gabriela] }, { date: "22 a 28 jun", city: "Rio de Janeiro · RJ", venue: "Centro de Estudos Physioscience, Copacabana", seats: 30, people: [T.mariangela, T.gabriela, T.danielle, T.anacarolina] }] },
  { month: "Julho", iso: "2027-07", items: [{ date: "1 a 6 jul", city: "São Paulo · SP", venue: "Instituto Phorte, Rua Treze de Maio, 681, Bela Vista", seats: 37, people: [T.mariangela, T.gabriela, T.mariana] }] },
  { month: "Agosto", iso: "2027-08", items: [{ date: "2 a 8 ago", city: "Foz do Iguaçu · PR", venue: "Local a confirmar", seats: 39, people: [T.mariangela, T.gabriela] }] },
  { month: "Outubro", iso: "2027-10", items: [{ date: "18 a 24 out", city: "Fortaleza · CE", venue: "Local a confirmar", seats: 32, people: [T.mariangela, T.gabriela] }] },
];

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
  const [listMarker, setListMarker] = useState<"check" | "arrow">("check");
  const [mapW, setMapW] = useState<"full" | "half">("half");
  const [vs, setVs] = useState({ speaker: true, lead: true, preview: false, watched: false, layout: "stacked" as "stacked" | "side" });
  const [tc, setTc] = useState({ link: true, two: false, photo: false });
  const [pc, setPc] = useState({ photo: true, living: true, presentation: true, captions: true, collapseText: true, collapseLinks: true, pageLink: false, iconLink: true });
  const [pcSize, setPcSize] = useState<"full" | "medium" | "micro">("full");
  const [mc, setMc] = useState({ badge: true, arrow: true, eyebrow: false, text: true, link: false, media: "clip" as "image" | "clip" | "hover" });
  const [listLinks, setListLinks] = useState(true);
  // optional parts of the page footer (the footer is its own demo)
  const [dose, setDose] = useState<"disciplined" | "loud">("disciplined");
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const selected = COURSES.find((c) => c.id === openCourse) ?? null;
  const [ft, setFt] = useState({ quote: true, pages: true, hours: true, directions: true, notice: true, contacts: true, languages: false, credits: true });
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
          { label: "Typography", href: "#type" },
          { label: "Components", href: "#buttons", children: [
            { label: "Lockup (logo)", href: "#lockup", icon: IcHome },
            { label: "Button", href: "#buttons", icon: IcPulse },
            { label: "Action dose (accent rules)", href: "#action", icon: IcPulse },
            { label: "Icons", href: "#icons", icon: IcSearch },
            { label: "Accordion", href: "#accordion", icon: IcBook },
            { label: "List", href: "#list", icon: IcBook },
            { label: "Timeline", href: "#timeline", icon: IcPulse },
            { label: "People (ProfessionalCard, Byline, PersonChip)", href: "#people", icon: IcUsers },
            { label: "Breadcrumb", href: "#breadcrumb", icon: IcPin },
            { label: "PillList", href: "#pills", icon: IcSearch },
            { label: "Header", href: "#header", icon: IcHome },
            { label: "Mobile · BottomNav", href: "#mobile", icon: IcHome },
            { label: "AnchorNav", href: "#anchornav", icon: IcPin },
            { label: "Cards (FactStrip, InfoCard, MediaCard)", href: "#cards", icon: IcBook },
            { label: "Videos (VideoStoryCard, TestimonialCard)", href: "#videos", icon: IcVideo },
            { label: "MapCard", href: "#map", icon: IcPin },
            { label: "PageVideoHero", href: "#hero", icon: IcVideo },
            { label: "CareSteps (ChatPreview, PlanTimeline, PhotoSequence)", href: "#care", icon: IcPulse },
            { label: "StoryPanel (pillars on the dark panel)", href: "#story", icon: IcBook },
            { label: "Blog (PostCard, FeaturedPosts, PostArticle)", href: "#blog", icon: IcBook },
            { label: "CourseCard (class card)", href: "#course", icon: IcCap },
            { label: "Events (EventList, EventRow, EventFacts, RegistrationBox)", href: "#events", icon: IcCap },
            { label: "CtaCard (final call)", href: "#cta", icon: IcChat },
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
            {([["surface", "--color-surface"], ["ink", "--color-ink"], ["ink-soft", "--color-ink-soft"], ["action", "--color-action"], ["action-text", "--color-action-text"], ["action-tint", "--color-action-tint"], ["action-line", "--color-action-line"], ["line", "--color-line"]] as const).map(([n, k]) => {
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

        <Section id="type" title="Typography">
          <p className="mb-8 max-w-[62ch] text-ink-body">The family's type scale, from novo.creeta. Quicksand medium for headings in <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">ink</code>; a two-tone heading keeps the second sentence in the same element, one tone below (<code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">ink-soft</code>). Figtree for text: lead, body, small, eyebrow.</p>
          <div className="space-y-12">
            <div className="rounded-[28px] bg-white p-6 md:p-10">
              <SectionHeading as="h1" eyebrow="Eyebrow" title="Display heading, first sentence." accent="Second sentence, one tone below." lead="Lead paragraph: a supporting sentence right under the title, at reading width." />
              <p className="m-0 text-xs text-ink-soft">SectionHeading as h1 · display · eyebrow + accent + lead</p>
            </div>
            <div className="rounded-[28px] bg-white p-6 md:p-10">
              <SectionHeading number="01" eyebrow="Eyebrow" title="Section heading." accent="With its accent sentence." lead="Lead paragraph under a section title." />
              <p className="m-0 text-xs text-ink-soft">SectionHeading as h2 · section · number + eyebrow</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] bg-white p-6 md:p-8">
                <Heading as="h2" size="hero">Hero heading over media.</Heading>
                <p className="m-0 mt-2 text-xs text-ink-soft">Heading · hero</p>
              </div>
              <div className="rounded-[28px] bg-white p-6 md:p-8">
                <Heading as="h2" size="card">Card heading</Heading>
                <p className="m-0 mt-2 text-xs text-ink-soft">Heading · card</p>
                <Heading as="h3" className="mt-6">Small heading (h3)</Heading>
                <p className="m-0 mt-2 text-xs text-ink-soft">Heading · small</p>
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-6 md:p-10">
              <Text variant="eyebrow">Eyebrow · a date or a label one tone below</Text>
              <Heading as="h3" className="mt-1">Small heading after an eyebrow</Heading>
              <Prose className="mt-4">
                <Text variant="lead">Lead paragraph: larger, for the sentence that opens a block of text.</Text>
                <Text>Body paragraph: the reading text of the family, Figtree with relaxed leading, at a width of about sixty-five characters so the eye comes back to the next line without effort.</Text>
                <Text>A second body paragraph, to show the rhythm between paragraphs inside Prose.</Text>
                <Text variant="small">Small: a note or a caption, in the soft tone.</Text>
              </Prose>
            </div>
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

        <Section id="action" title="Action dose — how a hot accent stays calm">
          <p className="mb-6 max-w-[62ch] text-ink-body">The rule brands with a hot color follow (Cloudflare orange, Airbnb red): the action color is the fill of ONE element per block, with dark text on it; links stay in ink; a highlighted card is a 6% wash plus a border, not the full color; white on the action color only on the accent Button, same type scale as the others (3.67:1 on ttcab, a conscious exception like Cloudflare's); the color as text only in its darker <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">action-text</code>. Switch the palette to TTCAB and compare with the loud version.</p>
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Dose</span>
            <SegGroup label="Dose" value={dose} set={setDose} options={[["disciplined", "One accent per block"], ["loud", "Loud (everything in the action color)"]]} />
          </div>
          {(() => {
            const loud = dose === "loud";
            const kicker = loud ? "text-action" : "text-action-text";
            const link = loud ? "text-action underline underline-offset-4" : "text-ink-soft underline decoration-ink/30 underline-offset-4 hover:decoration-ink";
            const featuredBox = loud ? "border-2 border-action bg-card" : "border border-action-line bg-action-tint";
            return (
              <div className="space-y-8">
                {/* 1. panel with a kicker, links in the text and one accent button */}
                <div className={`rounded-[28px] p-6 md:p-8 ${featuredBox}`}>
                  <p className={`mb-3 font-heading text-[0.82rem] font-bold tracking-[0.1em] uppercase ${kicker}`}>Kicker in the action color</p>
                  <h3 className="font-heading text-2xl font-medium text-ink md:text-[1.75rem]">A highlighted panel: a wash of the action color and a closed border.</h3>
                  <p className="mt-3 max-w-[56ch] text-ink-body">Body text stays in ink-body. Links in the text go in <a href="#action" className={link}>ink-soft with an underline</a>, never in the action color, so the one button below is the only hot element. <a href="#action" className={link}>Another link</a>.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="accent">Primary action</Button>
                    <Button variant={loud ? "accent" : "outline"}>Secondary</Button>
                    <Button variant={loud ? "accent" : "ghost"}>Tertiary</Button>
                  </div>
                </div>

                {/* 2. plan cards: the featured one gets the tint + line + the accent button */}
                <ul className="grid list-none gap-3 md:grid-cols-3 md:gap-5">
                  {[false, true, false].map((featured, i) => (
                    <li key={i} className={`rounded-[24px] p-6 ${featured ? featuredBox : "bg-card"}`}>
                      <p className="font-heading text-lg font-medium text-ink">Plan name</p>
                      <p className="mt-1 text-sm text-ink-soft">Supporting line about this plan.</p>
                      <p className={`mt-5 font-heading text-3xl font-semibold ${loud ? "text-action" : featured ? "text-action-text" : "text-ink"}`}>Value</p>
                      <div className="mt-5 [&>*]:w-full">
                        <Button variant={featured || loud ? "accent" : "outline"}>Choose</Button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* 3. segmented control: the selected segment is the one accent */}
                <div className="rounded-[28px] bg-card p-6 md:p-8">
                  <p className="mb-4 text-sm text-ink-soft">Small controls (segmented control, chips, tabs) never put white on the action color: the 3.67:1 exception is for the one accent Button of a block, not for every state. Two options that pass AA for the selected segment: ink, or the action family through the tint (action-tint behind action-text, with an action-line hairline).</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {([["ink", "bg-ink text-surface"], ["action tint", "bg-action-tint text-action-text shadow-[inset_0_0_0_1px_var(--color-action-line)]"]] as const).map(([name, selected]) => (
                      <div key={name}>
                        <p className="mb-2 text-xs font-semibold text-ink-soft">Selected · {name}</p>
                        <div className="inline-flex flex-wrap gap-1 rounded-pill border border-line p-1">
                          {["Selected", "Option", "Option", "Option"].map((o, i) => (
                            <span key={i} className={`inline-flex min-h-10 items-center rounded-pill px-4 text-sm font-semibold ${i === 0 || loud ? (loud ? "bg-action text-on-action" : selected) : "text-ink"}`}>{o}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </Section>

        <Section id="icons" title="Icons">
          <IconsSection />
        </Section>

        <Section id="accordion" title="Accordion">
          <div>
            <Accordion items={[
              { id: "a", title: "What the physiotherapist assesses", content: <ul className="space-y-2 text-ink-body"><li>Lung auscultation and vital signs</li><li>Breathing pattern</li><li>Quality of global movement</li></ul> },
              { id: "b", title: "What can change the way you breathe", content: <p className="m-0 text-ink-body">Habits, postures and blocks the body creates in response to the respiratory disorder.</p> },
              { id: "c", title: "The technique, in detail", content: <p className="m-0 text-ink-body">Age-specific handling to reorganize synergies and improve respiratory function.</p> },
            ]} />
          </div>
        </Section>

        <Section id="list" title="List">
          <p className="mb-6 max-w-[62ch] text-ink-body">The family's list with a marker in front of each item, from novo.creeta: a check bubble ("what we assess", "what we treat") or the corner arrow for one sentence per item. An item with a link gets the underline and the outbound arrow.</p>
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Elements</span>
            <SegGroup label="Marker" value={listMarker} set={setListMarker} options={[["check", "Check"], ["arrow", "Arrow"]]} />
            <PillToggle label="Link items" on={listLinks} set={setListLinks} />
          </div>
          <div className="max-w-2xl">
            <List marker={listMarker} items={[
              { label: "List item" },
              { label: listLinks ? "List item that is a link" : "List item", href: listLinks ? "#list" : undefined },
              { label: "List item with a longer label that wraps onto a second line to show the alignment of the marker" },
              { label: listLinks ? "List item that is an external link" : "List item", href: listLinks ? "https://github.com/felipegenuino/breathe-ds" : undefined, external: listLinks },
              { label: "List item" },
            ]} />
          </div>
        </Section>

        <Section id="rows" title="Rows — RowList · CollapseRow · LinkRow">
          <p className="mb-6 max-w-[62ch] text-ink-body">The list of equal rows at the foot of a card (the Trajectory, Guidance and Instagram rows of the ProfessionalCard), made generic: each row is 48px tall with the label on the left and a glyph on the right. A CollapseRow opens in place (a native details: a text, or a list of links with the count beside the label); a LinkRow goes somewhere. The arrow follows the Pill: ↗ another page, ↓ an anchor on this page; "external" only adds the new tab.</p>
          <Card className="max-w-md">
            <RowList>
              <CollapseRow label="Collapse with text">A short paragraph that opens in place, under the row, without JavaScript.</CollapseRow>
              <CollapseRow label="Collapse with links" links={[
                { label: "Link to another page", href: "#rows" },
                { label: "Link to an anchor on this page", href: "#list", arrow: "down" },
                { label: "Outbound link in a new tab", href: "https://github.com/felipegenuino/breathe-ds", external: true },
              ]} />
              <LinkRow label="Link row" href="#rows" />
              <LinkRow label="Link row to an anchor" href="#list" arrow="down" />
              <LinkRow label="Link row in a new tab" href="https://github.com/felipegenuino/breathe-ds" external srLabel=" (opens in a new tab)" />
              <LinkRow label="Link row with an icon" href="#rows" icon={<IconInstagram size={18} aria-hidden="true" />} />
            </RowList>
          </Card>
        </Section>

        <Section id="timeline" title="Timeline">
          <p className="mb-6 max-w-[62ch] text-ink-body">The "Como cuidamos" of novo.creeta: an ordered sequence of steps, each with its drawing and a title answered by a paragraph; a thin line links one drawing to the next.</p>
          <div className="max-w-2xl">
            <Timeline steps={[
              { Icon: IconInfo, title: "Step title", body: "Step body: a short paragraph that answers the question in the title, in one to three sentences." },
              { Icon: IconSearch, title: "Step title with a link", body: "Step body: a short paragraph that answers the question in the title.", link: { label: "Outbound link", href: "https://github.com/felipegenuino/breathe-ds", external: true } },
              { Icon: IconActivity, title: "Step title", body: "Step body: a longer paragraph, to show how the line keeps linking the drawings when the text grows over several lines and the step gets taller." },
              { Icon: IconUsers, title: "Last step title", body: "Step body: the last step has no line after its drawing." },
            ]} />
          </div>
        </Section>

        <Section id="people" title="People — ProfessionalCard · Byline · PersonChip">
          <p className="mb-6 max-w-[62ch] text-ink-body">The team card of novo.creeta in three sizes. Full (team page): portrait (plain, or a living one that plays on hover, or with the "Presentation" chip that opens a modal with the video, its live captions above the name, and the full bio), name, role, registration — always shown, it is a legal duty for health professionals — and generic rows: collapses with text or links, links with an arrow or an icon (on creeta: trajectory, guidance, Instagram). Medium (home): a tile with the 3:4 portrait and the name, linking to the full card, on a Rail — a snapping carousel with a progress bar on the phone, a grid from md. Micro ("who treats" on a treatment page): 72px photo, name and role. Below, who signs or explains a piece of content: Byline and PersonChip. Without a photo, the initials in a bubble.</p>
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
            <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">ProfessionalCard</span>
            <SegGroup label="Size" value={pcSize} set={setPcSize} options={[["full", "Full"], ["medium", "Medium"], ["micro", "Micro"]]} />
            {(pcSize === "full"
              ? ([["photo", "Photo"], ["living", "Living portrait"], ["presentation", "Presentation"], ["captions", "Captions"], ["collapseText", "Collapse · text"], ["collapseLinks", "Collapse · links"], ["pageLink", "Link · page"], ["iconLink", "Link · icon"]] as [keyof typeof pc, string][])
              : pcSize === "medium"
                ? ([["photo", "Photo"], ["living", "Living portrait"]] as [keyof typeof pc, string][])
                : ([["photo", "Photo"]] as [keyof typeof pc, string][])
            ).map(([k, label]) => (
              <PillToggle key={k} label={label} on={pc[k]} set={(v) => setPc((m) => ({ ...m, [k]: v }))} />
            ))}
          </div>
          {pcSize === "medium" && (
            <div className="mb-10">
              <Rail label="Team" grid="md:grid-cols-6">
                {["Person name", "Another person", "Third person", "Fourth person", "Fifth person", "Sixth person"].map((n, i) => (
                  <RailItem key={n} width="narrow">
                    <ProfessionalCard
                      size="medium"
                      name={n}
                      href="#people"
                      photo={pc.photo ? { src: "/demo/person-poster.jpg" } : undefined}
                      living={pc.photo && pc.living && i === 0 ? { src: "/demo/person.mp4", poster: "/demo/person-poster.jpg" } : undefined}
                    />
                  </RailItem>
                ))}
              </Rail>
              <a href="#people" className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-soft underline underline-offset-4">
                Meet the team
                <IconArrowUpRight aria-hidden="true" size={18} className="cg-arrow-go" />
              </a>
            </div>
          )}
          {pcSize === "micro" && (
            <ul className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
              {[["Person name", "Role"], ["Another person", "Role and a longer specialty that wraps"], ["Third person", "Role"]].map(([n, r]) => (
                <li key={n}>
                  <ProfessionalCard size="micro" name={n} role={r} href="#people" photo={pc.photo ? { src: "/demo/person-avatar.jpg" } : undefined} />
                </li>
              ))}
            </ul>
          )}
          <div className={`mb-10 max-w-sm ${pcSize === "full" ? "" : "hidden"}`}>
            <ProfessionalCard
              id="person-name"
              name="Person name"
              role="Role"
              registration="Registration number"
              photo={pc.photo ? { src: "/demo/person-poster.jpg" } : undefined}
              living={pc.photo && pc.living ? { src: "/demo/person.mp4", poster: "/demo/person-poster.jpg" } : undefined}
              presentation={pc.presentation ? { src: "/demo/person.mp4", poster: "/demo/person-poster.jpg", duration: 10, captions: pc.captions ? { src: "/demo/person.vtt", srcLang: "en", label: "English" } : undefined } : undefined}
              bio="A paragraph of bio: where the person trained, what they work with, and the approach they bring to the care."
              rows={[
                ...(pc.collapseText ? [{ kind: "collapse" as const, label: "Collapse with text", srLabel: " of Person name", content: "A paragraph of bio: where the person trained, what they work with, and the approach they bring to the care." }] : []),
                ...(pc.collapseLinks ? [{ kind: "collapse" as const, label: "Collapse with links", srLabel: " of Person name", links: [{ label: "Link to another page", href: "#people" }, { label: "Another link", href: "#people" }], openOnArrival: true }] : []),
                ...(pc.pageLink ? [{ kind: "link" as const, label: "Link to a page", href: "#people" }] : []),
                ...(pc.iconLink ? [{ kind: "link" as const, label: "Link with icon", srLabel: " (opens in a new tab)", href: "https://instagram.com", external: true, icon: <IconInstagram size={18} aria-hidden="true" /> }] : []),
              ]}
            />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="mb-3 text-xs font-semibold text-ink-soft">Byline · group (eyebrow + names as links)</p>
              <Byline eyebrow="Eyebrow" people={[{ name: "Person name", href: "#people", photo: "/demo/person-avatar.jpg" }, { name: "Another person", href: "#people", photo: "/demo/person-avatar.jpg" }]} />
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="mb-3 text-xs font-semibold text-ink-soft">Byline · inline (name + action link)</p>
              <Byline people={[{ name: "Person name" }]} action={{ label: "Action link", href: "#people" }} />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="mb-3 text-xs font-semibold text-ink-soft">PersonChip · link (arrow bubble)</p>
              <PersonChip name="Person name" description="Role · Registration number" href="#people" photo="/demo/person-avatar.jpg" />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="mb-3 text-xs font-semibold text-ink-soft">PersonChip · text only</p>
              <PersonChip name="Person name" description="Role · Registration number" />
            </div>
          </div>
        </Section>

        <Section id="breadcrumb" title="Breadcrumb">
          <p className="mb-6 max-w-[62ch] text-ink-body">The trail of an article: back arrow on the first crumb, chevrons between, the current page not listed (its title follows).</p>
          <Breadcrumb items={[{ label: "Section", href: "#breadcrumb" }, { label: "Parent page", href: "#breadcrumb" }]} />
        </Section>

        <Section id="pills" title="PillList">
          <p className="mb-6 max-w-[62ch] text-ink-body">The Atalho of novo.creeta: a white pill, 44px tall, with an arrow in a circle. The arrow says where it goes — down for an anchor on the same page, diagonal for another page. Optional meta after the label ("11 videos").</p>
          <div className="space-y-10">
            <PillList title="Pills to other pages" seeAll={{ label: "See-all link", href: "https://github.com/felipegenuino/breathe-ds" }}
              items={["Pill", "Pill with a longer label", "Pill", "Another pill", "One more pill", "Short", "Pill with the longest label of the list"].map((label) => ({ label, href: "https://github.com/felipegenuino/breathe-ds" }))} />
            <PillList title="Anchor pills with meta"
              items={[{ label: "Section one", meta: "11 items", href: "#symbol" }, { label: "Section two", meta: "8 items", href: "#tokens" }, { label: "Section three", meta: "12 items", href: "#lockup" }, { label: "Section four", meta: "7 items", href: "#buttons" }]} />
          </div>
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
              cta={<Button variant="accent" size="sm">{IcChat} Call to action</Button>}
              localeSwitcher={<LanguageSwitcher languages={DEMO_LANGUAGES} />}
              items={[
                { label: "Home", href: "#header", active: true, icon: <IconHome size={18} strokeWidth={1.75} />, iconOnly: true },
                { label: "Dropdown", href: "#header", children: [
                  { label: "Dropdown item", href: "#header", icon: IcWind },
                  { label: "Dropdown item", href: "#header", icon: IcUsers },
                  { label: "Dropdown item", href: "#header", icon: IcSearch },
                ], seeAll: { label: "See-all link", href: "#header" } },
                { label: "Link", href: "#header" },
                { label: "Link", href: "#header" },
                { label: "Link", href: "#header" },
                { label: "Link", href: "#header" },
              ]}
            />
            <div className="p-6 text-sm text-ink-soft">Hover "Dropdown" for the dropdown. "Home" is just the house icon; the label stays for screen readers. Brand at the sites' header size (44px symbol), with the animated entrance (symbol, then the name) — "Replay the curtain" repeats it.</div>
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
              <LanguageSwitcher languages={DEMO_LANGUAGES} />
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
              <section key={id} id={id} className="scroll-mt-20 rounded-2xl border border-line p-8">
                <h3 className="font-heading text-2xl font-bold text-ink">{["First", "Second", "Third"][i]} section</h3>
                <p className="mt-3 max-w-[60ch] text-ink-body">Generic content just to give the page height so the nav has something to follow. Each section needs a <code className="rounded bg-ink/[0.07] px-1.5 py-0.5 text-sm">scroll-mt</code> that, added to the theme's 96px scroll-padding, clears the header plus the capsule (here scroll-mt-20).</p>
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

      <Section id="cards" title="Cards — FactStrip · InfoCard · MediaCard">
        <p className="mb-6 max-w-[62ch] text-ink-body">FactStrip: the three facts under the hero — icon bubble plus two lines of equal weight, a thin line between columns (between rows on phones). InfoCard: the white cards of the clinic page — a tinted icon bubble, a title, lines and outbound links. MediaCard: a photo or clip behind a title, a badge top-left and the arrow button top-right; the whole card is a link, the image zooms slowly on hover (mouse only), the clip plays muted.</p>
        <FactStrip
          className="mb-8"
          label="Facts"
          facts={[
            { Icon: IconActivity, title: "Fact title", text: "Supporting line" },
            { Icon: IconHome, title: "Fact title", text: "A longer supporting line", separator: " " },
            { Icon: IconUsers, title: "Longer fact title", text: "Supporting line" },
          ]}
        />
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          <InfoCard Icon={IconMapPin} title="Card title" address={["Line of text", "Second line of text", "Third line"]} links={[{ href: "https://github.com/felipegenuino/breathe-ds", label: "Outbound link", external: true }, { href: "https://www.npmjs.com/package/@breathe-ds/ui", label: "Another", external: true }]} />
          <InfoCard Icon={IconActivity} title="Card title" lines={["Line of text"]} note="A smaller note line under the text." />
          <InfoCard Icon={IconMessage} title="Card title" lines={["A paragraph of supporting text that runs over two or three lines inside the card."]} links={[{ href: "#cards", label: "Page link" }]} />
        </div>
        <div className="mt-8 mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">MediaCard</span>
          <SegGroup label="Media" value={mc.media} set={(v) => setMc((m) => ({ ...m, media: v }))} options={[["clip", "Clip"], ["hover", "Clip on hover"], ["image", "Image"]]} />
          {([["badge", "Badge"], ["arrow", "Arrow button"], ["eyebrow", "Eyebrow"], ["text", "Text"], ["link", "Link line"]] as [keyof typeof mc, string][]).map(([k, label]) => (
            <PillToggle key={k} label={label} on={mc[k] as boolean} set={(v) => setMc((m) => ({ ...m, [k]: v }))} />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          <MediaCard
            href="#cards"
            title="Card title"
            eyebrow={mc.eyebrow ? "Eyebrow" : undefined}
            text={mc.text ? <>Line of text<span className="block">Second line of text</span></> : undefined}
            linkLabel={mc.link ? "Link line" : undefined}
            arrowButton={mc.arrow}
            src="/demo/clip-poster.jpg"
            video={mc.media === "image" ? undefined : { src: "/demo/clip.mp4", poster: "/demo/clip-poster.jpg", when: mc.media === "hover" ? "hover" : "always" }}
            badge={mc.badge ? <MediaCardBadge Icon={IconMapPin}>Badge</MediaCardBadge> : undefined}
          />
        </div>
      </Section>

      <Section id="videos" title="Videos — VideoStoryCard · TestimonialCard">
        <p className="mb-6 max-w-[62ch] text-ink-body">VideoStoryCard: the vertical Instagram-style card — poster, round play button and duration badge; on hover (mouse) or focus the gradient grows and the lead appears; tap plays the video with sound in place; when it ends the card goes back to the poster with the "Watched" badge (also from the site, via the prop, or remembered in localStorage with "remember"). TestimonialCard: the clip with a play button on the left, the quote, the author and the outbound link on the right.</p>
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">VideoStoryCard</span>
          <SegGroup label="Layout" value={vs.layout} set={(v) => setVs((m) => ({ ...m, layout: v }))} options={[["stacked", "Stacked"], ["side", "Side"]]} />
          {([["speaker", "Speaker"], ["lead", "Lead"], ["preview", "Hover preview"], ["watched", "Watched"]] as [keyof typeof vs, string][]).map(([k, label]) => (
            <PillToggle key={k} label={label} on={vs[k] as boolean} set={(v) => setVs((m) => ({ ...m, [k]: v }))} />
          ))}
        </div>
        <div className={vs.layout === "side" ? "max-w-3xl" : "max-w-sm"}>
          <VideoStoryCard
            title="Card title"
            speaker={vs.speaker ? "Speaker name" : undefined}
            lead={vs.lead ? "A short lead that appears on hover or focus." : undefined}
            src="/demo/person-vertical.mp4"
            poster="/demo/person-poster-vertical.jpg"
            previewSrc={vs.preview ? "/demo/person-vertical.mp4" : undefined}
            layout={vs.layout}
            duration={10}
            watched={vs.watched}
          />
        </div>

        <div className="mt-10 mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">TestimonialCard</span>
          {([["link", "Outbound link"], ["two", "Two authors"], ["photo", "Portrait photo"]] as [keyof typeof tc, string][]).map(([k, label]) => (
            <PillToggle key={k} label={label} on={tc[k]} set={(v) => setTc((m) => ({ ...m, [k]: v }))} />
          ))}
        </div>
        <div className="max-w-2xl">
          <TestimonialCard
            quote="A short testimonial quote, two or three sentences long, in the voice of the person who wrote it."
            authors={tc.two ? [{ name: "Author name", photo: tc.photo ? "/demo/person-avatar.jpg" : undefined }, { name: "Second author", photo: tc.photo ? "/demo/person-avatar.jpg" : undefined }] : [{ name: "Author name", photo: tc.photo ? "/demo/person-avatar.jpg" : undefined }]}
            link={tc.link ? { href: "https://github.com/felipegenuino/breathe-ds", label: "Outbound link" } : undefined}
            video={{ src: "/demo/clip.mp4", poster: "/demo/clip-poster.jpg", description: "What the clip shows (1 min 39 s)" }}
          />
        </div>
      </Section>

      <Section id="map" title="MapCard">
        <p className="mb-6 max-w-[62ch] text-ink-body">The Mapa of novo.creeta: a still preview of the map fading into the card, the address, "View the map" and the outbound "Directions" link. Google is only called after the tap (cookies, weight). Open, the map fills the card with the same close bar as the hero video.</p>
        {/* the card is full width by default: it fills the grid cell it lives in.
            The selector only narrows the demo, to see it as a half-width cell. */}
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-surface p-4">
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-soft uppercase">Preview</span>
          <SegGroup label="Width" value={mapW} set={setMapW} options={[["half", "50%"], ["full", "100%"]]} />
        </div>
        <div className={`mx-auto transition-[max-width] duration-300 ease-cg motion-reduce:transition-none ${mapW === "half" ? "max-w-[50%]" : "max-w-full"}`}>
          <MapCard
            address="Street name, 33"
            locality="Neighbourhood, City/ST"
            preview={{ src: "/demo/map-preview.webp", width: 2200, height: 517 }}
            embedSrc="https://www.google.com/maps?q=Florian%C3%B3polis&z=12&output=embed"
            directionsHref="https://www.google.com/maps/search/?api=1&query=Florian%C3%B3polis"
            caption="Caption on the close bar"
          />
        </div>
      </Section>

      <Section id="care" title="CareSteps — ChatPreview · PlanTimeline · PhotoSequence">
        <p className="mb-6 max-w-[62ch] text-ink-body">How the care works, from novo.creeta: a bento mosaic of numbered steps, each with a drawing above and the text below, and the invite on the dark panel closing the sequence. The drawings are decoration and loop only while on screen, with a pause button (WCAG 2.2.2): a sample chat (the person writes, the clinic "types"), a still photo, the plan timeline (the line comes down, each dot lights up) and a photo sequence with a slow zoom (CSS only, paused by a checkbox). With reduced motion everything stands still, whole. Generic copy and generated images here.</p>
        <CareSteps
          headingLevel="h3"
          steps={[
            {
              title: "First contact",
              summary: "Talk to our team on WhatsApp.",
              text: "Talk to our team on WhatsApp. We are open Monday to Friday, 8am to 6pm.",
              visual: (
                <ChatPreview
                  hours="Monday to Friday, 8am to 6pm"
                  messages={[
                    { from: "person", text: "Hi! I'd like to book an assessment." },
                    { from: "clinic", text: "Hello! Of course. Who is it for?" },
                    { from: "person", text: "For my son, two years old." },
                    { from: "clinic", text: "We are open Monday to Friday, 8am to 6pm. Thursday at 9?" },
                    { from: "person", text: "Perfect!" },
                    { from: "clinic", text: "Booked. See you Thursday!" },
                  ]}
                />
              ),
            },
            {
              title: "Careful assessment",
              summary: "Every treatment starts with an assessment.",
              text: "Every treatment starts with an assessment. The therapist looks at the breathing pattern, the posture and the quality of movement.",
              visual: <img src="/demo/assessment.jpg" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />,
            },
            {
              title: "A plan built for you",
              summary: "Short, medium and long term.",
              text: "The assessment helps draw a therapeutic plan for the short, medium and long term.",
              visual: <PlanTimeline names={["Short", "Medium", "Long"]} suffix=" term" />,
            },
            {
              title: "Gentle treatment",
              summary: "At the clinic or at home.",
              text: "Sessions happen at the clinic or in the comfort of your home. Movement is introduced gradually, so it never adds respiratory effort.",
              visual: (
                <PhotoSequence
                  id="care-photos"
                  className="absolute inset-0 rounded-2xl"
                  photos={[
                    { src: "/demo/clip-poster.jpg", alt: "" },
                    { src: "/demo/invite-loop-poster.jpg", alt: "" },
                    { src: "/demo/podcast-poster.jpg", alt: "" },
                  ]}
                />
              ),
            },
          ]}
          invite={{
            text: "Your care can start now.",
            action: (
              <a href="#care" className="inline-flex min-h-12 items-center gap-2.5 rounded-pill bg-card px-5 font-body font-semibold text-ink transition-colors duration-200 hover:bg-ink/[0.12] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface motion-reduce:transition-none">
                <IconMessage size={19} /> Book
              </a>
            ),
          }}
        />
      </Section>

      <Section id="story" title="StoryPanel — a story in one dark panel">
        <p className="mb-6 max-w-[62ch] text-ink-body">The "origin" block of novo.creeta: one rounded panel on surface-panel that groups a whole story. Media at the top (a muted loop or a photo) with a film that fades into the panel, the logo at its base, a title, a lead, three pillars in columns with a hairline above each, and the outbound links. Good for "who we are" and "why us" blocks: everything inside one card.</p>
        <StoryPanel
          media={<BackgroundVideo src="/demo/invite-loop.mp4" poster="/demo/invite-loop-poster.jpg" className="absolute inset-0" />}
          logo={<span className="flex items-center gap-2 text-surface"><BreatheMark size={36} animated={false} /><span className="font-heading text-2xl font-bold">Brand</span></span>}
          title="The clinic of those who created, teach and apply the method."
          lead="A supporting sentence about what sets the place apart."
          pillars={[
            { title: "Created", text: "A paragraph about who created the method and where they work today." },
            { title: "Teaches", text: "A paragraph about the school, the courses and how many professionals have trained." },
            { title: "Applies", text: "A paragraph about the clinic where the method is practised every day." },
          ]}
          links={[
            { label: "Learn about the method", href: "#story" },
            { label: "Courses on the school site", href: "https://github.com/felipegenuino/breathe-ds", external: true },
          ]}
        />
      </Section>

      <Section id="blog" title="Blog — PostCard · FeaturedPosts · PostArticle">
        <p className="mb-6 max-w-[62ch] text-ink-body">The "guidance" area of novo.creeta: one subject per page, written from what a professional says in a video. FeaturedPosts is the "in the words of who treats you" block of a treatment page (bento: the first post wide with the cover beside the text; who said it and "Watch the video" at the foot, a Byline). PostCard is the card of the list: cover, category, title (the link, stretched over the whole card), excerpt in three lines, author and date. PostArticle is the page: trail, title, who signs (PersonChip) and when, the text with its notice, the video beside it (sticky from md) and the transcript, open. Generic copy and generated covers.</p>

        <p className="mb-3 text-xs font-semibold text-ink-soft">FeaturedPosts</p>
        <FeaturedPosts
          posts={[
            { cover: { src: "/demo/cover-1.svg" }, title: "A longer featured title that explains the subject", href: "#blog", text: "Three or four sentences in the voice of the person who explains it in the video, cut only where the speech needs it to read well on the page.", speaker: { name: "Person name", photo: "/demo/person-avatar.jpg" }, video: { href: "#videos" } },
            { cover: { src: "/demo/cover-2.svg" }, title: "Second subject, shorter", href: "#blog", text: "Two sentences in the voice of the person who explains it in the video.", speaker: { name: "Another person", photo: "/demo/person-avatar.jpg" }, video: { href: "#videos" } },
            { cover: { src: "/demo/cover-3.svg" }, title: "Third subject", href: "#blog", text: "A paragraph in the voice of the person who explains it, a little longer than the other one so the two cards do not look identical.", speaker: { name: "Person name", photo: "/demo/person-avatar.jpg" }, video: { href: "#videos" } },
          ]}
        />

        <p className="mt-10 mb-3 text-xs font-semibold text-ink-soft">PostCard · the list</p>
        <ul className="grid list-none gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {[["cover-2", "Category", "Post title over two lines when needed"], ["cover-3", "Category", "Short post title"], ["cover-1", "Another category", "Post title"]].map(([c, cat, title], i) => (
            <li key={i}>
              <PostCard cover={{ src: `/demo/${c}.svg` }} category={cat} title={title} href="#blog" excerpt="The first paragraph of the post, clamped to three lines on the card so every card in the row keeps the same rhythm whatever the length of the text." author="Person name" date={{ iso: "2026-10-29", label: "29 October 2026" }} labels={{ read: "Read the post" }} />
            </li>
          ))}
        </ul>

        <p className="mt-10 mb-3 text-xs font-semibold text-ink-soft">PostArticle · the page</p>
        <PostArticle
          trail={<Breadcrumb items={[{ label: "Posts", href: "#blog" }, { label: "Parent page", href: "#blog" }]} />}
          title="Post title: a subject that asks for attention"
          signature={<PersonChip name="Person name" description="Role · Registration number" href="#people" photo="/demo/person-avatar.jpg" />}
          date={{ iso: "2026-10-29", label: "29 October 2026" }}
          paragraphs={[
            "The first paragraph is the lead: larger, it answers at once what the title asks, in the voice of the person who explains it in the video.",
            "The following paragraphs keep the reading at body size. Two or three of them, each one a step of the explanation.",
          ]}
          notice="This text guides, but does not replace an assessment by a professional."
          aside={<VideoStoryCard title="Card title" speaker="Speaker name" src="/demo/person-vertical.mp4" poster="/demo/person-poster-vertical.jpg" duration={10} />}
          transcript={{ title: "Video transcript", paragraphs: ["Hello, my name is the speaker and this is the first paragraph of what is said in the video, in full, so whoever prefers to read does not need to listen.", "The second paragraph of the speech, and the invitation at the end."] }}
        />
      </Section>

      <Section id="course" title="CourseCard — the class card">
        <p className="mb-6 max-w-[62ch] text-ink-body">The class card (ttcab's "Formação", the school's class list) in the family's own vocabulary: the course name as the category line, the city as the title with the seats pill, the facts as tiles (the calendar tile for the start, the pin for the venue with its map link, a clock for the workload), who teaches as a Byline, a cover at the top, and at the foot the price with its note beside the Button accent. Click a card: it opens the SidePanel (Luma's drawer) with everything about the class and the button that goes straight to the school's cart. Real classes from the school's public pages (29 Oct 2026); covers are generated images; instructors from the portraits on each class page.</p>
        <div className="grid gap-3 md:grid-cols-2 md:gap-5">
          {COURSES.map((c) => (
            <CourseCard
              key={c.id}
              cover={{ src: c.cover, position: c.coverPosition }}
              course={c.course}
              title={c.city}
              seats={c.seats}
              soldOut={c.soldOut}
              start={c.start}
              when={c.when}
              where={c.where ? { ...c.where, external: !!c.where.href } : undefined}
              workload={c.workload}
              price={{ value: c.price.value, note: c.price.note }}
              instructors={c.instructors}
              labels={{ with: "Com" }}
              footnote={c.audience}
              onSelect={() => setOpenCourse(c.id)}
              action={c.cart ? <Button variant="accent" href={c.cart} target="_blank" rel="noopener noreferrer">Garantir minha vaga</Button> : <Button variant="outline" href={c.page} target="_blank" rel="noopener noreferrer">Ver a página</Button>}
            />
          ))}
        </div>

        <SidePanel
          open={!!selected}
          onClose={() => setOpenCourse(null)}
          title={selected ? `${selected.course} · ${selected.city}` : "Class"}
          actions={selected && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(selected.page)}>Copy link</Button>
              <Button variant="outline" size="sm" href={selected.page} target="_blank" rel="noopener noreferrer">Course page <IconArrowUpRight size={14} /></Button>
            </>
          )}
        >
          {selected && (
            <div className="p-5 md:p-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-ink/[0.06]">
                <img src={selected.cover} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: selected.coverPosition ?? "50% 25%" }} />
              </div>
              <h3 className="mt-5 font-heading text-[1.75rem] font-medium leading-[1.12] tracking-[-0.01em] text-ink">{selected.course}</h3>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-lg font-semibold text-ink">
                {selected.city}
                {(selected.seats || selected.soldOut) && <span className="inline-flex items-center rounded-pill bg-ink/[0.08] px-2.5 py-0.5 text-xs font-semibold text-ink">{selected.soldOut ? "Esgotada" : selected.seats}</span>}
              </p>
              <EventFacts
                className="mt-5"
                facts={[
                  { tile: <DateBadge month={selected.start.month} day={selected.start.day} />, title: selected.when.title, subtitle: selected.when.subtitle },
                  ...(selected.where ? [{ tile: "pin" as const, title: selected.where.title, subtitle: selected.where.subtitle, href: selected.where.href, external: true }] : []),
                ]}
              />
              <Byline className="mt-5" eyebrow="Quem ministra" people={selected.instructors} />
              <RegistrationBox
                className="mt-6"
                title="Inscrição"
                intro={selected.soldOut ? "Turma esgotada. Fale com a escola para entrar na lista de espera." : "Escolha como pagar:"}
                options={[
                  { id: "cash", label: "À vista", remaining: "cartão ou PIX", price: selected.price.cash, disabled: selected.soldOut },
                  { id: "boleto", label: "Boleto sem juros", remaining: `entrada ${selected.price.down} via PIX`, price: selected.price.cash, disabled: selected.soldOut },
                  { id: "card", label: "Cartão em até 12x", remaining: "com juros", price: selected.price.cash, disabled: selected.soldOut },
                ]}
                action={selected.cart && !selected.soldOut
                  ? <Button variant="accent" href={selected.cart} target="_blank" rel="noopener noreferrer">Garantir minha vaga <IconArrowUpRight size={16} /></Button>
                  : <Button variant="solid" href="https://wa.me/5548999164520" target="_blank" rel="noopener noreferrer">Falar com a escola <IconArrowUpRight size={16} /></Button>}
                footnote={`${selected.audience} Carga horária: ${selected.workload}.`}
              />
              <section className="mt-8">
                <h4 className="font-heading text-lg font-medium text-ink">Sobre o curso</h4>
                <p className="mt-2 leading-relaxed text-ink-body">{selected.about}</p>
              </section>
              {selected.programme.length > 0 && (
                <section className="mt-6">
                  <h4 className="font-heading text-lg font-medium text-ink">Programa</h4>
                  <List marker="arrow" className="mt-3" items={selected.programme.map((label) => ({ label }))} />
                </section>
              )}
              {selected.discounts.length > 0 && (
                <section className="mt-6">
                  <h4 className="font-heading text-lg font-medium text-ink">Descontos</h4>
                  <List marker="check" className="mt-3" items={selected.discounts.map((label) => ({ label }))} />
                </section>
              )}
              <section className="mt-6 mb-2">
                <h4 className="font-heading text-lg font-medium text-ink">Matrícula</h4>
                <List className="mt-3" items={selected.rules.map((label) => ({ label }))} />
              </section>
            </div>
          )}
        </SidePanel>

        <p className="mt-10 mb-3 text-xs font-semibold text-ink-soft">EventList · the eight classes of the Basic course in 2027 (R$ 8.350 · 69 class hours)</p>
        <div className="max-w-3xl">
          <EventList
            label="Curso Básico de RTA 2027"
            groups={BASICO_2027.map((g) => ({
              date: g.month, iso: g.iso,
              events: g.items.map((it) => ({ time: it.date, timeAccent: "08h30–17h30", title: it.city, href: "https://metodorta.com.br/cursos-e-eventos/basico-2027/", organizers: it.people, location: it.venue, badge: `${it.seats} vagas` })),
            }))}
          />
        </div>
      </Section>

      <Section id="events" title="Events — EventList · EventRow · EventFacts · RegistrationBox">
        <p className="mb-6 max-w-[62ch] text-ink-body">An events area after Luma and Meetup, for the school's classes: the list grouped by day down a dotted rail, each row with the time, the title (the link, stretched over the row), who organizes, where, who is going and the square cover; and, on the event page, the facts as tiles (the date on a calendar tile, the venue on a pin tile with its link) and the registration box, a radio group of ticket options with the one button at the foot. The DateBadge is the calendar tile on its own.</p>

        <p className="mb-3 text-xs font-semibold text-ink-soft">EventList · grouped by day</p>
        <div className="max-w-3xl">
          <EventList
            groups={[
              { date: "6 Nov", weekday: "Friday", iso: "2026-11-06", events: [
                { time: "09:00", timeAccent: "12:00 GMT-3", title: "Event title with a venue name", href: "#events", organizers: [{ name: "Organizer name", photo: "/demo/person-avatar.jpg" }], location: "City, Country", people: [{ name: "Person one", photo: "/demo/person-avatar.jpg" }, { name: "Person two", photo: "/demo/person-avatar.jpg" }, { name: "Person three", photo: "/demo/person-avatar.jpg" }], peopleMore: 34, cover: { src: "/demo/cover-1.svg" } },
                { time: "3 to 9 Nov", timeAccent: "08:30–17:30", title: "Course name · City", href: "#events", organizers: [{ name: "Person name", photo: "/demo/person-avatar.jpg" }, { name: "Another person", photo: "/demo/person-avatar.jpg" }], location: "Venue name, City · ST", people: [{ name: "Person one", photo: "/demo/person-avatar.jpg" }, { name: "Person two", photo: "/demo/person-avatar.jpg" }], peopleMore: 26, cover: { src: "/demo/cover-2.svg" }, badge: "Sold out" },
              ] },
              { date: "7 Nov", weekday: "Saturday", iso: "2026-11-07", events: [
                { time: "10:00", timeAccent: "16:00 GMT-3", title: "Another event title", href: "#events", organizers: [{ name: "Organizer name" }], location: "Online", cover: { src: "/demo/cover-3.svg" } },
              ] },
            ]}
          />
        </div>

        <p className="mt-10 mb-3 text-xs font-semibold text-ink-soft">Event page · EventFacts + RegistrationBox</p>
        <div className="grid gap-3 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-5">
          <div className="relative aspect-square overflow-hidden rounded-[28px] bg-ink/[0.06]">
            <img src="/demo/cover-1.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="rounded-[28px] bg-card p-6 md:p-8">
            <h3 className="font-heading text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-4xl">Event title with a venue name</h3>
            <Byline className="mt-4" people={[{ name: "Organizer name", photo: "/demo/person-avatar.jpg" }]} />
            <EventFacts
              className="mt-6"
              facts={[
                { tile: <DateBadge month="Nov" day="6" />, title: "Friday, 6 November", subtitle: "12:00 – 14:00 GMT-3" },
                { tile: "pin", title: "Venue name", subtitle: "City, Country", href: "https://www.google.com/maps/search/?api=1&query=Florian%C3%B3polis", external: true },
              ]}
            />
            <RegistrationBox
              className="mt-6"
              title="Registration"
              intro="Hi! Choose your ticket:"
              options={[
                { id: "in-person", label: "In person", remaining: "6 left", price: "Free" },
                { id: "online", label: "Online", price: "Free" },
                { id: "vip", label: "With the workshop", price: "R$ 390", disabled: true },
              ]}
              action={<Button variant="accent">Register</Button>}
              footnote="Only physiotherapists can attend."
            />
          </div>
        </div>
      </Section>

      <Section id="cta" title="CtaCard — final call">
        <p className="mb-6 max-w-[62ch] text-ink-body">The final call of a novo.creeta page: a white card with the title, the lead and the CTA, beside a video card — a muted loop with the speaker's name over it, a pause control, and a play button that plays the full video with sound. Without the video it is the card alone.</p>
        <CtaCard
          title="Card title"
          lead="A short lead that sums up the invitation in one sentence."
          action={<Button variant="accent" href="#cta">{IcChat} Call to action</Button>}
          video={{ title: "Overlay title", description: "Overlay description", loop: { src: "/demo/invite-loop.mp4", poster: "/demo/invite-loop-poster.jpg" }, video: { src: "/demo/invite.mp4", poster: "/demo/invite-poster.jpg" } }}
        />
      </Section>

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
              ["Pages column", [["pages", "Page links"]]],
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
          pages={ft.pages ? { title: "On this page", groups: FOOTER_GROUPS } : undefined}
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
