import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { BarChart3, Package, DollarSign, FileText, Settings, User, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { to: "/admin/quotes", label: "Quotes", icon: FileText },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user, role, hasAccess, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !hasAccess) {
    return <Navigate to="/login" replace />;
  }

  const roleBadgeColor = {
    admin: "bg-primary/20 text-primary",
    subadmin: "bg-tech-green/20 text-tech-green",
    sales: "bg-accent/20 text-accent",
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-card hidden md:block">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">
              Admin Panel
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
          {role && (
            <span className={`mt-1 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${roleBadgeColor[role]}`}>
              {role}
            </span>
          )}
        </div>
        <nav className="p-2 space-y-0.5">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card flex">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs ${
              location.pathname === link.to
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
