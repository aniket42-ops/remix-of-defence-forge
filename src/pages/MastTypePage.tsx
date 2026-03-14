import { useParams, Link } from "react-router-dom";
import { useCategoryBySlug, useSubCategories } from "@/hooks/use-products";
import { getTechnologyBySlug, getMastTypeBySlug } from "@/data/catalogue";
import { ChevronRight, Loader2 } from "lucide-react";

const MastTypePage = () => {
  const { category, technology, mastType } = useParams<{
    category: string;
    technology: string;
    mastType: string;
  }>();
  const { data: cat, isLoading: catLoading } = useCategoryBySlug(category || "");
  const { data: subCategories, isLoading: subLoading } = useSubCategories(cat?.id);
  const tech = getTechnologyBySlug(technology || "");
  const mt = getMastTypeBySlug(mastType || "");

  if (catLoading || subLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cat || !tech || !mt) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase text-foreground">Not Found</h1>
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
        <Link to={`/category/${cat.slug}/t/${tech.slug}`} className="hover:text-primary">{tech.title}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{mt.title}</span>
      </nav>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Select Duty Level</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {mt.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{mt.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories?.map((sub) => (
          <Link
            key={sub.slug}
            to={`/category/${cat.slug}/t/${tech.slug}/${mt.slug}/${sub.slug}`}
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
              {sub.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{sub.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View Specifications <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MastTypePage;
