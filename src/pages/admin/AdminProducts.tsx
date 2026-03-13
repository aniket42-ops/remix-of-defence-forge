import { categories } from "@/data/products";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const AdminProducts = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">
          Products
        </h1>
        <button
          onClick={() => toast.info("Add product feature requires database connection")}
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" /> Add Variant
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat.slug} className="mb-8">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-primary mb-3">
            {cat.title}
          </h2>
          {cat.subCategories.map((sub) => (
            <div key={sub.slug} className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {sub.title}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="spec-table w-full text-left">
                  <thead>
                    <tr>
                      <th>Model No</th>
                      <th>Height (m)</th>
                      <th>Head Load (kg)</th>
                      <th>Weight (kg)</th>
                      <th>Base Price (₹)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.variants.map((v) => (
                      <tr key={v.modelNo}>
                        <td className="font-semibold text-primary">{v.modelNo}</td>
                        <td>{v.heightErected}</td>
                        <td>{v.headLoad}</td>
                        <td>{v.weight}</td>
                        <td>₹ {v.basePrice.toLocaleString("en-IN")}</td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toast.info("Edit feature requires database connection")}
                              className="rounded p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toast.info("Delete feature requires database connection")}
                              className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
