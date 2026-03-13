import { useParams, Link } from "react-router-dom";
import { useCategoryBySlug, useSubCategories } from "@/hooks/use-products";
import SubCategoryCard from "@/components/SubCategoryCard";
import { ChevronRight, Loader2 } from "lucide-react";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: cat, isLoading: catLoading } = useCategoryBySlug(category || "");
  const { data: subCategories, isLoading: subLoading } = useSubCategories(cat?.id);

  if (catLoading || subLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase text-foreground">Category Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <nav className="flex items-center gap-1 text-xs font-mono text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{cat.title}</span>
      </nav>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Sub Categories</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {cat.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{cat.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories?.map((sub) => (
          <SubCategoryCard
            key={sub.slug}
            categorySlug={cat.slug}
            slug={sub.slug}
            title={sub.title}
            description={sub.description}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
