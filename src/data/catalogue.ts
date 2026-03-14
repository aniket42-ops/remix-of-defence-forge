// Static catalogue navigation data for multi-step product selection flow

export interface Technology {
  slug: string;
  title: string;
  description: string;
}

export interface MastType {
  slug: string;
  title: string;
  initials: string;
  technologies: string[];
  description: string;
}

export const TECHNOLOGIES: Technology[] = [
  {
    slug: "vehicle-mounted",
    title: "Vehicle Mounted",
    description: "Mast systems designed for vehicle-integrated deployment with rapid setup capabilities",
  },
  {
    slug: "ground-deployment",
    title: "Ground Deployment",
    description: "Portable mast systems for ground-level field deployment in diverse terrains",
  },
  {
    slug: "building-roof-mounted",
    title: "Building Roof Mounted",
    description: "Mast systems engineered for permanent or semi-permanent rooftop installations",
  },
  {
    slug: "vehicle-roof-mounted",
    title: "Vehicle Roof Mounted",
    description: "Compact mast systems optimized for vehicle roof integration",
  },
];

export const MAST_TYPES: MastType[] = [
  {
    slug: "pushup-masts",
    title: "Pushup Masts",
    initials: "PU",
    technologies: ["vehicle-mounted", "ground-deployment"],
    description: "Manual push-up telescopic masts for lightweight field applications",
  },
  {
    slug: "electromechanical-masts",
    title: "Electromechanical Masts",
    initials: "EM",
    technologies: ["vehicle-mounted", "ground-deployment"],
    description: "Motor-driven telescopic masts with precise height control",
  },
  {
    slug: "pneumatic-masts",
    title: "Pneumatic Masts",
    initials: "PN",
    technologies: ["vehicle-mounted", "ground-deployment"],
    description: "Air-pressure operated masts for rapid deployment scenarios",
  },
  {
    slug: "vehicular-rooftop-masts",
    title: "Vehicular Rooftop Masts",
    initials: "VR",
    technologies: ["vehicle-mounted", "vehicle-roof-mounted"],
    description: "Purpose-built masts for vehicle roof mounting with low profile",
  },
  {
    slug: "winch-masts",
    title: "Winch Masts",
    initials: "WM",
    technologies: ["ground-deployment"],
    description: "Cable-winch operated masts for heavy-duty ground applications",
  },
  {
    slug: "building-rooftop-tripod-masts",
    title: "Building Rooftop Tripod Masts",
    initials: "BT",
    technologies: ["building-roof-mounted"],
    description: "Tripod-based mast systems for stable rooftop deployment",
  },
  {
    slug: "detachable-section-masts",
    title: "Detachable Section Based Masts",
    initials: "DS",
    technologies: ["ground-deployment"],
    description: "Modular section-based masts for transport-friendly deployment",
  },
  {
    slug: "tactical-lighting",
    title: "Tactical Lighting System",
    initials: "TL",
    technologies: ["ground-deployment"],
    description: "Mast-integrated tactical lighting for field operations",
  },
];

export function getMastTypesForTechnology(techSlug: string): MastType[] {
  return MAST_TYPES.filter((mt) => mt.technologies.includes(techSlug));
}

export function getMastTypeBySlug(slug: string): MastType | undefined {
  return MAST_TYPES.find((mt) => mt.slug === slug);
}

export function getTechnologyBySlug(slug: string): Technology | undefined {
  return TECHNOLOGIES.find((t) => t.slug === slug);
}

// Categories that use the technology → mast type → duty level flow
export const MULTI_STEP_CATEGORIES = ["telescopic-masts"];

export function isMultiStepCategory(categorySlug: string): boolean {
  return MULTI_STEP_CATEGORIES.includes(categorySlug);
}
