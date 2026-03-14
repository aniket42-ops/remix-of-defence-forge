import { useState, useMemo } from "react";
import { X, Send, ChevronRight } from "lucide-react";
import { DbProductVariant } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CharPrice {
  id: string;
  characteristic_key: string;
  characteristic_label: string;
  option_value: string;
  option_label: string;
  price: number;
  is_customizable: boolean;
  sort_order: number;
}

interface QuoteConfiguratorProps {
  variants: DbProductVariant[];
  characteristicPrices: CharPrice[];
  category: string;
  subCategory: string;
  mastTypeInitials?: string;
  mastTypeName?: string;
  technologyName?: string;
  onClose: () => void;
}

type Step = "configure" | "details" | "thankyou";

const QuoteConfigurator = ({
  variants,
  characteristicPrices,
  category,
  subCategory,
  mastTypeInitials,
  mastTypeName,
  technologyName,
  onClose,
}: QuoteConfiguratorProps) => {
  const [step, setStep] = useState<Step>("configure");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step-by-step selections
  const [selectedErected, setSelectedErected] = useState<number | null>(null);
  const [selectedRetracted, setSelectedRetracted] = useState<number | null>(null);
  const [selectedHeadLoad, setSelectedHeadLoad] = useState<number | null>(null);
  const [selectedWindArea, setSelectedWindArea] = useState<number | null>(null);
  const [selectedGuyed, setSelectedGuyed] = useState<"guyed" | "unguyed" | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });

  // Progressive filtering
  const erectedOptions = useMemo(
    () => [...new Set(variants.map((v) => Number(v.height_erected)))].sort((a, b) => a - b),
    [variants]
  );

  const filteredByErected = useMemo(
    () => (selectedErected !== null ? variants.filter((v) => Number(v.height_erected) === selectedErected) : []),
    [variants, selectedErected]
  );

  const retractedOptions = useMemo(
    () => [...new Set(filteredByErected.map((v) => Number(v.height_retracted)))].sort((a, b) => a - b),
    [filteredByErected]
  );

  const filteredByRetracted = useMemo(
    () =>
      selectedRetracted !== null
        ? filteredByErected.filter((v) => Number(v.height_retracted) === selectedRetracted)
        : [],
    [filteredByErected, selectedRetracted]
  );

  const headLoadOptions = useMemo(
    () => [...new Set(filteredByRetracted.map((v) => Number(v.head_load)))].sort((a, b) => a - b),
    [filteredByRetracted]
  );

  const filteredByHeadLoad = useMemo(
    () =>
      selectedHeadLoad !== null
        ? filteredByRetracted.filter((v) => Number(v.head_load) === selectedHeadLoad)
        : [],
    [filteredByRetracted, selectedHeadLoad]
  );

  const windAreaOptions = useMemo(
    () => [...new Set(filteredByHeadLoad.map((v) => Number(v.wind_area)))].sort((a, b) => a - b),
    [filteredByHeadLoad]
  );

  const filteredByWindArea = useMemo(
    () =>
      selectedWindArea !== null
        ? filteredByHeadLoad.filter((v) => Number(v.wind_area) === selectedWindArea)
        : [],
    [filteredByHeadLoad, selectedWindArea]
  );

  // Check if tripod data exists
  const hasTripodData = filteredByWindArea.some((v) => v.tripod_weight && Number(v.tripod_weight) > 0);

  // Matching variant (first match after all selections)
  const matchingVariant = filteredByWindArea.length > 0 ? filteredByWindArea[0] : null;

  // Generated model number
  const generatedModelNo = useMemo(() => {
    const prefix = mastTypeInitials || "M";
    const parts: string[] = [prefix];
    if (selectedErected !== null) parts.push(String(selectedErected));
    if (selectedHeadLoad !== null) parts.push(String(selectedHeadLoad));
    if (selectedWindArea !== null) parts.push(String(selectedWindArea));
    if (selectedGuyed) parts.push(selectedGuyed === "guyed" ? "G" : "UG");
    return parts.join("-");
  }, [mastTypeInitials, selectedErected, selectedHeadLoad, selectedWindArea, selectedGuyed]);

  // Price from matching variant
  const unitPrice = matchingVariant ? Number(matchingVariant.base_price) : 0;
  const grandTotal = unitPrice * quantity;

  const isConfigComplete =
    selectedErected !== null &&
    selectedRetracted !== null &&
    selectedHeadLoad !== null &&
    selectedWindArea !== null &&
    selectedGuyed !== null;

  // Build summary for the quote
  const configSummary = useMemo(() => {
    if (!matchingVariant) return "";
    const lines = [
      `Technology: ${technologyName || "N/A"}`,
      `Mast Type: ${mastTypeName || "N/A"}`,
      `Duty Level: ${subCategory}`,
      `Generated Model: ${generatedModelNo}`,
      `Erected Height: ${selectedErected}m`,
      `Retracted Height: ${selectedRetracted}m`,
      `Head Load: ${selectedHeadLoad} Kg`,
      `Wind Area: ${selectedWindArea} m²`,
      `Wind Speed: ${matchingVariant.wind_speed_operational}/${matchingVariant.wind_speed_survival} kmph`,
      `Sway: ${matchingVariant.sway}`,
      `Weight: ${matchingVariant.weight} Kg`,
      `Sections: ${matchingVariant.sections}`,
      `Tube Dia: ${matchingVariant.tube_dia}`,
      `Guy Ropes (Ground): ${matchingVariant.guy_ropes}`,
      `Guy Ropes (Tripod): ${matchingVariant.tripod_guy_ropes || matchingVariant.guy_ropes}`,
      `Tripod Weight: ${matchingVariant.tripod_weight} Kg`,
      `Guyed/Unguyed: ${selectedGuyed}`,
      `Unit Price: ₹${unitPrice.toLocaleString("en-IN")}`,
      `Quantity: ${quantity}`,
      `Total: ₹${grandTotal.toLocaleString("en-IN")}`,
    ];
    return lines.join("\n");
  }, [matchingVariant, selectedErected, selectedRetracted, selectedHeadLoad, selectedWindArea, selectedGuyed, generatedModelNo, technologyName, mastTypeName, subCategory, unitPrice, quantity, grandTotal]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("quotes").insert({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      country: form.country,
      quantity,
      message: `${form.message}\n\n--- Configuration ---\n${configSummary}`,
      category,
      sub_category: subCategory,
      product_model: generatedModelNo,
      estimated_price: grandTotal,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit quote. Please try again.");
      return;
    }
    setStep("thankyou");
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.name && form.email && form.company && form.phone && form.country;

  // Reset downstream selections when upstream changes
  const selectErected = (val: number) => {
    setSelectedErected(val);
    setSelectedRetracted(null);
    setSelectedHeadLoad(null);
    setSelectedWindArea(null);
    setSelectedGuyed(null);
  };
  const selectRetracted = (val: number) => {
    setSelectedRetracted(val);
    setSelectedHeadLoad(null);
    setSelectedWindArea(null);
    setSelectedGuyed(null);
  };
  const selectHeadLoad = (val: number) => {
    setSelectedHeadLoad(val);
    setSelectedWindArea(null);
    setSelectedGuyed(null);
  };
  const selectWindArea = (val: number) => {
    setSelectedWindArea(val);
    setSelectedGuyed(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
              {step === "configure" ? "Configure Your Mast" : step === "details" ? "Your Details" : "Thank You!"}
            </h2>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-mono">
              <span className={step === "configure" ? "text-primary" : ""}>Configure</span>
              <ChevronRight className="h-3 w-3" />
              <span className={step === "details" ? "text-primary" : ""}>Details</span>
              <ChevronRight className="h-3 w-3" />
              <span className={step === "thankyou" ? "text-primary" : ""}>Quote</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Configure */}
        {step === "configure" && (
          <div className="p-4 space-y-4">
            {/* Erected Height */}
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                Erected Height (m) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {erectedOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() => selectErected(h)}
                    className={`rounded border px-3 py-2 text-sm font-mono transition-colors ${
                      selectedErected === h
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {h}m
                  </button>
                ))}
              </div>
            </div>

            {/* Retracted Height */}
            {selectedErected !== null && retractedOptions.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Retracted Height (m) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {retractedOptions.map((h) => (
                    <button
                      key={h}
                      onClick={() => selectRetracted(h)}
                      className={`rounded border px-3 py-2 text-sm font-mono transition-colors ${
                        selectedRetracted === h
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {h}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Head Load */}
            {selectedRetracted !== null && headLoadOptions.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Head Load (Kg) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {headLoadOptions.map((hl) => (
                    <button
                      key={hl}
                      onClick={() => selectHeadLoad(hl)}
                      className={`rounded border px-3 py-2 text-sm font-mono transition-colors ${
                        selectedHeadLoad === hl
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {hl} Kg
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wind Area */}
            {selectedHeadLoad !== null && windAreaOptions.length > 0 && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Wind Area (m²) *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {windAreaOptions.map((wa) => (
                    <button
                      key={wa}
                      onClick={() => selectWindArea(wa)}
                      className={`rounded border px-3 py-2 text-sm font-mono transition-colors ${
                        selectedWindArea === wa
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {wa} m²
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Guyed / Unguyed */}
            {selectedWindArea !== null && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                  Deployment Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["guyed", "unguyed"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedGuyed(opt)}
                      className={`rounded border px-3 py-2 text-sm font-mono capitalize transition-colors ${
                        selectedGuyed === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {isConfigComplete && (
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 rounded border border-border bg-input px-3 py-2 text-sm text-foreground font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Configuration Summary */}
            {isConfigComplete && matchingVariant && (
              <div className="rounded border border-border bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Selected Configuration</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  <span className="text-muted-foreground">Generated Model:</span>
                  <span className="text-primary font-bold">{generatedModelNo}</span>
                  <span className="text-muted-foreground">Erected Height:</span>
                  <span className="text-foreground">{selectedErected}m</span>
                  <span className="text-muted-foreground">Retracted Height:</span>
                  <span className="text-foreground">{selectedRetracted}m</span>
                  <span className="text-muted-foreground">Head Load:</span>
                  <span className="text-foreground">{selectedHeadLoad} Kg</span>
                  <span className="text-muted-foreground">Wind Area:</span>
                  <span className="text-foreground">{selectedWindArea} m²</span>
                  <span className="text-muted-foreground">Deployment:</span>
                  <span className="text-foreground capitalize">{selectedGuyed}</span>
                  <span className="text-muted-foreground">Wind Speed:</span>
                  <span className="text-foreground">
                    {matchingVariant.wind_speed_operational}/{matchingVariant.wind_speed_survival} kmph
                  </span>
                  <span className="text-muted-foreground">Sway:</span>
                  <span className="text-foreground">{matchingVariant.sway}</span>
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="text-foreground">{matchingVariant.weight} Kg</span>
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="text-foreground">{matchingVariant.sections}</span>
                  <span className="text-muted-foreground">Tube Dia:</span>
                  <span className="text-foreground">{matchingVariant.tube_dia}</span>
                  <span className="text-muted-foreground">Guy Ropes (Ground):</span>
                  <span className="text-foreground">{matchingVariant.guy_ropes}</span>
                  {hasTripodData && (
                    <>
                      <span className="text-muted-foreground">Guy Ropes (Tripod):</span>
                      <span className="text-foreground">{matchingVariant.tripod_guy_ropes || matchingVariant.guy_ropes}</span>
                      <span className="text-muted-foreground">Tripod Weight:</span>
                      <span className="text-foreground">{matchingVariant.tripod_weight} Kg</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("details")}
              disabled={!isConfigComplete}
              className="w-full rounded bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next: Your Details <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Name *</label>
                <input required value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Full Name" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Company *</label>
                <input required value={form.company} onChange={(e) => handleChange("company", e.target.value)} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Company Name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Email *</label>
                <input required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="email@company.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone *</label>
                <input required value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Country *</label>
              <input required value={form.country} onChange={(e) => handleChange("country", e.target.value)} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="India" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} rows={3} className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" placeholder="Additional requirements..." />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("configure")} className="flex-1 rounded border border-border py-2.5 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || submitting}
                className="flex-1 rounded bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit Quote Request"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Thank You + Estimated Quote */}
        {step === "thankyou" && matchingVariant && (
          <div className="p-4 space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-lg font-bold text-foreground">Thank you for your interest, {form.name}!</p>
              <p className="text-sm text-muted-foreground mt-1">Here is your estimated quote based on the selected configuration.</p>
            </div>

            <div className="rounded border border-border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Generated Model Number</p>
              <p className="font-mono text-lg font-bold text-primary">{generatedModelNo}</p>
            </div>

            <div className="rounded border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground font-heading">Specification</th>
                    <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground font-heading">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Technology", value: technologyName || "N/A" },
                    { label: "Mast Type", value: mastTypeName || "N/A" },
                    { label: "Duty Level", value: subCategory },
                    { label: "Erected Height", value: `${selectedErected}m` },
                    { label: "Retracted Height", value: `${selectedRetracted}m` },
                    { label: "Head Load", value: `${selectedHeadLoad} Kg` },
                    { label: "Wind Area", value: `${selectedWindArea} m²` },
                    { label: "Wind Speed (Op./Surv.)", value: `${matchingVariant.wind_speed_operational}/${matchingVariant.wind_speed_survival} kmph` },
                    { label: "Sway", value: matchingVariant.sway },
                    { label: "Weight of Mast", value: `${matchingVariant.weight} Kg` },
                    { label: "No. of Sections", value: `${matchingVariant.sections}` },
                    { label: "Tube Dia", value: matchingVariant.tube_dia },
                    { label: "Guy Ropes (Ground)", value: matchingVariant.guy_ropes },
                    ...(hasTripodData
                      ? [
                          { label: "Guy Ropes (Tripod)", value: matchingVariant.tripod_guy_ropes || matchingVariant.guy_ropes },
                          { label: "Tripod Weight", value: `${matchingVariant.tripod_weight} Kg` },
                        ]
                      : []),
                    { label: "Deployment", value: selectedGuyed || "" },
                  ].map((item, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-muted-foreground">{item.label}</td>
                      <td className="px-3 py-2 font-mono text-foreground">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary/30 bg-primary/5">
                    <td className="px-3 py-2 font-bold text-foreground">Estimated Unit Price</td>
                    <td className="px-3 py-2 font-mono font-bold text-primary">
                      ₹{unitPrice.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  {quantity > 1 && (
                    <tr className="bg-primary/5">
                      <td className="px-3 py-2 font-bold text-foreground">× {quantity} units — Total</td>
                      <td className="px-3 py-2 font-mono font-bold text-primary text-lg">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteConfigurator;
