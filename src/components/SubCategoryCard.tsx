import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";

interface SubCategoryCardProps {
  categorySlug: string;
  slug: string;
  title: string;
  description: string;
}

const SubCategoryCard = ({ categorySlug, slug, title, description }: SubCategoryCardProps) => {
  return (
    <Link
      to={`/category/${categorySlug}/${slug}`}
      className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/40 glow-border hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-md bg-primary/10 p-3">
          <Layers className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent">
            View Specs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SubCategoryCard;
