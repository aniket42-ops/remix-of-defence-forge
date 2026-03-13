import { useState } from "react";
import { X, Send, Calculator } from "lucide-react";
import { ProductVariant } from "@/data/products";
import { toast } from "sonner";

interface QuoteModalProps {
  variant: ProductVariant;
  category: string;
  subCategory: string;
  onClose: () => void;
}

const QuoteModal = ({ variant, category, subCategory, onClose }: QuoteModalProps) => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    quantity: 1,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const estimatedPrice = variant.basePrice * form.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would save to Firestore
    console.log("Quote submitted:", {
      ...form,
      category,
      subCategory,
      productModel: variant.modelNo,
      estimatedPrice,
      createdAt: new Date(),
    });
    setSubmitted(true);
    toast.success("Quote request submitted successfully!");
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-foreground">
              Request Quote
            </h2>
            <p className="font-mono text-sm text-primary">{variant.modelNo}</p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tech-green/20">
              <Send className="h-8 w-8 text-tech-green" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-foreground mb-2">
              Quote Request Submitted
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our team will review your request and get back to you within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="rounded bg-primary px-6 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            {/* Estimated price */}
            <div className="rounded border border-primary/30 bg-primary/5 p-3 flex items-center gap-3">
              <Calculator className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Quote</p>
                <p className="font-mono text-lg font-bold text-primary">
                  ₹ {estimatedPrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Company *</label>
                <input
                  required
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Company Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Country *</label>
                <input
                  required
                  value={form.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="India"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity *</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                  className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Additional requirements or specifications..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/80 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Quote Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
