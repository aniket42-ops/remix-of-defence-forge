import { useCategories } from "@/hooks/use-products";
import CategoryCard from "@/components/CategoryCard";
import { Shield, ChevronDown, Loader2 } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Defence Manufacturing" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navbar/70" />
        </div>
        <div className="relative container py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-6">
            <Shield className="h-4 w-4 text-white" />
            <span className="font-mono text-xs uppercase tracking-widest text-white">Defence Grade Equipment</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-wider text-white mb-4">
            Defence Manufacturing<br />
            <span className="text-accent">Services</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 mb-8">
            Precision-engineered telescopic masts, tripods, pedestals and junction systems 
            for military, surveillance and communication applications.
          </p>
          <a
            href="#catalogue"
            className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse Catalogue
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Categories */}
      <section id="catalogue" className="container py-16">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">Product Categories</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-foreground">
            Equipment Catalogue
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((cat) => (
              <CategoryCard
                key={cat.slug}
                slug={cat.slug}
                title={cat.title}
                description={cat.description}
                image={cat.resolvedImage}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-card tech-grid">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "15+", label: "Years Experience" },
              { value: "200+", label: "Products Delivered" },
              { value: "50+", label: "Defence Clients" },
              { value: "ISO 9001", label: "Certified" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-bold text-primary">{stat.value}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
