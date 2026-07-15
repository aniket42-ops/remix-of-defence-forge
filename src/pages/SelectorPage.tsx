import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, CheckCircle2, RotateCcw, Info } from "lucide-react";
import {
  ALL_PRODUCTS,
  TECHNOLOGY_OPTIONS,
  MOUNTING_OPTIONS,
  recommend,
  calculateDuty,
  type Mounting,
  type Technology,
  type GuyedState,
  type SelectorInput,
  type Product,
} from "@/lib/recommendation-engine";

type Selections = {
  payload: string;
  technology: Technology | "";
  eh: string;
  rh: string;
  mounting: Mounting | "";
  guyed: GuyedState | "";
  windArea: string;
  windSpeed: string;
  sway: string;
  accessories: string[];
};

const ACCESSORIES = [
  "Adapters & Bracket",
  "Compressor",
  "Earthing Kit",
  "Guy Controller",
  "Lightning Arrestor",
  "Pneumatic Controller",
];

const emptySel: Selections = {
  payload: "",
  technology: "",
  eh: "",
  rh: "",
  mounting: "",
  guyed: "",
  windArea: "",
  windSpeed: "",
  sway: "",
  accessories: [],
};

const STEPS = [
  "Payload Weight",
  "Mast Technology",
  "Required Erected Height (EH)",
  "Required Retracted Height (RH)",
  "Mounting",
  "Guyed / Unguyed",
  "Wind Area",
  "Max Operating Wind Speed",
  "Permissible Sway",
  "Accessories",
] as const;

const SelectorPage = () => {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selections>(emptySel);
  const [done, setDone] = useState(false);

  const update = <K extends keyof Selections>(k: K, v: Selections[K]) => setSel((s) => ({ ...s, [k]: v }));

  // Techs available for the entered payload
  const availableTechs = useMemo<Technology[]>(() => {
    const p = parseFloat(sel.payload);
    if (isNaN(p)) return TECHNOLOGY_OPTIONS;
    const techs = new Set<Technology>();
    ALL_PRODUCTS.forEach((prod) => {
      if (prod.head_load_kg >= p) prod.technologies.forEach((t) => techs.add(t));
    });
    return TECHNOLOGY_OPTIONS.filter((t) => techs.has(t));
  }, [sel.payload]);

  const ehOptions = useMemo(() => {
    if (!sel.technology) return [];
    const p = parseFloat(sel.payload);
    const vs = ALL_PRODUCTS.filter(
      (v) =>
        v.technologies.includes(sel.technology as Technology) &&
        (isNaN(p) || v.head_load_kg >= p) &&
        v.extended_height_m !== null,
    );
    return Array.from(new Set(vs.map((v) => v.extended_height_m as number))).sort((a, b) => a - b);
  }, [sel.technology, sel.payload]);

  const rhOptions = useMemo(() => {
    if (!sel.technology || !sel.eh) return [];
    const p = parseFloat(sel.payload);
    const vs = ALL_PRODUCTS.filter(
      (v) =>
        v.technologies.includes(sel.technology as Technology) &&
        v.extended_height_m === Number(sel.eh) &&
        (isNaN(p) || v.head_load_kg >= p) &&
        v.retracted_height_m !== null,
    );
    return Array.from(new Set(vs.map((v) => v.retracted_height_m as number))).sort((a, b) => a - b);
  }, [sel.technology, sel.eh, sel.payload]);

  const canNext = () => {
    switch (step) {
      case 0: return !!sel.payload && parseFloat(sel.payload) > 0;
      case 1: return !!sel.technology;
      case 2: return !!sel.eh;
      case 3: return !!sel.rh;
      case 4: return !!sel.mounting;
      case 5: return !!sel.guyed;
      case 6: return !!sel.windArea;
      case 7: return !!sel.windSpeed;
      case 8: return !!sel.sway;
      case 9: return true;
      default: return false;
    }
  };

  const buildInput = (): SelectorInput => {
    const num = (s: string) => (s ? parseFloat(s) : undefined);
    return {
      payload_kg: num(sel.payload),
      technology: (sel.technology || undefined) as Technology | undefined,
      mounting: (sel.mounting || undefined) as Mounting | undefined,
      guyed: (sel.guyed || undefined) as GuyedState | undefined,
      extended_height_m: num(sel.eh),
      retracted_height_m: num(sel.rh),
      wind_area_m2: num(sel.windArea),
      wind_speed_kmph: num(sel.windSpeed),
      sway_deg: num(sel.sway),
    };
  };

  const result = useMemo(() => (done ? recommend(buildInput()) : null), [done, sel]);
  const derivedDuty = sel.payload ? calculateDuty(parseFloat(sel.payload)) : undefined;

  const reset = () => { setSel(emptySel); setStep(0); setDone(false); };

  if (done && result) {
    return (
      <div className="container py-8 max-w-5xl">
        <nav className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Mast Selector — Summary</span>
        </nav>

        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Selection Complete</p>
            <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
              Your Mast Requirements
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {[
            ["Payload Weight", sel.payload && `${sel.payload} kg`],
            ["Calculated Duty", derivedDuty],
            ["Mast Technology", sel.technology],
            ["Erected Height (EH)", sel.eh && `${sel.eh} m`],
            ["Retracted Height (RH)", sel.rh && `${sel.rh} m`],
            ["Mounting", sel.mounting],
            ["Configuration", sel.guyed],
            ["Wind Area", sel.windArea && `${sel.windArea} m²`],
            ["Max Operating Wind Speed", sel.windSpeed && `${sel.windSpeed} km/h`],
            ["Permissible Sway", sel.sway && `${sel.sway}°`],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="font-heading text-base font-semibold text-foreground mt-1">{value || "—"}</p>
            </div>
          ))}
        </div>

        {sel.accessories.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5 mb-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Additional Accessories</p>
            <div className="flex flex-wrap gap-2">
              {sel.accessories.map((a) => (
                <span key={a} className="rounded border border-primary/40 bg-primary/5 px-3 py-1 text-sm text-foreground">{a}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground mb-2">
            {result.exact.length > 0 ? "Recommended Mast" : "Closest Matches"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{result.message}</p>

          {result.exact.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {result.exact.map((p) => (
                <div key={p.model_id} className="rounded-lg border border-primary/40 bg-primary/5 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary">New Model Number</p>
                  <p className="font-heading text-lg font-bold text-foreground mb-3">{p.model_id}</p>
                  <SpecGrid p={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {result.suggestions.map(({ product: p, reasons }) => (
                <div key={p.model_id} className="rounded-lg border border-border bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary">New Model Number</p>
                  <p className="font-heading text-base font-bold text-foreground mb-3">{p.model_id}</p>
                  <SpecGrid p={p} />
                  {reasons.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-border pt-3">
                      {reasons.map((r) => (
                        <p key={r} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" />
                          {r}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
            <RotateCcw className="h-4 w-4" /> Start Over
          </button>
          <Link to="/category/telescopic-masts" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-foreground hover:bg-muted">
            Browse Full Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="container py-8 max-w-3xl">
      <nav className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Mast Selector</span>
      </nav>

      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Guided Configuration</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          Mast Selector
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Answer a few questions to find the right telescopic mast for your application.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 md:p-8 min-h-[280px]">
        <h2 className="font-heading text-lg md:text-xl font-bold uppercase tracking-wider text-foreground mb-6">
          {STEPS[step]}
        </h2>

        {step === 0 && (
          <NumField label="Payload / Head Load" unit="kg" value={sel.payload} onChange={(v) => {
            setSel((s) => ({ ...s, payload: v, technology: "", eh: "", rh: "" }));
          }} placeholder="e.g. 15" />
        )}

        {step === 1 && (
          availableTechs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mast technology available for {sel.payload} kg payload. Please go back and reduce the payload weight, or contact our team for a custom configuration.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your payload of <span className="text-foreground font-medium">{sel.payload} kg</span> ({derivedDuty}), the following mast technologies are suitable:
              </p>
              <Choice
                options={availableTechs.map((t) => ({ v: t, label: t }))}
                value={sel.technology}
                onChange={(v) => setSel((s) => ({ ...s, technology: v as Technology, eh: "", rh: "" }))}
              />
            </>
          )
        )}

        {step === 2 && (
          ehOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No erected heights available for this configuration.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">Available erected heights from the catalogue:</p>
              <Choice
                options={ehOptions.map((h) => ({ v: String(h), label: `${h} m` }))}
                value={sel.eh}
                onChange={(v) => setSel((s) => ({ ...s, eh: v, rh: "" }))}
              />
            </>
          )
        )}

        {step === 3 && (
          rhOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No retracted heights available for this configuration.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">Available retracted heights for {sel.eh} m EH:</p>
              <Choice
                options={rhOptions.map((h) => ({ v: String(h), label: `${h} m` }))}
                value={sel.rh}
                onChange={(v) => update("rh", v)}
              />
            </>
          )
        )}

        {step === 4 && (
          <Choice
            options={MOUNTING_OPTIONS.map((m) => ({ v: m, label: m }))}
            value={sel.mounting}
            onChange={(v) => update("mounting", v as Mounting)}
          />
        )}

        {step === 5 && (
          <Choice
            options={[{ v: "Guyed", label: "Guyed" }, { v: "Unguyed", label: "Unguyed" }]}
            value={sel.guyed}
            onChange={(v) => update("guyed", v as GuyedState)}
          />
        )}

        {step === 6 && (
          <NumField label="Wind Area" unit="m²" value={sel.windArea} onChange={(v) => update("windArea", v)} placeholder="e.g. 0.35" />
        )}

        {step === 7 && (
          <NumField label="Maximum Operating Wind Speed" unit="km/h" value={sel.windSpeed} onChange={(v) => update("windSpeed", v)} placeholder="e.g. 80" />
        )}

        {step === 8 && (
          <NumField label="Permissible Sway" unit="°" value={sel.sway} onChange={(v) => update("sway", v)} placeholder="e.g. 2" />
        )}

        {step === 9 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">Select any additional accessories required (optional).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACCESSORIES.map((a) => {
                const active = sel.accessories.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      update("accessories", active ? sel.accessories.filter((x) => x !== a) : [...sel.accessories, a])
                    }
                    className={`text-left rounded-md border px-4 py-3 text-sm transition-colors ${
                      active ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium uppercase tracking-wider text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setDone(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
          >
            View Summary <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const NumField = ({ label, unit, value, onChange, placeholder }: { label: string; unit: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <label className="block">
    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    <div className="mt-2 flex items-center rounded-md border border-border bg-background focus-within:border-primary">
      <input
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      <span className="pr-4 font-mono text-xs text-muted-foreground">{unit}</span>
    </div>
  </label>
);

const Choice = ({ options, value, onChange }: { options: { v: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    {options.map((o) => {
      const active = value === o.v;
      return (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`text-left rounded-md border px-4 py-3 text-sm transition-colors ${
            active ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 text-foreground"
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

export default SelectorPage;

const SpecGrid = ({ p }: { p: Product }) => {
  const rows: [string, string | number | null][] = [
    ["Technology", p.technologies.join(" / ")],
    ["Duty", p.duty],
    ["Head Load", `${p.head_load_kg} kg`],
    ["Erected Height", p.extended_height_m !== null ? `${p.extended_height_m} m` : "—"],
    ["Retracted Height", p.retracted_height_m !== null ? `${p.retracted_height_m} m` : "—"],
    ["Mast Weight", `${p.weight_of_mast_kg} kg`],
    ["Wind Area", p.wind_area_m2 !== null ? `${p.wind_area_m2} m²` : "—"],
    ["Wind Speed (Op/Surv)", p.wind_speed_op_kmph !== null ? `${p.wind_speed_op_kmph}${p.wind_speed_survival_kmph ? ` / ${p.wind_speed_survival_kmph}` : ""} km/h` : "—"],
    ["Sway", p.sway_deg !== null ? `${p.sway_deg}°` : "—"],
    ["Sections", p.no_of_sections],
    ["Tube Dia", p.tube_dia_mm !== null ? `${p.tube_dia_mm} mm` : "—"],
    ["Configuration", p.guyed],
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{k}</dt>
          <dd className="text-foreground">{v ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
};
