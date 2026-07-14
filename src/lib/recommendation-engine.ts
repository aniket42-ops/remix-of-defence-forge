import rawCatalog from "@/data/product-catalog.json";

/**
 * Mast Recommendation Engine
 * Reads product-catalog.json and exposes a pure filter/rank pipeline.
 * Adding new products = editing the JSON. No code changes required.
 */

export type Technology = "Manual" | "Pneumatic" | "Electric" | "Manual Section";
export type Duty = "Light Duty" | "Medium Duty" | "Heavy Duty";
export type Mounting = "Vehicle" | "Ground" | "Building Rooftop" | "Vehicle Rooftop";
export type GuyedState = "Guyed" | "Unguyed";

/** Internal category → customer-facing Technology values. */
const CATEGORY_TECHNOLOGY_MAP: Record<string, Technology[]> = {
  push_up_masts_drive_on_frame_tripod_mast: ["Manual"],
  push_fit_masts_section_based_mast: ["Manual Section"],
  ptm_masts_ground_vehicle_building_roof_top_vehicle_roof_top_mount: ["Pneumatic"],
  tactical_lighting_system: ["Pneumatic"],
  winch_mast_manual_and_electric: ["Manual", "Electric"],
  section_based_mast_ground_mount: ["Manual Section"],
  lead_screw_type_mast: ["Electric"],
  vehicle_rooftop_masts: ["Manual", "Electric"],
};

/** Internal category → allowed mounting surfaces. */
const CATEGORY_MOUNTING_MAP: Record<string, Mounting[]> = {
  push_up_masts_drive_on_frame_tripod_mast: ["Ground", "Vehicle"],
  push_fit_masts_section_based_mast: ["Ground"],
  ptm_masts_ground_vehicle_building_roof_top_vehicle_roof_top_mount: [
    "Ground",
    "Vehicle",
    "Building Rooftop",
    "Vehicle Rooftop",
  ],
  tactical_lighting_system: ["Ground", "Vehicle"],
  winch_mast_manual_and_electric: ["Ground", "Vehicle"],
  section_based_mast_ground_mount: ["Ground"],
  lead_screw_type_mast: ["Ground", "Vehicle"],
  vehicle_rooftop_masts: ["Vehicle Rooftop"],
};

export interface Product {
  model_id: string;
  category: string;
  technologies: Technology[];
  mountings: Mounting[];
  duty: Duty;
  head_load_kg: number;
  extended_height_m: number | null;
  retracted_height_m: number | null;
  weight_of_mast_kg: number;
  wind_area_m2: number | null;
  wind_speed_op_kmph: number | null;
  wind_speed_survival_kmph: number | null;
  sway_deg: number | null;
  guyed: GuyedState;
  no_of_sections: string | number | null;
  material_grade: string | null;
  tube_dia_mm: string | number | null;
}

const numOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const cleaned = v.replace(/[≤<>±˚°~\s]/g, "").split(/[\/\-x×]/)[0];
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const parseWindSpeed = (v: unknown): { op: number | null; survival: number | null } => {
  if (typeof v !== "string") return { op: numOrNull(v), survival: null };
  const nums = v.match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return { op: null, survival: null };
  return { op: parseFloat(nums[0]), survival: nums[1] ? parseFloat(nums[1]) : null };
};

const parseSway = (v: unknown): number | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.match(/\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }
  return null;
};

const parseGuyed = (raw: Record<string, unknown>): GuyedState => {
  const values = [
    raw.no_of_guy_ropes,
    raw.ground_mount_no_of_guy_ropes,
    raw.tripod_mount_no_of_guy_ropes,
  ];
  for (const v of values) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string") {
      const t = v.trim();
      if (t === "" || t === "-") continue;
      return "Guyed";
    }
    if (typeof v === "number") return "Guyed";
  }
  return "Unguyed";
};

export const calculateDuty = (weight_kg: number): Duty => {
  if (weight_kg <= 30) return "Light Duty";
  if (weight_kg <= 80) return "Medium Duty";
  return "Heavy Duty";
};

const normaliseProduct = (category: string, raw: Record<string, unknown>): Product => {
  const weight = numOrNull(raw.weight_of_mast_kg) ?? 0;
  const winds = parseWindSpeed(raw.wind_speed_operational_survival_kmph);
  const extended = numOrNull(raw.extended_height_m ?? raw.erected_height_m);
  const retracted = numOrNull(raw.retracted_height_m);
  return {
    model_id: String(raw.model_id),
    category,
    technologies: CATEGORY_TECHNOLOGY_MAP[category] ?? [],
    mountings: CATEGORY_MOUNTING_MAP[category] ?? [],
    duty: calculateDuty(weight),
    head_load_kg: numOrNull(raw.head_load_kg) ?? 0,
    extended_height_m: extended,
    retracted_height_m: retracted,
    weight_of_mast_kg: weight,
    wind_area_m2: numOrNull(raw.wind_area_m2),
    wind_speed_op_kmph: winds.op,
    wind_speed_survival_kmph: winds.survival,
    sway_deg: parseSway(raw.sway),
    guyed: parseGuyed(raw),
    no_of_sections: (raw.no_of_sections as string | number | null) ?? null,
    material_grade: (raw.material_grade as string | null) ?? null,
    tube_dia_mm: (raw.tube_dia_mm as string | number | null) ?? null,
  };
};

const flattenCatalog = (): Product[] => {
  const out: Product[] = [];
  const walk = (category: string, node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach((row) => out.push(normaliseProduct(category, row as Record<string, unknown>)));
    } else if (node && typeof node === "object") {
      Object.values(node as Record<string, unknown>).forEach((child) => walk(category, child));
    }
  };
  Object.entries(rawCatalog as Record<string, unknown>).forEach(([category, node]) =>
    walk(category, node),
  );
  return out;
};

export const ALL_PRODUCTS: Product[] = flattenCatalog();

export const TECHNOLOGY_OPTIONS: Technology[] = Array.from(
  new Set(ALL_PRODUCTS.flatMap((p) => p.technologies)),
).sort() as Technology[];

export const MOUNTING_OPTIONS: Mounting[] = [
  "Vehicle",
  "Ground",
  "Building Rooftop",
  "Vehicle Rooftop",
];

export interface SelectorInput {
  payload_kg?: number;
  technology?: Technology;
  mounting?: Mounting;
  guyed?: GuyedState;
  wind_area_m2?: number;
  wind_speed_kmph?: number;
  sway_deg?: number;
  extended_height_m?: number;
  retracted_height_m?: number;
  duty?: Duty;
}

const passesHeadLoad = (p: Product, t?: number) => t === undefined || p.head_load_kg >= t;
const passesTechnology = (p: Product, t?: Technology) =>
  t === undefined || p.technologies.includes(t);
const passesMounting = (p: Product, t?: Mounting) => t === undefined || p.mountings.includes(t);
const passesGuyed = (p: Product, t?: GuyedState) => t === undefined || p.guyed === t;
const passesWindArea = (p: Product, t?: number) =>
  t === undefined || p.wind_area_m2 === null || p.wind_area_m2 >= t;
const passesWindSpeed = (p: Product, t?: number) =>
  t === undefined || p.wind_speed_op_kmph === null || p.wind_speed_op_kmph >= t;
const passesSway = (p: Product, t?: number) =>
  t === undefined || p.sway_deg === null || p.sway_deg <= t;
const passesHeights = (p: Product, ext?: number, retr?: number) => {
  if (ext !== undefined && p.extended_height_m !== null && p.extended_height_m !== ext) return false;
  if (retr !== undefined && p.retracted_height_m !== null && p.retracted_height_m !== retr) return false;
  return true;
};
const passesDuty = (p: Product, t?: Duty) => t === undefined || p.duty === t;

export const filterExact = (input: SelectorInput, pool: Product[] = ALL_PRODUCTS): Product[] =>
  pool.filter(
    (p) =>
      passesHeadLoad(p, input.payload_kg) &&
      passesTechnology(p, input.technology) &&
      passesDuty(p, input.duty) &&
      passesMounting(p, input.mounting) &&
      passesGuyed(p, input.guyed) &&
      passesWindArea(p, input.wind_area_m2) &&
      passesWindSpeed(p, input.wind_speed_kmph) &&
      passesSway(p, input.sway_deg) &&
      passesHeights(p, input.extended_height_m, input.retracted_height_m),
  );

export interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
}

const rankProduct = (p: Product, input: SelectorInput): Recommendation => {
  const reasons: string[] = [];
  let score = 0;

  if (input.technology) {
    if (p.technologies.includes(input.technology)) {
      score += 100;
      reasons.push("Same technology maintained.");
    } else {
      score -= 100;
      reasons.push(`Technology adjusted to ${p.technologies.join(" / ")}.`);
    }
  }

  const desiredDuty =
    input.duty ?? (input.payload_kg !== undefined ? calculateDuty(input.payload_kg) : undefined);
  if (desiredDuty) {
    if (p.duty === desiredDuty) {
      score += 50;
      reasons.push("Same duty maintained.");
    } else {
      score -= 20;
      reasons.push(`Duty adjusted from ${desiredDuty} to ${p.duty}.`);
    }
  }

  if (input.payload_kg !== undefined) {
    const diff = p.head_load_kg - input.payload_kg;
    const absDiff = Math.abs(diff);
    if (diff >= 0 && absDiff <= 2) {
      score += 40;
      if (absDiff > 0) reasons.push(`Payload increased by ${absDiff.toFixed(1)} kg to meet requirement.`);
    } else if (diff >= 0) {
      score += Math.max(0, 30 - absDiff);
      reasons.push(`Payload increased by ${absDiff.toFixed(1)} kg to meet requirement.`);
    } else {
      score -= absDiff;
      reasons.push(`Payload reduced by ${absDiff.toFixed(1)} kg — verify structural suitability.`);
    }
  }

  if (input.extended_height_m !== undefined && p.extended_height_m !== null) {
    const diff = Math.abs(p.extended_height_m - input.extended_height_m);
    if (diff === 0) score += 30;
    else if (diff <= 2) {
      score += 20;
      reasons.push(`Height adjusted from ${input.extended_height_m} m to ${p.extended_height_m} m.`);
    } else {
      score += Math.max(0, 15 - diff);
      reasons.push(`Height adjusted from ${input.extended_height_m} m to ${p.extended_height_m} m.`);
    }
  }
  if (input.retracted_height_m !== undefined && p.retracted_height_m !== null) {
    const diff = Math.abs(p.retracted_height_m - input.retracted_height_m);
    if (diff <= 0.5) score += 10;
    else score += Math.max(0, 8 - diff * 2);
  }

  if (input.mounting) {
    if (p.mountings.includes(input.mounting)) score += 10;
    else reasons.push(`Preferred ${input.mounting} mount not available; nearest option shown.`);
  }
  if (input.guyed) {
    if (p.guyed === input.guyed) score += 6;
    else reasons.push(`${input.guyed} configuration not available in this option.`);
  }
  if (input.wind_area_m2 !== undefined && p.wind_area_m2 !== null) {
    score += p.wind_area_m2 >= input.wind_area_m2 ? 5 : -3;
  }
  if (input.wind_speed_kmph !== undefined && p.wind_speed_op_kmph !== null) {
    score += p.wind_speed_op_kmph >= input.wind_speed_kmph ? 5 : -3;
  }
  if (input.sway_deg !== undefined && p.sway_deg !== null) {
    score += p.sway_deg <= input.sway_deg ? 4 : -2;
  }

  return { product: p, score, reasons: Array.from(new Set(reasons)) };
};

export const rankClosestMatches = (
  input: SelectorInput,
  pool: Product[] = ALL_PRODUCTS,
): Recommendation[] => {
  let workingPool = pool;
  if (input.technology) {
    const sameTech = pool.filter((p) => p.technologies.includes(input.technology!));
    if (sameTech.length > 0) workingPool = sameTech;
  }
  return workingPool.map((p) => rankProduct(p, input)).sort((a, b) => b.score - a.score);
};

export interface RecommendationResult {
  exact: Product[];
  suggestions: Recommendation[];
  message: string;
}

export const recommend = (input: SelectorInput): RecommendationResult => {
  const exact = filterExact(input);
  if (exact.length > 0) {
    return {
      exact,
      suggestions: [],
      message: `${exact.length} exact match${exact.length > 1 ? "es" : ""} found.`,
    };
  }
  const suggestions = rankClosestMatches(input).slice(0, 3);
  return {
    exact: [],
    suggestions,
    message:
      "No exact product matches your requirements. The following products are the closest available options.",
  };
};