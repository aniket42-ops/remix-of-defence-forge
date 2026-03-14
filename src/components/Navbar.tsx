import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/category/telescopic-masts", label: "Products" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navbar shadow-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-navbar-foreground" />
          <div>
            <span className="font-heading text-lg font-bold uppercase tracking-widest text-navbar-foreground">
              Precision
            </span>
            <span className="ml-1 font-heading text-xs uppercase tracking-wider text-navbar-foreground/70">
              Electronics
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-5 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                location.pathname === link.to
                  ? "text-white bg-white/15"
                  : "text-navbar-foreground/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-navbar-foreground/80 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-navbar px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium uppercase tracking-wider ${
                location.pathname === link.to
                  ? "text-white bg-white/15"
                  : "text-navbar-foreground/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;