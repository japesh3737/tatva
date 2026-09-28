export type PortfolioCategory =
  | "Corporate Offices"
  | "Retail & Showrooms"
  | "Restaurants & Cafés"
  | "Hospitality"
  | "Healthcare & Professional Spaces";

export interface PortfolioProject {
  id: string;
  number: string;
  name: string;
  category: PortfolioCategory;
  location: string;
  year: string;
  description: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "Corporate Offices",
  "Retail & Showrooms",
  "Restaurants & Cafés",
  "Hospitality",
  "Healthcare & Professional Spaces",
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "meridian-corporate-suites",
    number: "01",
    name: "Meridian Corporate Suites",
    category: "Corporate Offices",
    location: "Bandra Kurla Complex, Mumbai",
    year: "2025",
    description:
      "A modern workplace planned around collaboration, focus and efficient movement. Warm materials and layered lighting create a calm, professional environment.",
  },
  {
    
    id: "petal-and-stone-salon",
    number: "02",
    name: "Petal & Stone Salon",
    category: "Retail & Showrooms",
    location: "Andheri West, Mumbai",
    year: "2024",
    description:
      "A calm, modern salon planned around comfortable styling stations and easy movement. Soft textures, arched mirrors and one bold floral wall give it a clear identity.",
  },
  
  {
    id: "saffron-and-slate-cafe",
    number: "03",
    name: "Saffron & Slate Café",
    category: "Restaurants & Cafés",
    location: "Bandra West, Mumbai",
    year: "2023",
    description:
      "A welcoming café balancing intimate seating with efficient service flow. Natural textures and custom joinery give the space a refined, lasting character.",
  },
  {
    id: "the-haven-boutique-hotel",
    number: "04",
    name: "The Haven Boutique Hotel",
    category: "Hospitality",
    location: "Juhu, Mumbai",
    year: "2025",
    description:
      "A boutique hospitality interior focused on comfort, arrival experience and quiet luxury. Guest areas are planned for a smooth, unhurried stay.",
  },
  {
    id: "clarity-wellness-clinic",
    number: "05",
    name: "Clarity Wellness Clinic",
    category: "Healthcare & Professional Spaces",
    location: "Powai, Mumbai",
    year: "2024",
    description:
      "A calm, clearly organized clinic designed for patient comfort and clinical efficiency. Soft finishes and intuitive circulation reduce stress for patients and staff.",
  },
];