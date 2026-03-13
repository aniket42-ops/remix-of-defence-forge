import { categories } from "@/data/products";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

const AdminPricing = () => {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground mb-6">
        Pricing Configuration
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.slug} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
                {cat.title}
              </h2>
            </div>
            {cat.subCategories.map((sub) => (
              <div key={sub.slug} className="mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{sub.title}</p>
                {sub.variants.map((v) => (
                  <div key={v.modelNo} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="font-mono text-sm text-foreground">{v.modelNo}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primary">₹ {v.basePrice.toLocaleString("en-IN")}</span>
                      <button
                        onClick={() => toast.info("Pricing update requires database connection")}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPricing;
