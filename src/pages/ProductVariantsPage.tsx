import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useCategoryBySlug, useSubCategoryBySlug, useProductVariants, useCharacteristicPrices } from "@/hooks/use-products";
import { getTechnologyBySlug, getMastTypeBySlug } from "@/data/catalogue";
import ProductTable from "@/components/ProductTable";
import QuoteConfigurator from "@/components/QuoteConfigurator";
import Mast3DViewer from "@/components/Mast3DViewer";
import { ChevronRight, Loader2 } from "lucide-react";

const ProductVariantsPage = () => {
  const { category, sub, technology, mastType, duty } = useParams<{
    category: string;
    sub: string;
    technology: string;
    mastType: string;
    duty: string;
  }>();

  const subSlug = sub || duty || "";
  const isMultiStepFlow = !!technology && !!mastType && !!duty;

  const { data: cat, isLoading: catLoading } = useCategoryBySlug(category || "");
  const { data: subCat, isLoading: subLoading } = useSubCategoryBySlug(cat?.id, subSlug);
  const { data: variants, isLoading: varLoading } = useProductVariants(subCat?.id);
  const { data: charPrices } = useCharacteristicPrices(subCat?.id);
  const [showConfigurator, setShowConfigurator] = useState(false);

  const tech = isMultiStepFlow ? getTechnologyBySlug(technology!) : null;
  const mt = isMultiStepFlow ? getMastTypeBySlug(mastType!) : null;

  if (catLoading || subLoading || varLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cat || !subCat) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase text-foreground">Products Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <nav className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/category/${cat.slug}`} className="hover:text-primary">{cat.title}</Link>
        <ChevronRight className="h-3 w-3" />
        {isMultiStepFlow && tech && mt ? (
          <>
            <Link to={`/category/${cat.slug}/t/${tech.slug}`} className="hover:text-primary">{tech.title}</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/category/${cat.slug}/t/${tech.slug}/${mt.slug}`} className="hover:text-primary">{mt.title}</Link>
            <ChevronRight className="h-3 w-3" />
          </>
        ) : null}
        <span className="text-foreground">{subCat.title}</span>
      </nav>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Technical Specifications</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {subCat.title}
          {mt ? ` — ${mt.title}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{subCat.description}</p>
      </div>

      {/* Show 3D viewer for PTM light duty masts */}
      {subSlug === "light-duty" && mastType === "pneumatic-masts" && (
        <div className="mb-8">
          <Mast3DViewer />
        </div>
      )}

      <ProductTable
        variants={variants || []}
        onGetQuote={() => setShowConfigurator(true)}
      />

      {showConfigurator && variants && variants.length > 0 && (
        <QuoteConfigurator
          variants={variants}
          characteristicPrices={charPrices || []}
          category={cat.title}
          subCategory={subCat.title}
          mastTypeInitials={mt?.initials}
          mastTypeName={mt?.title}
          technologyName={tech?.title}
          onClose={() => setShowConfigurator(false)}
        />
      )}
    </div>
  );
};

export default ProductVariantsPage;
