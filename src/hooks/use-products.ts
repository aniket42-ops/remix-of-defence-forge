import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Image imports for categories (fallback)
import telescopicMastsImg from "@/assets/telescopic-masts.jpg";
import tripodsImg from "@/assets/tripods.jpg";
import pedestalsImg from "@/assets/pedestals.jpg";
import junctionBoxImg from "@/assets/junction-box.jpg";

const imageMap: Record<string, string> = {
  "telescopic-masts": telescopicMastsImg,
  tripods: tripodsImg,
  pedestals: pedestalsImg,
  "junction-box": junctionBoxImg,
};

export type DbCategory = Tables<"categories">;
export type DbSubCategory = Tables<"sub_categories">;
export type DbProductVariant = Tables<"product_variants">;

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data.map((c) => ({ ...c, resolvedImage: imageMap[c.slug] || c.image_url }));
    },
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return { ...data, resolvedImage: imageMap[data.slug] || data.image_url };
    },
    enabled: !!slug,
  });
}

export function useSubCategories(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["sub_categories", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("category_id", categoryId!)
        .eq("visible", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId,
  });
}

export function useSubCategoryBySlug(categoryId: string | undefined, subSlug: string) {
  return useQuery({
    queryKey: ["sub_category", categoryId, subSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sub_categories")
        .select("*")
        .eq("category_id", categoryId!)
        .eq("slug", subSlug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId && !!subSlug,
  });
}

export function useProductVariants(subCategoryId: string | undefined) {
  return useQuery({
    queryKey: ["product_variants", subCategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("sub_category_id", subCategoryId!)
        .eq("visible", true)
        .order("model_no");
      if (error) throw error;
      return data;
    },
    enabled: !!subCategoryId,
  });
}

// For admin: fetch all including hidden
export function useAllCategoriesWithData() {
  return useQuery({
    queryKey: ["admin_all_products"],
    queryFn: async () => {
      const { data: cats, error: cErr } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (cErr) throw cErr;

      const { data: subs, error: sErr } = await supabase
        .from("sub_categories")
        .select("*")
        .order("sort_order");
      if (sErr) throw sErr;

      const { data: variants, error: vErr } = await supabase
        .from("product_variants")
        .select("*")
        .order("model_no");
      if (vErr) throw vErr;

      return cats.map((cat) => ({
        ...cat,
        subCategories: subs
          .filter((s) => s.category_id === cat.id)
          .map((sub) => ({
            ...sub,
            variants: variants.filter((v) => v.sub_category_id === sub.id),
          })),
      }));
    },
  });
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
