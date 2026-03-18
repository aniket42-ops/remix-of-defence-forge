import { useAllCategoriesWithData } from "@/hooks/use-products";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import ProductVariantFormDialog from "@/components/admin/ProductVariantFormDialog";
import type { Tables } from "@/integrations/supabase/types";

import telescopicMastsImg from "@/assets/telescopic-masts.jpg";
import tripodsImg from "@/assets/tripods.jpg";
import pedestalsImg from "@/assets/pedestals.jpg";
import junctionBoxImg from "@/assets/junction-box.jpg";

const categoryImages: Record<string, string> = {
  "telescopic-masts": telescopicMastsImg,
  tripods: tripodsImg,
  pedestals: pedestalsImg,
  "junction-box": junctionBoxImg,
};

const AdminProducts = () => {
  const { data: categories, isLoading } = useAllCategoriesWithData();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);
  const { canEdit, isSales } = useAuthContext();
  const [formOpen, setFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Tables<"product_variants"> | null>(null);

  const handleDelete = async (variantId: string, modelNo: string) => {
    if (!canEdit) { toast.error("View-only access"); return; }
    if (!confirm(`Delete variant ${modelNo}?`)) return;
    setDeleting(variantId);
    const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
    setDeleting(null);
    if (error) { toast.error("Failed to delete"); return; }
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
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground">Products</h1>
          {isSales && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Lock className="h-3 w-3" /> View Only
            </span>
          )}
        </div>
        {canEdit && (
          <button
            onClick={() => toast.info("Add product form coming soon")}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
          >
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        )}
      </div>

      {categories?.map((cat) => (
        <div key={cat.id} className="mb-10">
          {/* Category header with larger image */}
          <div className="flex items-center gap-4 mb-5">
            {categoryImages[cat.slug] && (
              <img
                src={categoryImages[cat.slug]}
                alt={cat.title}
                className="h-16 w-24 rounded-lg object-cover border border-border shadow-sm"
              />
            )}
            <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-primary">{cat.title}</h2>
          </div>

          {cat.subCategories.map((sub) => (
            <div key={sub.id} className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-1">{sub.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sub.variants.map((v) => (
                  <Card key={v.id} className="group relative overflow-hidden border-border hover:border-primary/40 transition-all hover:shadow-lg">
                    {/* Card image area */}
                    {categoryImages[cat.slug] && (
                      <div className="h-36 overflow-hidden bg-muted">
                        <img
                          src={categoryImages[cat.slug]}
                          alt={v.model_no}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      {/* Model number */}
                      <h4 className="font-heading text-base font-bold text-primary uppercase tracking-wider mb-2">
                        {v.model_no}
                      </h4>

                      {/* Specs grid */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground text-xs">Height</span>
                          <p className="font-semibold text-foreground">{v.height_erected} m</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Head Load</span>
                          <p className="font-semibold text-foreground">{v.head_load} kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Weight</span>
                          <p className="font-semibold text-foreground">{v.weight} kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Sections</span>
                          <p className="font-semibold text-foreground">{v.sections}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="border-t border-border pt-2 flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-accent">
                          ₹ {Number(v.base_price).toLocaleString("en-IN")}
                        </span>

                        {canEdit && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => toast.info("Edit form coming soon")}
                              className="rounded p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(v.id, v.model_no)}
                              disabled={deleting === v.id}
                              className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
