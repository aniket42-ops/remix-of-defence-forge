import { useAllCategoriesWithData } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const AdminPricing = () => {
  const { data: categories, isLoading } = useAllCategoriesWithData();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const handleSave = async (variantId: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast.error("Invalid price");
      return;
    }
    const { error } = await supabase.from("product_variants").update({ base_price: price }).eq("id", variantId);
    if (error) {
      toast.error("Failed to update price");
      return;
    }
    toast.success("Price updated");
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ["admin_all_products"] });
    queryClient.invalidateQueries({ queryKey: ["product_variants"] });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground mb-6">Pricing Configuration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories?.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">{cat.title}</h2>
            </div>
            {cat.subCategories.map((sub) => (
              <div key={sub.id} className="mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{sub.title}</p>
                {sub.variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="font-mono text-sm text-foreground">{v.model_no}</span>
                    <div className="flex items-center gap-2">
                      {editingId === v.id ? (
                        <>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 rounded border border-border bg-input px-2 py-1 text-sm text-foreground font-mono"
                            autoFocus
                          />
                          <button onClick={() => handleSave(v.id)} className="text-xs text-tech-green hover:underline">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:underline">Cancel</button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-sm text-primary">₹ {Number(v.base_price).toLocaleString("en-IN")}</span>
                          <button
                            onClick={() => { setEditingId(v.id); setEditPrice(String(v.base_price)); }}
                            className="text-xs text-muted-foreground hover:text-primary"
                          >
                            Edit
                          </button>
                        </>
                      )}
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
