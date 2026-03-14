import { useParams, Link } from "react-router-dom";
import { useCategoryBySlug } from "@/hooks/use-products";
import { getTechnologyBySlug, getMastTypesForTechnology } from "@/data/catalogue";
import { ChevronRight, Loader2 } from "lucide-react";

const TechnologyPage = () => {
  const { category, technology } = useParams<{ category: string; technology: string }>();
  const { data: cat, isLoading } = useCategoryBySlug(category || "");
  const tech = getTechnologyBySlug(technology || "");
  const mastTypes = getMastTypesForTechnology(technology || "");

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cat || !tech) {
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
        <span className="text-foreground">{tech.title}</span>
      </nav>

      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Select Mast Type</p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {tech.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{tech.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mastTypes.map((mt) => (
          <Link
            key={mt.slug}
            to={`/category/${cat.slug}/t/${tech.slug}/${mt.slug}`}
            className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="mb-2 inline-flex items-center rounded bg-primary/10 px-2 py-1">
              <span className="font-mono text-xs font-bold text-primary">{mt.initials}</span>
            </div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
              {mt.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">{mt.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Select <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TechnologyPage;
