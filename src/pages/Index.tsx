import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Cog,
  Factory,
  Headphones,
  Loader2,
  Radio,
  Shield,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
  Building2,
  Cpu,
} from "lucide-react";
import { useCategories } from "@/hooks/use-products";
import { useReveal, useCounter } from "@/hooks/use-reveal";
import heroBanner from "@/assets/hero-banner.jpg";
import aboutFacility from "@/assets/about-facility.jpg";
import manufacturingCapabilities from "@/assets/manufacturing-capabilities.jpg";

/* ────────────────────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative overflow-hidden bg-white">
    {/* decorative red shapes */}
    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
    <div className="pointer-events-none absolute top-1/3 left-0 h-1 w-24 bg-primary" />
    <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-1 bg-primary/70" />

    <div className="container relative py-16 md:py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              Defence · Aerospace · Manufacturing
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase leading-[0.95] text-foreground mb-6">
            Precision
            <br />
            <span className="text-primary">Engineered</span>
            <br />
            for the Field.
          </h1>

          <p className="max-w-xl text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
            Precision Electronics designs and manufactures mission-critical telescopic masts, tripods, pedestals and
            junction systems for defence, surveillance and communication applications worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#products"
              className="group inline-flex items-center justify-center gap-2 rounded bg-primary px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-[0_10px_30px_-10px_hsl(2_76%_55%/0.55)] transition-all hover:bg-primary-dark hover:shadow-[0_14px_40px_-10px_hsl(2_76%_55%/0.7)]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded border-2 border-foreground/90 px-7 py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-white"
            >
              Contact Us
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Trust markers */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "ISO 9001", icon: Award },
              { label: "AS 9100 D", icon: ShieldCheck },
              { label: "Made in India", icon: Factory },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-2 text-muted-foreground">
                <m.icon className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs uppercase tracking-widest">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="relative animate-fade-in">
          {/* red frame */}
          <div className="absolute -top-4 -left-4 h-24 w-24 border-t-4 border-l-4 border-primary" />
          <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b-4 border-r-4 border-primary" />

          <div className="relative overflow-hidden rounded-lg shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">
            <img
              src={heroBanner}
              alt="Precision Electronics manufacturing"
              width={1600}
              height={900}
              className="h-[420px] md:h-[520px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-transparent" />

            {/* floating stat card */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-xs rounded-lg bg-white/95 backdrop-blur border border-border p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded bg-primary/10 p-2.5">
                  <Radio className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-foreground leading-none">15+ Years</p>
                  <p className="text-xs text-muted-foreground mt-1">Engineering defence-grade systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ────────────────────────────────────────────────────────────
   ABOUT
   ────────────────────────────────────────────────────────── */
const AboutSection = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} id="about" className="relative py-20 md:py-28 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative reveal-up">
            <div className="absolute -top-3 -left-3 h-full w-full border-2 border-primary/40 rounded-lg" />
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={aboutFacility}
                alt="Precision Electronics facility"
                loading="lazy"
                width={1280}
                height={960}
                className="h-[420px] md:h-[560px] w-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="reveal-up">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              — About Precision Electronics
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-foreground mb-6 leading-tight">
              Building the backbone of <span className="text-primary">critical communication</span> systems.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              For over 15 years, Precision Electronics has engineered mission-critical hardware trusted by defence
              forces, communication operators, and surveillance agencies. Every mast, tripod, and junction system is
              designed, tested, and manufactured in-house to withstand the world&apos;s most demanding environments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: "In-House Engineering", desc: "Design, prototyping and testing under one roof." },
                { title: "Certified Quality", desc: "ISO 9001 and AS 9100 D compliant processes." },
                { title: "Global Deployments", desc: "Field-proven across 20+ countries." },
                { title: "Rapid Turnaround", desc: "Vertically integrated supply chain." },
              ].map((f) => (
                <div key={f.title} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-heading font-bold uppercase text-sm text-foreground">{f.title}</p>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/category/telescopic-masts"
              className="group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-widest text-primary hover:text-primary-dark"
            >
              Discover our capabilities
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   PRODUCTS — vertical mega-nav on left, product grid on right
   ────────────────────────────────────────────────────────── */
const ProductsSection = () => {
  const { data: categories, isLoading } = useCategories();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active = useMemo(() => {
    if (!categories?.length) return null;
    const slug = activeSlug ?? categories[0].slug;
    return categories.find((c) => c.slug === slug) ?? categories[0];
  }, [categories, activeSlug]);

  return (
    <section id="products" className="relative py-20 md:py-28 bg-[hsl(0_0%_98%)]">
      <div className="container">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">— Our Products</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-foreground leading-tight">
            Engineered systems for
            <br />
            <span className="text-primary">every deployment scenario.</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Mobile tabs — wrap so no horizontal scroll */}
            <div className="lg:hidden mb-6">
              <div className="flex flex-wrap gap-2">
                {categories?.map((cat) => {
                  const isActive = active?.slug === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveSlug(cat.slug)}
                      className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-heading font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-white text-foreground border border-border hover:border-primary/50"
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
              {/* LEFT — vertical big-nav */}
              <aside className="hidden lg:block lg:col-span-5 xl:col-span-5">
                <ul className="space-y-2">
                  {categories?.map((cat) => {
                    const isActive = active?.slug === cat.slug;
                    return (
                      <li key={cat.slug}>
                        <button
                          onClick={() => setActiveSlug(cat.slug)}
                          className={`group w-full text-left flex items-center gap-4 py-4 border-b border-border/60 transition-colors ${
                            isActive ? "text-primary" : "text-foreground hover:text-primary"
                          }`}
                        >
                          <span
                            className={`transition-all overflow-hidden ${
                              isActive ? "w-8 opacity-100" : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                            }`}
                          >
                            <ArrowRight className="h-6 w-6" />
                          </span>
                          <span
                            className={`font-heading text-2xl md:text-3xl xl:text-4xl uppercase tracking-tight leading-none transition-all ${
                              isActive ? "font-bold" : "font-semibold group-hover:translate-x-1"
                            }`}
                          >
                            {cat.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* RIGHT — product display */}
              <div className="lg:col-span-7 xl:col-span-7">
                {active && (
                  <div key={active.slug} className="animate-fade-in">
                    {/* Hero card for active category */}
                    <div className="relative overflow-hidden rounded-lg mb-6 group">
                      <img
                        src={active.resolvedImage}
                        alt={active.title}
                        loading="lazy"
                        className="h-72 md:h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">
                          — Featured Category
                        </p>
                        <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase text-white mb-2">
                          {active.title}
                        </h3>
                        <p className="text-white/80 max-w-lg text-sm md:text-base mb-4">{active.description}</p>
                        <Link
                          to={`/category/${active.slug}`}
                          className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary-dark transition-colors"
                        >
                          Explore Products
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   INDUSTRIES
   ────────────────────────────────────────────────────────── */
const INDUSTRIES = [
  { icon: Shield, title: "Defence", desc: "Field-ready equipment for ground forces." },
  { icon: Radio, title: "Telecommunications", desc: "Reliable mast systems for networks." },
  { icon: Factory, title: "Manufacturing", desc: "Custom engineered production hardware." },
  { icon: Zap, title: "Power & Energy", desc: "Robust systems for utility grids." },
  { icon: Cog, title: "Industrial Automation", desc: "Precision components for automation." },
  { icon: Building2, title: "Infrastructure", desc: "Long-life installations, urban to remote." },
  { icon: Cpu, title: "Electronics", desc: "Enclosures and mounting for sensitive gear." },
  { icon: ShieldCheck, title: "Surveillance", desc: "Purpose-built platforms for observation." },
];

const IndustriesSection = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="py-20 md:py-28 bg-white">
      <div className="container">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">— Industries We Serve</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-foreground leading-tight">
              Trusted across
              <span className="text-primary"> critical sectors.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Our systems are deployed with defence agencies, telecom operators and infrastructure teams across the globe.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {INDUSTRIES.map((ind, i) => (
            <div
              key={ind.title}
              className="reveal-up group relative overflow-hidden rounded-lg border border-border bg-white p-6 transition-all hover:border-primary/60 hover:-translate-y-1 hover:shadow-lg"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {/* red corner accent on hover */}
              <div className="absolute top-0 right-0 h-1 w-0 bg-primary transition-all group-hover:w-full" />
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ind.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold uppercase text-foreground mb-1">{ind.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   WHY CHOOSE US
   ────────────────────────────────────────────────────────── */
const WHY = [
  {
    icon: Award,
    title: "Quality Assurance",
    desc: "Every unit is tested against defence-grade specifications before dispatch.",
  },
  {
    icon: Wrench,
    title: "Custom Manufacturing",
    desc: "Bespoke engineering to meet your exact operational requirements.",
  },
  {
    icon: Cpu,
    title: "Technical Expertise",
    desc: "In-house R&D team with decades of combined engineering experience.",
  },
  {
    icon: Truck,
    title: "Timely Delivery",
    desc: "Vertically integrated production for reliable, on-time fulfilment.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    desc: "Dedicated after-sales, training and field support worldwide.",
  },
  {
    icon: ShieldCheck,
    title: "Industry Experience",
    desc: "15+ years serving defence, telecom and industrial customers.",
  },
];

const WhyChooseUsSection = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="py-20 md:py-28 bg-[hsl(0_0%_98%)]">
      <div className="container">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">— Why Choose Us</p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-foreground leading-tight">
            The Precision <span className="text-primary">advantage.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {WHY.map((w, i) => (
            <div
              key={w.title}
              className="reveal-up group relative overflow-hidden rounded-lg bg-white p-7 border border-border transition-all hover:shadow-xl hover:border-primary/40"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* red side rail */}
              <div className="absolute left-0 top-0 h-full w-1 bg-primary/0 transition-colors group-hover:bg-primary" />
              <div className="flex items-start gap-4">
                <div className="shrink-0 rounded-lg bg-primary/10 p-3 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <w.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-foreground mb-1.5">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   MANUFACTURING CAPABILITIES — dark full-width
   ────────────────────────────────────────────────────────── */
const StatCounter = ({ value, suffix, label }: { value: number; suffix?: string; label: string }) => {
  const ref = useCounter(value);
  return (
    <div>
      <p className="font-heading text-5xl md:text-6xl font-bold text-white leading-none tracking-tight">
        <span ref={ref}>0</span>
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-white/60">{label}</p>
    </div>
  );
};

const CapabilitiesSection = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="relative overflow-hidden bg-surface-dark text-white">
      {/* subtle bg image */}
      <div className="absolute inset-0">
        <img src={manufacturingCapabilities} alt="" loading="lazy" className="h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0_0%_7%)]/95 via-[hsl(0_0%_7%)]/85 to-[hsl(0_0%_7%)]" />
      </div>
      {/* red accent line */}
      <div className="absolute top-0 left-0 h-1 w-32 bg-primary" />

      <div className="relative container py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 reveal-up">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
              — Manufacturing Capabilities
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight mb-6">
              From concept to
              <br />
              <span className="text-primary">battlefield-ready</span> hardware.
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Our vertically integrated facility combines CNC machining, precision fabrication, surface treatment and
              system assembly under one roof — enabling us to control quality at every stage.
            </p>
            <div className="space-y-3">
              {[
                "Multi-axis CNC machining & pneumatic assembly lines",
                "In-house environmental & load testing chambers",
                "Custom fabrication and finishing capabilities",
                "Full traceability with defence-grade documentation",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <p className="text-white/85">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-8 md:gap-10 reveal-up">
            <StatCounter value={200} suffix="+" label="Products Delivered" />
            <StatCounter value={50} suffix="+" label="Defence Clients" />
            <StatCounter value={20} suffix="+" label="Countries Deployed" />
            <StatCounter value={15} suffix="+" label="Years Of Expertise" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   CTA / CONTACT
   ────────────────────────────────────────────────────────── */
const CTASection = () => (
  <section id="contact" className="bg-white py-20 md:py-28">
    <div className="container">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(0_0%_10%)] to-[hsl(0_0%_15%)] p-10 md:p-16">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">— Get in touch</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-white leading-tight">
              Ready to spec your next
              <br />
              <span className="text-primary">deployment?</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-xl">
              Talk to our engineering team about custom masts, tripods, pedestals and junction systems tailored to your
              mission.
            </p>
          </div>
          <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/category/telescopic-masts"
              className="inline-flex items-center justify-center gap-2 rounded bg-primary px-6 py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary-dark transition-colors"
            >
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:sales@precision-electronics.com"
              className="inline-flex items-center justify-center gap-2 rounded border-2 border-white/30 px-6 py-3.5 font-heading text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-foreground transition-colors"
            >
              Request Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────── */
const Index = () => (
  <div>
    <HeroSection />
    <AboutSection />
    <ProductsSection />
    <IndustriesSection />
    <WhyChooseUsSection />
    <CapabilitiesSection />
    <CTASection />
  </div>
);

export default Index;
