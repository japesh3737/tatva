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

export const PETAL_STONE_SALON: ProjectDetail = {
  id: "petal-and-stone-salon",
  name: "Petal & Stone Salon",
  category: "Retail & Showrooms",
  location: "Andheri West, Mumbai",
  year: "2024",
  area: "1,200 sq. ft.",
  coverImage: {
    src: "/project-photos/portfolio/saffron-and-slate-cafe/cover.jpg",
    alt: "Salon styling stations with arched mirrors and green pendant lights",
    caption: "SAMPLE PROJECT — Styling stations",
  },
  overview:
    "Petal & Stone Salon is a sample commercial project in Andheri West, designed as a calm, modern salon. The brief asked for a space that feels soft and welcoming for clients while staying practical for stylists during busy hours. The design combines textured walls, arched mirrors and one bold floral feature wall to give the salon a clear identity.",
  clientRequirements: [
    "Four styling stations and two wash stations",
    "A calm, welcoming atmosphere that feels different from a typical salon",
    "Even, flattering lighting at every mirror",
    "Durable, easy-to-clean surfaces suited to daily commercial use",
    "One memorable feature that customers remember and share",
    "Completion within a fixed budget and opening date",
  ],
  designConcept:
    "The concept pairs soft, earthy surfaces with one strong accent. Sand-toned textured walls and rounded arches keep the space quiet and gentle, while an orange floral wall behind the wash area adds colour and personality. Backlit arched mirrors and green pendant lights give the stations warm, even light and tie the design together.",
  spacePlanning:
    "The layout is divided into three zones: a reception and waiting area, the styling stations along the walls, and a separate wash area at the back. Each station sits within its own arched alcove, which gives clients privacy without closing off the room. Clear walkways between the stations and the wash area keep movement easy for staff and clients.",
  materials: [
    { element: "Walls", material: "Sand-toned textured plaster finish" },
    { element: "Feature wall", material: "Orange floral panel installation behind the wash area" },
    { element: "Mirrors", material: "Arched mirrors with concealed warm LED backlighting" },
    { element: "Lighting", material: "Green metal pendant lights over each station" },
    { element: "Seating", material: "Classic styling chairs with wipe-clean upholstery" },
    { element: "Flooring", material: "Light, slip-resistant tile that is easy to clean" },
  ],
  gallery: [
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-1.jpg",
      alt: "Orange floral feature wall beside the wash basin",
      caption: "FEATURE WALL — Floral panels at the wash area",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-2.jpg",
      alt: "Arched backlit mirror with a styling chair",
      caption: "STYLING STATION — Arched mirror with soft backlight",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-3.jpg",
      alt: "Client at the wash basin with greenery in the foreground",
      caption: "WASH AREA — A quiet, private corner",
    },
    {
      src: "/project-photos/portfolio/saffron-and-slate-cafe/gallery-4.jpg",
      alt: "Passage with a green chair and open doorway",
      caption: "PASSAGE — Light and greenery between zones",
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
      description: "Quality checks, snagging and handover of the completed salon.",
    },
  ],
  ctaLabel: "Discuss Your Project",
};