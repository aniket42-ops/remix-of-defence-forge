import { BarChart3, Package, DollarSign, FileText } from "lucide-react";
import { categories } from "@/data/products";

const AdminDashboard = () => {
  const totalVariants = categories.reduce(
    (acc, cat) => acc + cat.subCategories.reduce((a, sub) => a + sub.variants.length, 0),
    0
  );

  const stats = [
    { label: "Categories", value: categories.length, icon: BarChart3, color: "text-primary" },
    { label: "Product Variants", value: totalVariants, icon: Package, color: "text-tech-green" },
    { label: "Pending Quotes", value: 0, icon: FileText, color: "text-accent" },
    { label: "Revenue (est.)", value: "₹ 0", icon: DollarSign, color: "text-warning" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wider text-foreground mb-6">
        Dashboard
      </h1>
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
