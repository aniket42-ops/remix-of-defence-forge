import { useParams, Link } from "react-router-dom";
import { useCategoryBySlug, useSubCategories } from "@/hooks/use-products";
import { isMultiStepCategory, TECHNOLOGIES } from "@/data/catalogue";
import SubCategoryCard from "@/components/SubCategoryCard";
import { ChevronRight, Loader2, Truck, Target, Building, Car } from "lucide-react";

const techIcons: Record<string, React.ReactNode> = {
  "vehicle-mounted": <Truck className="h-8 w-8" />,
  "ground-deployment": <Target className="h-8 w-8" />,
  "building-roof-mounted": <Building className="h-8 w-8" />,
  "vehicle-roof-mounted": <Car className="h-8 w-8" />,
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { data: cat, isLoading: catLoading } = useCategoryBySlug(category || "");
  const { data: subCategories, isLoading: subLoading } = useSubCategories(cat?.id);
  const isMultiStep = isMultiStepCategory(category || "");

  if (catLoading || (!isMultiStep && subLoading)) {
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
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
          {isMultiStep ? "Select Technology" : "Sub Categories"}
        </p>
        <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
          {cat.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{cat.description}</p>
      </div>

      {isMultiStep ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNOLOGIES.map((tech) => (
            <Link
              key={tech.slug}
              to={`/category/${cat.slug}/t/${tech.slug}`}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 text-primary">{techIcons[tech.slug]}</div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                {tech.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{tech.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Select <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default CategoryPage;
