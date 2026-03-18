import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const variantSchema = z.object({
  sub_category_id: z.string().min(1, "Sub-category is required"),
  height_erected: z.coerce.number().min(0),
  height_retracted: z.coerce.number().min(0),
  head_load: z.coerce.number().min(0),
  weight: z.coerce.number().min(0),
  sections: z.coerce.number().int().min(1),
  wind_area: z.coerce.number().min(0),
  wind_speed_operational: z.coerce.number().min(0),
  wind_speed_survival: z.coerce.number().min(0),
  tube_dia: z.string(),
  sway: z.string(),
  guy_ropes: z.string(),
  tripod_guy_ropes: z.string(),
  tripod_weight: z.coerce.number().min(0),
  base_price: z.coerce.number().min(0),
  visible: z.boolean(),
});

type VariantFormValues = z.infer<typeof variantSchema>;

type SubCatOption = { id: string; title: string; slug: string; category_id: string };
type CatOption = { id: string; title: string; slug: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: Tables<"product_variants"> | null;
  categories: Array<CatOption & { subCategories: SubCatOption[] }>;
}

function generateModelNo(
  catSlug: string,
  subSlug: string,
  sections: number,
  heightErected: number,
): string {
  const catCode = catSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  const subCode = subSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
  const h = heightErected > 0 ? Math.round(heightErected * 10) : "00";
  return `${catCode}-${subCode}-${sections}S-${h}`;
}

export default function ProductVariantFormDialog({ open, onOpenChange, variant, categories }: Props) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const isEdit = !!variant;

  const defaultValues: VariantFormValues = useMemo(
    () =>
      variant
        ? {
            sub_category_id: variant.sub_category_id,
            height_erected: variant.height_erected,
            height_retracted: variant.height_retracted,
            head_load: variant.head_load,
            weight: variant.weight,
            sections: variant.sections,
            wind_area: variant.wind_area,
            wind_speed_operational: variant.wind_speed_operational,
            wind_speed_survival: variant.wind_speed_survival,
            tube_dia: variant.tube_dia,
            sway: variant.sway,
            guy_ropes: variant.guy_ropes,
            tripod_guy_ropes: variant.tripod_guy_ropes,
            tripod_weight: variant.tripod_weight,
            base_price: variant.base_price,
            visible: variant.visible,
          }
        : {
            sub_category_id: "",
            height_erected: 0,
            height_retracted: 0,
            head_load: 0,
            weight: 0,
            sections: 1,
            wind_area: 0,
            wind_speed_operational: 0,
            wind_speed_survival: 0,
            tube_dia: "",
            sway: "",
            guy_ropes: "",
            tripod_guy_ropes: "",
            tripod_weight: 0,
            base_price: 0,
            visible: true,
          },
    [variant],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, open]);

  const subCategoryId = watch("sub_category_id");
  const sections = watch("sections");
  const heightErected = watch("height_erected");

  // Derive slugs for model number generation
  const { catSlug, subSlug } = useMemo(() => {
    for (const cat of categories) {
      const sub = cat.subCategories.find((s) => s.id === subCategoryId);
      if (sub) return { catSlug: cat.slug, subSlug: sub.slug };
    }
    return { catSlug: "", subSlug: "" };
  }, [categories, subCategoryId]);

  const generatedModelNo = useMemo(
    () => (catSlug && subSlug ? generateModelNo(catSlug, subSlug, sections, heightErected) : "—"),
    [catSlug, subSlug, sections, heightErected],
  );

  const onSubmit = async (values: VariantFormValues) => {
    setSaving(true);
    const modelNo = isEdit ? variant!.model_no : generatedModelNo;

    if (isEdit) {
      const { error } = await supabase
        .from("product_variants")
        .update({ ...values, model_no: modelNo })
        .eq("id", variant!.id);
      setSaving(false);
      if (error) {
        toast.error("Failed to update variant");
        return;
      }
      toast.success(`${modelNo} updated`);
    } else {
      const { error } = await supabase
        .from("product_variants")
        .insert([{ ...values, model_no: modelNo }]);
      setSaving(false);
      if (error) {
        toast.error("Failed to add variant");
        return;
      }
      toast.success(`${modelNo} added`);
    }

    queryClient.invalidateQueries({ queryKey: ["admin_all_products"] });
    queryClient.invalidateQueries({ queryKey: ["product_variants"] });
    onOpenChange(false);
  };

  const fieldClass = "flex flex-col gap-1.5";
  const inputClass = "h-9";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading uppercase tracking-wider">
            {isEdit ? "Edit Variant" : "Add New Variant"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? `Editing ${variant?.model_no}` : "Fill all fields. Model number auto-generates."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Model Number Preview */}
          <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Model Number</span>
            <p className="font-heading text-lg font-bold text-primary tracking-widest mt-1">
              {isEdit ? variant?.model_no : generatedModelNo}
            </p>
          </div>

          {/* Sub-category selector */}
          <div className={fieldClass}>
            <Label className="text-xs font-semibold uppercase tracking-wider">Category / Sub-Category</Label>
            <Select
              value={subCategoryId}
              onValueChange={(v) => setValue("sub_category_id", v, { shouldValidate: true })}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <div className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase">
                      {cat.title}
                    </div>
                    {cat.subCategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.title}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {errors.sub_category_id && (
              <p className="text-xs text-destructive">{errors.sub_category_id.message}</p>
            )}
          </div>

          {/* Dimensions grid */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Dimensions & Load</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "height_erected" as const, label: "Height Erected (m)" },
                { name: "height_retracted" as const, label: "Height Retracted (m)" },
                { name: "head_load" as const, label: "Head Load (kg)" },
                { name: "weight" as const, label: "Weight (kg)" },
                { name: "sections" as const, label: "Sections" },
                { name: "tripod_weight" as const, label: "Tripod Weight (kg)" },
              ].map((f) => (
                <div key={f.name} className={fieldClass}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input
                    type="number"
                    step={f.name === "sections" ? 1 : 0.01}
                    className={inputClass}
                    {...register(f.name)}
                  />
                  {errors[f.name] && (
                    <p className="text-xs text-destructive">{errors[f.name]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wind specs */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Wind Specifications</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "wind_area" as const, label: "Wind Area (m²)" },
                { name: "wind_speed_operational" as const, label: "Wind Speed Op. (km/h)" },
                { name: "wind_speed_survival" as const, label: "Wind Speed Surv. (km/h)" },
              ].map((f) => (
                <div key={f.name} className={fieldClass}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input type="number" step={0.01} className={inputClass} {...register(f.name)} />
                  {errors[f.name] && (
                    <p className="text-xs text-destructive">{errors[f.name]?.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Text fields */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider mb-2 block">Additional Details</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "tube_dia" as const, label: "Tube Diameter" },
                { name: "sway" as const, label: "Sway" },
                { name: "guy_ropes" as const, label: "Guy Ropes" },
                { name: "tripod_guy_ropes" as const, label: "Tripod Guy Ropes" },
              ].map((f) => (
                <div key={f.name} className={fieldClass}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  <Input className={inputClass} {...register(f.name)} />
                </div>
              ))}
            </div>
          </div>

          {/* Price & Visibility */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className={fieldClass}>
              <Label className="text-xs font-semibold uppercase tracking-wider">Base Price (₹)</Label>
              <Input type="number" step={0.01} className={inputClass} {...register("base_price")} />
              {errors.base_price && (
                <p className="text-xs text-destructive">{errors.base_price.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Switch
                checked={watch("visible")}
                onCheckedChange={(v) => setValue("visible", v)}
              />
              <Label className="text-xs text-muted-foreground">Visible</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              {isEdit ? "Save Changes" : "Add Variant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
