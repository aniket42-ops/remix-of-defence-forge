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
  onClose: () => void;
}

type Step = "configure" | "details" | "thankyou";

const QuoteConfigurator = ({
  variants,
  characteristicPrices,
  category,
  subCategory,
  onClose,
}: QuoteConfiguratorProps) => {
  const [step, setStep] = useState<Step>("configure");
  const [selectedModelIdx, setSelectedModelIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Group prices by characteristic_key
  const priceGroups = useMemo(() => {
    const groups: Record<string, CharPrice[]> = {};
    characteristicPrices.forEach((cp) => {
      if (!groups[cp.characteristic_key]) groups[cp.characteristic_key] = [];
      groups[cp.characteristic_key].push(cp);
    });
    return groups;
  }, [characteristicPrices]);

  // Customizable keys
  const customizableKeys = useMemo(
    () => Object.keys(priceGroups).filter((k) => priceGroups[k].some((p) => p.is_customizable)),
    [priceGroups]
  );

  // Selected customizable options (key -> option_value)
  const [customSelections, setCustomSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    customizableKeys.forEach((k) => {
      if (priceGroups[k].length > 0) init[k] = priceGroups[k][0].option_value;
    });
    return init;
  });

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });

  const selectedVariant = variants[selectedModelIdx];

  // Build line items mapped to the table columns
  const lineItems = useMemo(() => {
    if (!selectedVariant) return [];
    const items: { label: string; value: string; price: number }[] = [];

    // Height (Retracted / Erected) - fixed per model
    const heightKey = `${selectedVariant.height_retracted}/${selectedVariant.height_erected}`;
    const heightPrice = priceGroups["height"]?.find((p) => p.option_value === heightKey);
    items.push({
      label: "Height (Retracted / Erected)",
      value: `${selectedVariant.height_retracted}m / ${selectedVariant.height_erected}m`,
      price: heightPrice ? Number(heightPrice.price) : 0,
    });

    // Head Load - customizable
    if (customizableKeys.includes("head_load")) {
      const sel = customSelections["head_load"];
      const match = priceGroups["head_load"]?.find((p) => p.option_value === sel);
      items.push({
        label: "Head Load (Kg)",
        value: match?.option_label || sel,
        price: match ? Number(match.price) : 0,
      });
    }

    // Wind Area - customizable
    if (customizableKeys.includes("wind_area")) {
      const sel = customSelections["wind_area"];
      const match = priceGroups["wind_area"]?.find((p) => p.option_value === sel);
      items.push({
        label: "Wind Area (m²)",
        value: match?.option_label || sel,
        price: match ? Number(match.price) : 0,
      });
    }

    // Wind Speed - fixed per model
    items.push({
      label: "Wind Speed (Op./Surv.)",
      value: `${selectedVariant.wind_speed_operational}/${selectedVariant.wind_speed_survival} kmph`,
      price: 0,
    });

    // Sway
    items.push({
      label: "Sway (°)",
      value: selectedVariant.sway,
      price: 0,
    });

    // Weight of Mast
    const weightMatch = priceGroups["weight"]?.find((p) => p.option_value === String(selectedVariant.weight));
    items.push({
      label: "Weight of Mast (Kg)",
      value: `${selectedVariant.weight} Kg`,
      price: weightMatch ? Number(weightMatch.price) : 0,
    });

    // No. of Sections
    const secMatch = priceGroups["sections"]?.find((p) => p.option_value === String(selectedVariant.sections));
    items.push({
      label: "No. of Sections",
      value: `${selectedVariant.sections}`,
      price: secMatch ? Number(secMatch.price) : 0,
    });

    // Tube Dia
    const tubeVal = selectedVariant.tube_dia?.replace(/\s/g, "");
    const tubeMatch = priceGroups["tube_dia"]?.find((p) => p.option_value === tubeVal);
    items.push({
      label: "Tube Dia",
      value: selectedVariant.tube_dia,
      price: tubeMatch ? Number(tubeMatch.price) : 0,
    });

    // Ground Mount - No. of Guy Ropes
    const guyVal = selectedVariant.guy_ropes?.replace(/\s/g, "");
    const guyMatch = priceGroups["guy_ropes_ground"]?.find((p) => p.option_value === guyVal);
    items.push({
      label: "Ground Mount — Guy Ropes",
      value: selectedVariant.guy_ropes,
      price: guyMatch ? Number(guyMatch.price) : 0,
    });

    // Tripod Mount - No. of Guy Ropes
    const tripodGuyVal = ((selectedVariant as any).tripod_guy_ropes || selectedVariant.guy_ropes)?.replace(/\s/g, "");
    const tripodGuyMatch = priceGroups["guy_ropes_tripod"]?.find((p) => p.option_value === tripodGuyVal);
    items.push({
      label: "Tripod Mount — Guy Ropes",
      value: (selectedVariant as any).tripod_guy_ropes || selectedVariant.guy_ropes,
      price: tripodGuyMatch ? Number(tripodGuyMatch.price) : 0,
    });

    // Tripod Weight
    const tripodMatch = priceGroups["tripod_weight"]?.find((p) => p.option_value === String(selectedVariant.tripod_weight));
    items.push({
      label: "Tripod Weight (Kg)",
      value: `${selectedVariant.tripod_weight} Kg`,
      price: tripodMatch ? Number(tripodMatch.price) : 0,
    });

    return items;
  }, [selectedVariant, customSelections, priceGroups, customizableKeys]);

  const unitTotal = lineItems.reduce((sum, i) => sum + i.price, 0);
  const grandTotal = unitTotal * quantity;

  const handleSubmit = async () => {
    setSubmitting(true);
    const configSummary = lineItems.map((i) => `${i.label}: ${i.value} (₹${i.price.toLocaleString("en-IN")})`).join("\n");
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
      product_model: selectedVariant?.model_no || "",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
              {step === "configure" ? "Configure Your Requirement" : step === "details" ? "Your Details" : "Thank You!"}
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
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Select Model (Height)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedModelIdx(idx)}
                    className={`rounded border px-3 py-2 text-sm font-mono transition-colors ${
                      idx === selectedModelIdx
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {v.model_no}
                    <span className="block text-[10px]">
                      {v.height_retracted}m / {v.height_erected}m
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {customizableKeys.map((key) => {
              const options = priceGroups[key];
              const label = options[0]?.characteristic_label || key;
              return (
                <div key={key}>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                    {label} <span className="text-primary">(Customizable)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setCustomSelections((prev) => ({ ...prev, [key]: opt.option_value }))
                        }
                        className={`rounded border px-3 py-2 text-sm font-mono transition-colors text-left ${
                          customSelections[key] === opt.option_value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt.option_label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

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

            {/* Configuration Summary Preview */}
            {selectedVariant && (
              <div className="rounded border border-border bg-muted/30 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Selected Configuration</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  <span className="text-muted-foreground">Height:</span>
                  <span className="text-foreground">{selectedVariant.height_retracted}m / {selectedVariant.height_erected}m</span>
                  <span className="text-muted-foreground">Wind Speed:</span>
                  <span className="text-foreground">{selectedVariant.wind_speed_operational}/{selectedVariant.wind_speed_survival} kmph</span>
                  <span className="text-muted-foreground">Sway:</span>
                  <span className="text-foreground">{selectedVariant.sway}</span>
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="text-foreground">{selectedVariant.weight} Kg</span>
                  <span className="text-muted-foreground">Sections:</span>
                  <span className="text-foreground">{selectedVariant.sections}</span>
                  <span className="text-muted-foreground">Tube Dia:</span>
                  <span className="text-foreground">{selectedVariant.tube_dia}</span>
                  <span className="text-muted-foreground">Ground Guy Ropes:</span>
                  <span className="text-foreground">{selectedVariant.guy_ropes}</span>
                  <span className="text-muted-foreground">Tripod Guy Ropes:</span>
                  <span className="text-foreground">{(selectedVariant as any).tripod_guy_ropes || selectedVariant.guy_ropes}</span>
                  <span className="text-muted-foreground">Tripod Weight:</span>
                  <span className="text-foreground">{selectedVariant.tripod_weight} Kg</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep("details")}
              className="w-full rounded bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 flex items-center justify-center gap-2"
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
        {step === "thankyou" && (
          <div className="p-4 space-y-4">
            <div className="rounded border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-lg font-bold text-foreground">Thank you for your interest, {form.name}!</p>
              <p className="text-sm text-muted-foreground mt-1">Here is your estimated quote based on the selected configuration.</p>
            </div>

            <div className="rounded border border-border bg-muted/30 p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Selected Model</p>
              <p className="font-mono text-lg font-bold text-primary">{selectedVariant?.model_no}</p>
            </div>

            <div className="rounded border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground font-heading">Specification</th>
                    <th className="text-left px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground font-heading">Value</th>
                    <th className="text-right px-3 py-2 text-xs uppercase tracking-wider text-secondary-foreground font-heading">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-foreground">{item.label}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{item.value}</td>
                      <td className="px-3 py-2 font-mono text-primary text-right">
                        {item.price > 0 ? `₹${item.price.toLocaleString("en-IN")}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary/30 bg-primary/5">
                    <td className="px-3 py-2 font-bold text-foreground" colSpan={2}>
                      Unit Total
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-primary text-right">
                      ₹{unitTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  {quantity > 1 && (
                    <tr className="bg-primary/5">
                      <td className="px-3 py-2 font-bold text-foreground" colSpan={2}>
                        × {quantity} units
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-primary text-right text-lg">
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
