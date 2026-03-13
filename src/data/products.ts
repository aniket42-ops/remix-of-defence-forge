export interface ProductVariant {
  modelNo: string;
  heightRetracted: number;
  heightErected: number;
  headLoad: number;
  windArea: number;
  windSpeedOperational: number;
  windSpeedSurvival: number;
  sway: string;
  weight: number;
  sections: number;
  tubeDia: string;
  guyRopes: string;
  tripodWeight: number;
  basePrice: number;
}

export interface SubCategory {
  slug: string;
  title: string;
  description: string;
  variants: ProductVariant[];
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  image: string;
  subCategories: SubCategory[];
}

// Using string paths that map to imports
import telescopicMastsImg from "@/assets/telescopic-masts.jpg";
import tripodsImg from "@/assets/tripods.jpg";
import pedestalsImg from "@/assets/pedestals.jpg";
import junctionBoxImg from "@/assets/junction-box.jpg";

export const categories: Category[] = [
  {
    slug: "telescopic-masts",
    title: "Telescopic Masts",
    description: "Pneumatic telescopic masts for communication, surveillance and electronic warfare applications.",
    image: telescopicMastsImg,
    subCategories: [
      {
        slug: "light-duty",
        title: "Light Duty PTM Masts",
        description: "Lightweight portable masts for rapid deployment.",
        variants: [
          {
            modelNo: "PP15P-5-1.7M-01",
            heightRetracted: 1.7,
            heightErected: 5,
            headLoad: 15,
            windArea: 0.25,
            windSpeedOperational: 80,
            windSpeedSurvival: 120,
            sway: "<2°",
            weight: 18,
            sections: 5,
            tubeDia: "40-80",
            guyRopes: "3 x 2",
            tripodWeight: 6,
            basePrice: 35000,
          },
          {
            modelNo: "PP15P-6-1.8M-01",
            heightRetracted: 1.8,
            heightErected: 6,
            headLoad: 15,
            windArea: 0.25,
            windSpeedOperational: 80,
            windSpeedSurvival: 120,
            sway: "<2°",
            weight: 22,
            sections: 6,
            tubeDia: "40-85",
            guyRopes: "3 x 2",
            tripodWeight: 7,
            basePrice: 40000,
          },
          {
            modelNo: "PP10P-8-2.0M-01",
            heightRetracted: 2.0,
            heightErected: 8,
            headLoad: 10,
            windArea: 0.2,
            windSpeedOperational: 75,
            windSpeedSurvival: 110,
            sway: "<2.5°",
            weight: 28,
            sections: 7,
            tubeDia: "45-90",
            guyRopes: "3 x 3",
            tripodWeight: 8,
            basePrice: 48000,
          },
        ],
      },
      {
        slug: "medium-duty",
        title: "Medium Duty PTM Masts",
        description: "Medium payload masts for semi-permanent installations.",
        variants: [
          {
            modelNo: "PP15P-9-2.5M-01",
            heightRetracted: 2.5,
            heightErected: 9,
            headLoad: 25,
            windArea: 0.35,
            windSpeedOperational: 90,
            windSpeedSurvival: 130,
            sway: "<1.5°",
            weight: 38,
            sections: 7,
            tubeDia: "50-100",
            guyRopes: "3 x 3",
            tripodWeight: 12,
            basePrice: 65000,
          },
          {
            modelNo: "PP25P-12-2.8M-01",
            heightRetracted: 2.8,
            heightErected: 12,
            headLoad: 25,
            windArea: 0.4,
            windSpeedOperational: 85,
            windSpeedSurvival: 125,
            sway: "<1.5°",
            weight: 48,
            sections: 8,
            tubeDia: "55-110",
            guyRopes: "3 x 3",
            tripodWeight: 15,
            basePrice: 78000,
          },
        ],
      },
      {
        slug: "heavy-duty",
        title: "Heavy Duty PTM Masts",
        description: "Heavy payload masts for permanent installations and large antenna systems.",
        variants: [
          {
            modelNo: "PP40P-15-3.3M-01",
            heightRetracted: 3.3,
            heightErected: 15,
            headLoad: 40,
            windArea: 0.5,
            windSpeedOperational: 100,
            windSpeedSurvival: 150,
            sway: "<1°",
            weight: 72,
            sections: 9,
            tubeDia: "60-130",
            guyRopes: "3 x 4",
            tripodWeight: 22,
            basePrice: 120000,
          },
          {
            modelNo: "PP50P-18-3.8M-01",
            heightRetracted: 3.8,
            heightErected: 18,
            headLoad: 50,
            windArea: 0.6,
            windSpeedOperational: 95,
            windSpeedSurvival: 140,
            sway: "<1°",
            weight: 95,
            sections: 10,
            tubeDia: "65-140",
            guyRopes: "3 x 4",
            tripodWeight: 28,
            basePrice: 155000,
          },
        ],
      },
    ],
  },
  {
    slug: "tripods",
    title: "Tripods",
    description: "Precision-engineered tripod systems for stable equipment mounting in field conditions.",
    image: tripodsImg,
    subCategories: [
      {
        slug: "standard-tripods",
        title: "Standard Tripods",
        description: "General purpose tripod mounting systems.",
        variants: [
          {
            modelNo: "TR-STD-01",
            heightRetracted: 0.8,
            heightErected: 1.5,
            headLoad: 30,
            windArea: 0.15,
            windSpeedOperational: 100,
            windSpeedSurvival: 150,
            sway: "<0.5°",
            weight: 12,
            sections: 3,
            tubeDia: "35-50",
            guyRopes: "N/A",
            tripodWeight: 12,
            basePrice: 22000,
          },
        ],
      },
      {
        slug: "heavy-tripods",
        title: "Heavy Duty Tripods",
        description: "Heavy duty tripod systems for large payloads.",
        variants: [
          {
            modelNo: "TR-HD-01",
            heightRetracted: 1.0,
            heightErected: 2.0,
            headLoad: 60,
            windArea: 0.2,
            windSpeedOperational: 110,
            windSpeedSurvival: 160,
            sway: "<0.3°",
            weight: 25,
            sections: 3,
            tubeDia: "50-70",
            guyRopes: "N/A",
            tripodWeight: 25,
            basePrice: 38000,
          },
        ],
      },
    ],
  },
  {
    slug: "pedestals",
    title: "Pedestals",
    description: "Robust pedestal mounting solutions for fixed and mobile platform integration.",
    image: pedestalsImg,
    subCategories: [
      {
        slug: "fixed-pedestals",
        title: "Fixed Pedestals",
        description: "Permanent installation pedestal systems.",
        variants: [
          {
            modelNo: "PD-FX-500",
            heightRetracted: 0.5,
            heightErected: 0.5,
            headLoad: 100,
            windArea: 0.1,
            windSpeedOperational: 120,
            windSpeedSurvival: 180,
            sway: "<0.1°",
            weight: 45,
            sections: 1,
            tubeDia: "150",
            guyRopes: "N/A",
            tripodWeight: 0,
            basePrice: 55000,
          },
        ],
      },
      {
        slug: "rotary-pedestals",
        title: "Rotary Pedestals",
        description: "360° rotation pedestal platforms.",
        variants: [
          {
            modelNo: "PD-RT-360",
            heightRetracted: 0.6,
            heightErected: 0.6,
            headLoad: 80,
            windArea: 0.12,
            windSpeedOperational: 110,
            windSpeedSurvival: 170,
            sway: "<0.2°",
            weight: 55,
            sections: 1,
            tubeDia: "180",
            guyRopes: "N/A",
            tripodWeight: 0,
            basePrice: 85000,
          },
        ],
      },
    ],
  },
  {
    slug: "junction-box",
    title: "Multi Function Active Junction Box",
    description: "Advanced multi-function junction boxes for signal routing and power distribution.",
    image: junctionBoxImg,
    subCategories: [
      {
        slug: "standard-junction",
        title: "Standard Junction Box",
        description: "Standard configuration junction boxes.",
        variants: [
          {
            modelNo: "MFAJB-STD-01",
            heightRetracted: 0.3,
            heightErected: 0.3,
            headLoad: 0,
            windArea: 0.05,
            windSpeedOperational: 150,
            windSpeedSurvival: 200,
            sway: "N/A",
            weight: 8,
            sections: 1,
            tubeDia: "N/A",
            guyRopes: "N/A",
            tripodWeight: 0,
            basePrice: 42000,
          },
        ],
      },
      {
        slug: "advanced-junction",
        title: "Advanced Junction Box",
        description: "Multi-channel advanced junction systems.",
        variants: [
          {
            modelNo: "MFAJB-ADV-01",
            heightRetracted: 0.4,
            heightErected: 0.4,
            headLoad: 0,
            windArea: 0.06,
            windSpeedOperational: 150,
            windSpeedSurvival: 200,
            sway: "N/A",
            weight: 12,
            sections: 1,
            tubeDia: "N/A",
            guyRopes: "N/A",
            tripodWeight: 0,
            basePrice: 68000,
          },
        ],
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getSubCategory(categorySlug: string, subSlug: string): SubCategory | undefined {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subCategories.find((s) => s.slug === subSlug);
}
