import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
}

const CategoryCard = ({ slug, title, description, image }: CategoryCardProps) => {
  return (
    <Link
      to={`/category/${slug}`}
      className="group block rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 glow-border hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground mb-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent">
          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
