import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-heading text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              DefenceTech Manufacturing Services
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} All rights reserved. Defence & Aerospace Equipment.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
