export interface ProjectGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TimelinePhase {
  number: string;
  phase: string;
  duration: string;
  description: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  category: string;
  location: string;
  year: string;
  area: string;
  coverImage: ProjectGalleryImage;
  overview: string;
  clientRequirements: string[];
  designConcept: string;
  spacePlanning: string;
  materials: { element: string; material: string }[];
  gallery: ProjectGalleryImage[];
  timeline: TimelinePhase[];
  ctaLabel: string;
}

export const SAFFRON_SLATE_CAFE: ProjectDetail = {
  id: "saffron-and-slate-cafe",
  name: "Saffron & Slate Café",
  category: "Restaurants & Cafés",
  location: "Bandra West, Mumbai",
  year: "2023",
  area: "1,800 sq. ft.",
  coverImage: {
    src: "/project-photos/portfolio/saffron-and-slate-cafe/cover.jpg",
    alt: "Saffron & Slate Café interior with warm seating and pendant lighting",
    caption: "SAMPLE PROJECT — Main dining area",
  },
  overview:
    "Saffron & Slate Café is a sample commercial project in Bandra West, designed as a warm and welcoming neighbourhood café. The brief called for an interior that feels intimate during quiet hours and remains efficient during peak service. The design brings together natural textures, layered lighting and custom joinery to create a refined, lasting character.",
  clientRequirements: [
    "Seating for approximately 45 guests across a mix of table sizes",
    "A warm, inviting atmosphere that supports both short visits and longer stays",
    "An efficient service flow between the counter, kitchen and dining area",
    "Durable, easy-to-maintain materials suited to daily commercial use",
    "A distinctive interior that reflects the café's identity",
    "Completion within a defined budget and opening schedule",
  ],
  designConcept:
    "The concept balances warmth and restraint. A palette of deep terracotta, warm timber and dark slate creates a grounded, comfortable setting, while soft, layered lighting shifts the mood from a bright daytime café to a quieter evening space. Custom joinery and a feature counter act as the focal points, keeping the design purposeful rather than decorative.",
  spacePlanning:
    "The layout is organized into three zones: a compact entry and counter area, a central dining floor, and a quieter seating edge along the windows. Circulation paths are kept clear between the counter, kitchen pass and tables so service remains smooth at busy times. Banquette seating along the walls increases capacity without crowding the floor, and flexible tables allow groups of two to six.",
  materials: [
    { element: "Flooring", material: "Textured vitrified tile with a stone finish" },
    { element: "Counter", material: "Slate-finish top with timber-panelled front" },
    { element: "Seating", material: "Upholstered banquettes with durable, wipe-clean fabric" },
    { element: "Walls", material: "Warm terracotta paint with timber slat detailing" },
    { element: "Lighting", material: "Brass pendant fixtures with warm, dimmable lamps" },
    { element: "Joinery", material: "Custom veneer-finish shelving and service units" },
  ],
  gallery: [
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-1.jpg",
      alt: "Café counter with slate-finish top and timber panelling",
      caption: "SERVICE COUNTER — Slate and timber detailing",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-2.jpg",
      alt: "Banquette seating along the café wall",
      caption: "BANQUETTE SEATING — Comfortable wall-side seating",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-3.jpg",
      alt: "Pendant lighting above café tables",
      caption: "LIGHTING — Layered pendant fixtures",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-4.jpg",
      alt: "Window seating area in the café",
      caption: "WINDOW EDGE — Quiet seating with natural light",
    },
  ],
  timeline: [
    {
      number: "01",
      phase: "Consultation & Site Assessment",
      duration: "Week 1",
      description: "Brief discussion, site measurement and review of constraints.",
    },
    {
      number: "02",
      phase: "Concept & Layout Development",
      duration: "Weeks 2–3",
      description: "Space planning, mood direction and 3D visuals for review.",
    },
    {
      number: "03",
      phase: "Design Approval & Documentation",
      duration: "Week 4",
      description: "Final design sign-off and preparation of drawings and specifications.",
    },
    {
      number: "04",
      phase: "Execution",
      duration: "Weeks 5–9",
      description: "Contractor coordination, joinery, finishing and site supervision.",
    },
    {
      number: "05",
      phase: "Final Handover",
      duration: "Week 10",
      description: "Quality checks, snagging and handover of the completed café.",
    },
  ],
  ctaLabel: "Discuss Your Project",
};