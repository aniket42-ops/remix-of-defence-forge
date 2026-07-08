import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TECHNOLOGIES } from "@/data/catalogue";
import { ChevronRight, ChevronLeft, Loader2, CheckCircle2, RotateCcw } from "lucide-react";

type Selections = {
  payload: string;
  mastType: string; // sub_category id (Light/Medium/Heavy)
  eh: string;
  rh: string;
  operation: string;
  mounting: string;
  guyed: "Guyed" | "Unguyed" | "";
  windArea: string;
  windSpeed: string;
  sway: string;
  accessories: string[];
};

const OPERATIONS = ["Manual", "Pneumatic", "Electromechanical"];
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
  mastType: "",
  eh: "",
  rh: "",
  operation: "",
  mounting: "",
  guyed: "",
  windArea: "",
  windSpeed: "",
  sway: "",
  accessories: [],
};

const STEPS = [
  "Payload Weight",
  "Mast Type",
  "Required Erected Height (EH)",
  "Required Retracted Height (RH)",
  "Type of Operation",
  "Mounting",
  "Guyed / Unguyed",
  "Wind Area",
  "Max Operating Wind Speed",
  "Permissible Sway",
  "Accessories",
] as const;

function useMastVariants() {
  return useQuery({
    queryKey: ["selector_mast_variants"],
    queryFn: async () => {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", "telescopic-masts").single();
      if (!cat) return { subs: [], variants: [] as any[] };
      const { data: subs } = await supabase.from("sub_categories").select("id,title,slug").eq("category_id", cat.id);
      const subList = subs || [];
      const { data: variants, error } = await supabase
        .from("product_variants")
        .select("*")
        .in("sub_category_id", subList.map((s) => s.id))
        .eq("visible", true);
      if (error) throw error;
      const subMap = new Map(subList.map((s) => [s.id, s]));
      return {
        subs: subList,
        variants: (variants || []).map((v) => ({ ...v, sub: subMap.get(v.sub_category_id)! })),
      };
    },
  });
}

const SelectorPage = () => {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<Selections>(emptySel);
  const [done, setDone] = useState(false);
  const { data, isLoading } = useMastVariants();
  const variants = data?.variants || [];
  const subs = data?.subs || [];

  const update = <K extends keyof Selections>(k: K, v: Selections[K]) => setSel((s) => ({ ...s, [k]: v }));

  // Mast types available for entered payload
  const availableMastTypes = useMemo(() => {
    const p = parseFloat(sel.payload);
    if (isNaN(p)) return [];
    // A mast type qualifies if it has at least one variant that can carry the payload
    const qualifyingIds = new Set(
      variants.filter((v) => Number(v.head_load) >= p).map((v) => v.sub_category_id)
    );
    return subs.filter((s) => qualifyingIds.has(s.id));
  }, [sel.payload, variants, subs]);

  // EH options for chosen mast type & payload
  const ehOptions = useMemo(() => {
    if (!sel.mastType) return [];
    const p = parseFloat(sel.payload);
    const vs = variants.filter(
      (v) => v.sub_category_id === sel.mastType && (isNaN(p) || Number(v.head_load) >= p)
    );
    return Array.from(new Set(vs.map((v) => Number(v.height_erected)))).sort((a, b) => a - b);
  }, [sel.mastType, sel.payload, variants]);

  // RH options limited by chosen EH
  const rhOptions = useMemo(() => {
    if (!sel.mastType || !sel.eh) return [];
    const p = parseFloat(sel.payload);
    const vs = variants.filter(
      (v) =>
        v.sub_category_id === sel.mastType &&
        Number(v.height_erected) === Number(sel.eh) &&
        (isNaN(p) || Number(v.head_load) >= p)
    );
    return Array.from(new Set(vs.map((v) => Number(v.height_retracted)))).sort((a, b) => a - b);
  }, [sel.mastType, sel.eh, sel.payload, variants]);

  const canNext = () => {
    switch (step) {
      case 0: return !!sel.payload && parseFloat(sel.payload) > 0;
      case 1: return !!sel.mastType;
      case 2: return !!sel.eh;
      case 3: return !!sel.rh;
      case 4: return !!sel.operation;
      case 5: return !!sel.mounting;
      case 6: return !!sel.guyed;
      case 7: return !!sel.windArea;
      case 8: return !!sel.windSpeed;
      case 9: return !!sel.sway;
      case 10: return true;
      default: return false;
    }
  };

  const matches = useMemo(() => {
    const p = parseFloat(sel.payload);
    const wa = parseFloat(sel.windArea);
    const ws = parseFloat(sel.windSpeed);
    return variants.filter((v) => {
      if (sel.mastType && v.sub_category_id !== sel.mastType) return false;
      if (!isNaN(p) && Number(v.head_load) < p) return false;
      if (sel.eh && Number(v.height_erected) !== Number(sel.eh)) return false;
      if (sel.rh && Number(v.height_retracted) !== Number(sel.rh)) return false;
      if (!isNaN(wa) && Number(v.wind_area) < wa) return false;
      if (!isNaN(ws) && Number(v.wind_speed_operational) < ws) return false;
      return true;
    });
  }, [variants, sel]);

  const reset = () => { setSel(emptySel); setStep(0); setDone(false); };

  if (isLoading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (done) {
    const mastTypeTitle = subs.find((s) => s.id === sel.mastType)?.title;
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
            ["Mast Type", mastTypeTitle],
            ["Erected Height (EH)", sel.eh && `${sel.eh} m`],
            ["Retracted Height (RH)", sel.rh && `${sel.rh} m`],
            ["Type of Operation", sel.operation],
            ["Mounting", TECHNOLOGIES.find((t) => t.slug === sel.mounting)?.title || sel.mounting],
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
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground mb-4">
            Matching Products <span className="text-primary">({matches.length})</span>
          </h2>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exact match found. Please contact our team for a custom configuration.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="px-3 py-2">Model No.</th>
                    <th className="px-3 py-2">Series</th>
                    <th className="px-3 py-2">Erected H (m)</th>
                    <th className="px-3 py-2">Retracted H (m)</th>
                    <th className="px-3 py-2">Head Load (kg)</th>
                    <th className="px-3 py-2">Wind Area (m²)</th>
                    <th className="px-3 py-2">Wind Speed (km/h)</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((v) => (
                    <tr key={v.id} className="border-t border-border hover:bg-muted/40">
                      <td className="px-3 py-2 font-mono text-xs text-foreground">{v.model_no}</td>
                      <td className="px-3 py-2 text-muted-foreground">{v.sub?.title}</td>
                      <td className="px-3 py-2">{Number(v.height_erected)}</td>
                      <td className="px-3 py-2">{Number(v.height_retracted)}</td>
                      <td className="px-3 py-2">{Number(v.head_load)}</td>
                      <td className="px-3 py-2">{Number(v.wind_area)}</td>
                      <td className="px-3 py-2">{Number(v.wind_speed_operational)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            setSel((s) => ({ ...s, payload: v, mastType: "", eh: "", rh: "" }));
          }} placeholder="e.g. 15" />
        )}

        {step === 1 && (
          availableMastTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No mast type available for {sel.payload} kg payload. Please go back and reduce the payload weight, or contact our team for a custom configuration.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your payload of <span className="text-foreground font-medium">{sel.payload} kg</span>, the following mast type(s) are suitable:
              </p>
              <Choice
                options={availableMastTypes.map((m) => ({ v: m.id, label: m.title }))}
                value={sel.mastType}
                onChange={(v) => setSel((s) => ({ ...s, mastType: v, eh: "", rh: "" }))}
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
          <Choice options={OPERATIONS.map((o) => ({ v: o, label: o }))} value={sel.operation} onChange={(v) => update("operation", v)} />
        )}

        {step === 5 && (
          <Choice options={TECHNOLOGIES.map((t) => ({ v: t.slug, label: t.title }))} value={sel.mounting} onChange={(v) => update("mounting", v)} />
        )}

        {step === 6 && (
          <Choice
            options={[{ v: "Guyed", label: "Guyed" }, { v: "Unguyed", label: "Unguyed" }]}
            value={sel.guyed}
            onChange={(v) => update("guyed", v as "Guyed" | "Unguyed")}
          />
        )}

        {step === 7 && (
          <NumField label="Wind Area" unit="m²" value={sel.windArea} onChange={(v) => update("windArea", v)} placeholder="e.g. 0.35" />
        )}

        {step === 8 && (
          <NumField label="Maximum Operating Wind Speed" unit="km/h" value={sel.windSpeed} onChange={(v) => update("windSpeed", v)} placeholder="e.g. 80" />
        )}

        {step === 9 && (
          <NumField label="Permissible Sway" unit="°" value={sel.sway} onChange={(v) => update("sway", v)} placeholder="e.g. 2" />
        )}

        {step === 10 && (
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
