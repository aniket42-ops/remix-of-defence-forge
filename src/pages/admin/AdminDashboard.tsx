import { BarChart3, Package, DollarSign, FileText, Loader2 } from "lucide-react";
import { useAllCategoriesWithData, useQuotes } from "@/hooks/use-products";

const AdminDashboard = () => {
  const { data: categories, isLoading: catLoading } = useAllCategoriesWithData();
  const { data: quotes, isLoading: quotesLoading } = useQuotes();

  if (catLoading || quotesLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const totalVariants = categories?.reduce(
    (acc, cat) => acc + cat.subCategories.reduce((a, sub) => a + sub.variants.length, 0),
    0
  ) || 0;

  const pendingQuotes = quotes?.filter((q) => q.status === "new").length || 0;

  const stats = [
    { label: "Categories", value: categories?.length || 0, icon: BarChart3, color: "text-primary" },
    { label: "Product Variants", value: totalVariants, icon: Package, color: "text-tech-green" },
    { label: "Pending Quotes", value: pendingQuotes, icon: FileText, color: "text-accent" },
    { label: "Total Quotes", value: quotes?.length || 0, icon: DollarSign, color: "text-warning" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
