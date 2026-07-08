import { useParams, Link } from "react-router-dom";
import { useCategoryBySlug, useSubCategories } from "@/hooks/use-products";
import { isMultiStepCategory, TECHNOLOGIES } from "@/data/catalogue";
import SubCategoryCard from "@/components/SubCategoryCard";
import { ChevronRight, Loader2 } from "lucide-react";

import techVehicleMounted from "@/assets/tech-vehicle-mounted.jpg";
import techGroundDeployment from "@/assets/tech-ground-deployment.jpg";
import techBuildingRoof from "@/assets/tech-building-roof.jpg";
import techVehicleRoof from "@/assets/tech-vehicle-roof.jpg";

const techImages: Record<string, string> = {
  "vehicle-mounted": techVehicleMounted,
  "ground-deployment": techGroundDeployment,
  "building-roof-mounted": techBuildingRoof,
  "vehicle-roof-mounted": techVehicleRoof,
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

      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
            {isMultiStep ? "Select Technology" : "Sub Categories"}
          </p>
          <h1 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
            {cat.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{cat.description}</p>
        </div>
        {isMultiStep && (
          <Link
            to="/selector"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-md bg-primary px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Use Mast Selector <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {isMultiStep ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNOLOGIES.map((tech) => (
            <Link
              key={tech.slug}
              to={`/category/${cat.slug}/t/${tech.slug}`}
              className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={techImages[tech.slug]}
                  alt={tech.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                  {tech.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{tech.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Select <ChevronRight className="h-3 w-3" />
                </div>
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
