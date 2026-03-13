import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { getCategoryBySlug, getSubCategory, ProductVariant } from "@/data/products";
import ProductTable from "@/components/ProductTable";
import QuoteModal from "@/components/QuoteModal";
import { ChevronRight } from "lucide-react";

const ProductVariantsPage = () => {
  const { category, sub } = useParams<{ category: string; sub: string }>();
  const cat = getCategoryBySlug(category || "");
  const subCat = getSubCategory(category || "", sub || "");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (!cat || !subCat) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase text-foreground">Products Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/category/${cat.slug}`} className="hover:text-primary">{cat.title}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{subCat.title}</span>
      </nav>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Technical Specifications</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {subCat.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">{subCat.description}</p>
      </div>

      <ProductTable variants={subCat.variants} onGetQuote={setSelectedVariant} />

      {selectedVariant && (
        <QuoteModal
          variant={selectedVariant}
          category={cat.title}
          subCategory={subCat.title}
          onClose={() => setSelectedVariant(null)}
        />
      )}
    </div>
  );
};

export default ProductVariantsPage;
