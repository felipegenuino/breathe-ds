import { useEffect, useState, type ReactNode } from "react";
import { BRANDS, BRAND_BY_ID, FAMILY_PETROL, contrast, formatRatio, wcagLevel, isPending, type Brand, type BrandColor, type BrandSvg } from "../../brand";
import { Lockup } from "../../components/Lockup";
import { TtcabSymbol, TtcabWordmark, TTCAB_LOCKUP } from "../../components/marks/ttcab";
import { CreetaSymbol, CreetaWordmark, CREETA_LOCKUP } from "../../components/marks/creeta";
import { RtaSymbol, RtaWordmark, RTA_LOCKUP } from "../../components/marks/rta";

/* "Brand guidelines": reads brand/ (the manuals as data). The palette picked at
   the top selects the brand; Cuidado Global and RTA Mundi have no palette in the
   selector, so every brand is also in the list inside the section. */

const BRAND_FOR_PALETTE: Record<string, Brand["id"]> = { Neutral: "cuidado-global", TTCAB: "ttcab", Creeta: "creeta", RTA: "rta" };

const MARKS: Partial<Record<Brand["id"], { logo: ReactNode; wordmark: ReactNode; ratio: number; side: "left" | "right"; symbol: ReactNode; word: ReactNode; names: [string, string, string, string] }>> = {
  ttcab: { logo: <TtcabSymbol size={60} />, wordmark: <TtcabWordmark />, ratio: TTCAB_LOCKUP.wordmarkPerSymbol, side: TTCAB_LOCKUP.symbolSide, symbol: <TtcabSymbol size={64} />, word: <TtcabWordmark height="28px" />, names: ["TtcabSymbol", "TtcabWordmark", "Lockup horizontal", "Lockup stacked"] },
  creeta: { logo: <CreetaSymbol size={60} />, wordmark: <CreetaWordmark />, ratio: CREETA_LOCKUP.wordmarkPerSymbol, side: CREETA_LOCKUP.symbolSide, symbol: <CreetaSymbol size={64} />, word: <CreetaWordmark height="28px" />, names: ["CreetaSymbol", "CreetaWordmark", "Lockup horizontal", "Lockup stacked"] },
  rta: { logo: <RtaSymbol size={60} />, wordmark: <RtaWordmark />, ratio: RTA_LOCKUP.wordmarkPerSymbol, side: RTA_LOCKUP.symbolSide, symbol: <RtaSymbol size={52} />, word: <RtaWordmark height="28px" />, names: ["RtaSymbol", "RtaWordmark", "Lockup horizontal", "Lockup stacked"] },
};

const ROLE_LABEL: Record<BrandColor["role"], string> = {
  primary: "Primary (cores principais)",
  complementary: "Complementary (tons complementares)",
  "vector-fill": "Vector fill (no written role)",
};

const LABEL = "mb-3 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase";
const CODE = "rounded bg-ink/[0.07] px-1.5 py-0.5 font-mono text-xs";

function Ratio({ a, b, label }: { a: string; b: string; label: string }) {
  if (a.toUpperCase() === b.toUpperCase()) return <span className="text-ink-soft">{label}: same color</span>;
  const r = contrast(a, b);
  return <span>{label}: <b className="text-ink">{formatRatio(r)}</b> {wcagLevel(r)}</span>;
}

function Page({ n }: { n: number }) {
  return <span className="text-ink-soft">p. {n}</span>;
}

function Pend({ reason }: { reason: string }) {
  return <p className="m-0 text-sm text-ink-body"><span className="mr-2 rounded-pill bg-ink/[0.07] px-2 py-0.5 text-xs font-bold text-ink">pending</span>{reason}</p>;
}

/* Downloads live in playground/public/brand/ (not in the npm package); the
   paths in the data are relative, so they follow the Vite base (/breathe-ds/ online). */
const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;
const fileSize = (bytes: number) => (bytes < 1_000_000 ? `${Math.round(bytes / 1000)} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`);
const TONE_LABEL: Record<BrandSvg["tone"], string> = { color: "logo colors", white: "all white", reverse: "reverse", "on-color": "on color" };

function Downloads({ b }: { b: Brand }) {
  const d = b.downloads;
  return (
    <div>
      <p className={LABEL}>Downloads</p>
      <a href={asset(d.manual.file)} download className="inline-flex rounded-pill bg-ink px-4 py-2 text-sm font-semibold text-surface">
        Brand manual (PDF, {fileSize(d.manual.bytes)})
      </a>
      {d.svgs.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.svgs.map((s) => (
            <div key={s.file} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card">
              <div className="flex h-28 items-center justify-center border-b border-line p-4" style={{ background: s.background }}>
                <img src={asset(s.file)} alt={`${b.name}: ${s.name}`} loading="lazy" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4 text-xs text-ink-body">
                <p className="m-0 font-heading text-sm font-bold text-ink">{s.name}</p>
                <p className="m-0 text-ink-soft">{TONE_LABEL[s.tone]} · for <span className="font-mono">{s.background}</span> · {s.origin === "ds" ? "drawn by the DS" : "official board"}</p>
                <a href={asset(s.file)} download className="mt-auto pt-2 font-semibold text-ink underline underline-offset-2">Download SVG <span className="font-mono font-normal text-ink-soft">{s.file.split("/").pop()}</span></a>
              </div>
            </div>
          ))}
        </div>
      )}
      {d.pending && d.pending.length > 0 && (
        <div className="mt-4 space-y-2">
          {d.pending.map((x) => <Pend key={x} reason={x} />)}
        </div>
      )}
    </div>
  );
}

function ColorCard({ c }: { c: BrandColor }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="h-16 border-b border-line" style={{ background: c.hex }} />
      <div className="space-y-1 p-4 text-xs text-ink-body">
        <p className="m-0 font-heading text-sm font-bold text-ink">{c.id} <span className="font-mono">{c.hex}</span></p>
        <p className="m-0 text-ink-soft">{ROLE_LABEL[c.role]} · <Page n={c.source.page} /></p>
        {c.printed.rgb && <p className="m-0 font-mono">{c.printed.rgb}</p>}
        {c.printed.cmyk && <p className="m-0 font-mono">{c.printed.cmyk}</p>}
        {(c.printed.pantoneCoated || c.printed.pantoneUncoated) && <p className="m-0">Pantone {c.printed.pantoneCoated} / {c.printed.pantoneUncoated}</p>}
        {c.usage && <p className="m-0">{c.usage}</p>}
        <p className="m-0"><Ratio a={c.hex} b="#FFFFFF" label="vs white" /> · <Ratio a={c.hex} b={FAMILY_PETROL} label={`vs ${FAMILY_PETROL}`} /></p>
        {c.manualInconsistency && <p className="m-0 mt-2 border-t border-line pt-2"><b className="text-ink">Manual inconsistency:</b> {c.manualInconsistency}</p>}
        {c.note && <p className="m-0 mt-2 border-t border-line pt-2 text-ink-soft">{c.note}</p>}
      </div>
    </div>
  );
}

export function BrandGuidelines({ pal }: { pal: string }) {
  const [id, setId] = useState<Brand["id"]>(BRAND_FOR_PALETTE[pal] ?? "cuidado-global");
  useEffect(() => { setId(BRAND_FOR_PALETTE[pal] ?? "cuidado-global"); }, [pal]);
  const b = BRAND_BY_ID[id];
  const marks = MARKS[id];

  return (
    <div className="space-y-10">
      <p className="m-0 max-w-[64ch] text-ink-body">The family's brand manuals as data (<code className={CODE}>@breathe-ds/ui/brand</code>), each value with the manual page it came from. The palette at the top picks the brand; Cuidado Global and RTA Mundi have no palette, so every brand is in the list below. Contrast is measured against white and the family petrol <code className={CODE}>{FAMILY_PETROL}</code>.</p>

      <div>
        <p className={LABEL}>Brand</p>
        <div className="inline-flex flex-wrap gap-1 rounded-[22px] border border-line p-0.5" role="group" aria-label="Brand">
          {BRANDS.map((x) => (
            <button key={x.id} type="button" aria-pressed={id === x.id} onClick={() => setId(x.id)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors ${id === x.id ? "bg-ink text-surface" : "text-ink-soft hover:text-ink"}`}>{x.name}</button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-card p-6 md:p-8">
        <p className="m-0 font-heading text-2xl font-bold text-ink">{b.name}</p>
        <p className="m-0 mt-1 text-ink-body">{b.fullName}</p>
        <p className="m-0 mt-3 text-xs text-ink-soft">Manual <span className="font-mono">{b.manual.file}</span> · {b.manual.pages} {b.manual.pages === 1 ? "page" : "pages"} · file date {b.manual.fileDate} · credit {isPending(b.manual.credit) ? "pending" : b.manual.credit}</p>
        {isPending(b.concept) ? <div className="mt-4"><Pend reason={b.concept.reason} /></div> : (
          <div className="mt-4 max-w-[68ch] space-y-3 text-sm leading-[1.6] text-ink-body" lang="pt-BR">
            {b.concept.text.split("\n\n").map((t, i) => <p key={i} className="m-0">{t}</p>)}
            <p className="m-0 text-xs text-ink-soft">Concept (conceito), literal · p. {b.concept.source.page}</p>
          </div>
        )}
      </div>

      <Downloads b={b} />

      <div>
        <p className={LABEL}>Colors</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {b.colors.map((c) => <ColorCard key={c.id} c={c} />)}
        </div>
      </div>

      <div>
        <p className={LABEL}>Gradients</p>
        {isPending(b.gradients) ? <Pend reason={b.gradients.reason} /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {b.gradients.map((g, i) => (
              <div key={i}>
                <div className="h-10 rounded-xl border border-line" style={{ background: `linear-gradient(90deg, ${g.stops.join(", ")})` }} />
                <p className="m-0 mt-1.5 text-xs text-ink-body"><span className="font-mono">{g.stops.join(" → ")}</span> · <Page n={g.source.page} /></p>
                {g.manualInconsistency && <p className="m-0 mt-1 text-xs text-ink-body"><b className="text-ink">Manual inconsistency:</b> {g.manualInconsistency}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className={LABEL}>Typography in the manual</p>
        {isPending(b.typography) ? <Pend reason={b.typography.reason} /> : (
          <div className="space-y-3">
            {b.typography.faces.map((f) => (
              <div key={f.role} className="rounded-2xl border border-line bg-card p-4">
                <p className="m-0 font-heading text-base font-bold text-ink">{f.family} <span className="text-sm font-semibold text-ink-soft">· {f.role}{f.licence === "commercial" ? " · commercial font" : f.licence === "system" ? " · system font" : " · open font"}</span></p>
                <p className="m-0 mt-1 text-sm text-ink-body">{f.weights.join(", ")}{f.preferred ? ` — preferred: ${f.preferred}` : ""}</p>
                <p className="m-0 mt-1 text-xs text-ink-soft" lang="pt-BR">“{f.rule}” · p. {f.source.page}</p>
              </div>
            ))}
            {b.typography.restrictions.map((r) => <p key={r} className="m-0 text-sm text-ink-body" lang="pt-BR"><b className="text-ink">Restriction:</b> {r}</p>)}
            <p className="m-0 text-sm text-ink-body">The manuals' commercial fonts (Gotham, Mouser) are a print reference only. Family work uses free Google Fonts: in the DS, <b className="text-ink">Quicksand</b> (headings) + <b className="text-ink">Figtree</b> (text). Owner decision, 2026-11-11.</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className={LABEL}>Clear space</p>
          {isPending(b.clearSpace) ? <Pend reason={b.clearSpace.reason} /> : (
            <p className="m-0 text-sm text-ink-body">At least the <b className="text-ink">{b.clearSpace.unit}</b> on every side · <Page n={b.clearSpace.source.page} /></p>
          )}
        </div>
        <div>
          <p className={LABEL}>Minimum size (print)</p>
          {isPending(b.reduction) ? <Pend reason={b.reduction.reason} /> : (
            <div className="space-y-1 text-sm text-ink-body">
              {b.reduction.sizes.map((s, i) => (
                <p key={i} className="m-0"><b className="text-ink">{s.mm} mm</b> · {s.layout}{s.chancela === "with" ? " · with chancela" : s.chancela === "without" ? " · without chancela" : ""}</p>
              ))}
              <p className="m-0 text-xs text-ink-soft">May be relaxed in digital media after testing · p. {b.reduction.source.page}</p>
              {b.reduction.chancelaShownAs && <p className="m-0 text-xs text-ink-soft">{b.reduction.chancelaShownAs}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className={LABEL}>Chancela · sub-brands · partners</p>
          {isPending(b.lockupRules) ? <Pend reason={b.lockupRules.reason} /> : (
            <div className="space-y-3">
              {b.lockupRules.map((r) => <p key={r.title} className="m-0 text-sm text-ink-body"><b className="text-ink">{r.title}</b> — {r.summary} <Page n={r.source.page} /></p>)}
            </div>
          )}
        </div>
        <div>
          <p className={LABEL}>Graphic elements</p>
          {isPending(b.graphicElements) ? <Pend reason={b.graphicElements.reason} /> : (
            <div className="space-y-3">
              {b.graphicElements.map((r) => <p key={r.title} className="m-0 text-sm text-ink-body"><b className="text-ink">{r.title}</b> — {r.summary} <Page n={r.source.page} /></p>)}
            </div>
          )}
        </div>
      </div>

      <div>
        <p className={LABEL}>Variations in the manual</p>
        <ul className="m-0 list-none space-y-2 p-0">
          {b.variations.map((v) => (
            <li key={v.name} className="text-sm text-ink-body">
              <b className="text-ink">{v.name}</b>{v.backgrounds ? ` — on ${v.backgrounds.join(", ")}` : ""} · <Page n={v.source.page} />
              {v.ds && <span className="ml-2 rounded-pill bg-ink/[0.07] px-2 py-0.5 text-xs font-semibold text-ink">DS: {v.ds}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className={LABEL}>Drawn by the DS today (components/marks)</p>
        {marks ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[marks.symbol, marks.word,
              <Lockup variant="horizontal" size="md" name={b.name} logo={marks.logo} wordmark={marks.wordmark} wordmarkRatio={marks.ratio} symbolSide={marks.side} />,
              <Lockup variant="stacked" size="md" name={b.name} logo={marks.logo} wordmark={marks.wordmark} wordmarkRatio={marks.ratio} symbolSide={marks.side} />,
            ].map((node, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-line bg-card p-5">
                <div className="flex min-h-[110px] flex-1 items-center justify-center text-ink">{node}</div>
                <p className="m-0 mt-3 border-t border-line pt-2 font-mono text-xs text-ink-soft">{marks.names[i]}</p>
              </div>
            ))}
          </div>
        ) : <Pend reason={b.downloads.svgs.length ? `No component draws the ${b.name} mark yet; the official SVGs are in Downloads above.` : `No vector of the ${b.name} mark in the DS yet (needs the official vector; not redrawn).`} />}
      </div>

      {b.pending.length > 0 && (
        <div>
          <p className={LABEL}>Pending for this brand</p>
          <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-ink-body">
            {b.pending.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
