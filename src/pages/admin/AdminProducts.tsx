import { useAllCategoriesWithData } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const AdminProducts = () => {
  const { data: categories, isLoading } = useAllCategoriesWithData();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (variantId: string, modelNo: string) => {
    if (!confirm(`Delete variant ${modelNo}? This will remove it from the catalogue immediately.`)) return;
    setDeleting(variantId);
    const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
    setDeleting(null);
    if (error) {
      toast.error("Failed to delete variant");
      return;
    }
    toast.success(`${modelNo} deleted`);
    queryClient.invalidateQueries({ queryKey: ["admin_all_products"] });
    queryClient.invalidateQueries({ queryKey: ["product_variants"] });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">Products</h1>
        <button
          onClick={() => toast.info("Add product form coming soon")}
          className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" /> Add Variant
        </button>
      </div>

      {categories?.map((cat) => (
        <div key={cat.id} className="mb-8">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-primary mb-3">{cat.title}</h2>
          {cat.subCategories.map((sub) => (
            <div key={sub.id} className="mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{sub.title}</h3>
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
                      <tr key={v.id}>
                        <td className="font-semibold text-primary">{v.model_no}</td>
                        <td>{v.height_erected}</td>
                        <td>{v.head_load}</td>
                        <td>{v.weight}</td>
                        <td>₹ {Number(v.base_price).toLocaleString("en-IN")}</td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toast.info("Edit form coming soon")}
                              className="rounded p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(v.id, v.model_no)}
                              disabled={deleting === v.id}
                              className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
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
