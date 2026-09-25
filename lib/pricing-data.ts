export interface PackageImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface PricingPackage {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  indicator: string;
  idealFor: string;
  whoIsItFor: string;
  summary: string;
  images: PackageImage[];
  includes: string[];
  timeline: string;
  pricing: {
    main: string;
    supporting: string;
    note?: string;
  };
}

export interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

export interface ComparisonRow {
  feature: string;
  designOnly: string;
  designExecution: string;
  turnkey: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const PRICING_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    number: "01",
    title: "Understand the Project",
    description: "Area, location, project type and architectural requirements."
  },
  {
    number: "02",
    title: "Define the Scope",
    description: "Design-Only, Design + Execution or Turnkey involvement."
  },
  {
    number: "03",
    title: "Select Materials & Specifications",
    description: "Finishes, furniture, fixtures and bespoke material choices."
  },
  {
    number: "04",
    title: "Receive a Custom Quote",
    description: "Final pricing calculated strictly on the agreed project scope."
  }
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "design-only",
    number: "01",
    name: "Design-Only",
    subtitle: "Design Expertise & Spatial Documentation",
    indicator: "DESIGN FOCUSED",
    idealFor: "Ideal for businesses that already have an execution team.",
    whoIsItFor: "For clients who want professional interior design while managing execution independently.",
    summary: "Suitable for clients seeking a complete design package while managing execution independently.",
    images: [
      {
        src: "/project-photos/design-only/WhatsApp Image 2026-09-24 at 8.25.50 PM.jpeg",
        alt: "TATTVA Spatial Concept & Design Drafting Project Photo 1",
        caption: "COMMERCIAL INTERIORS — Spatial concept & layout study"
      },
      {
        src: "/project-photos/design-only/WhatsApp Image 2026-09-24 at 8.26.13 PM.jpeg",
        alt: "TATTVA 2D/3D Architectural Layout Project Photo 2",
        caption: "ARCHITECTURAL DRAFTING — 2D & 3D space planning"
      },
      {
        src: "/project-photos/design-only/WhatsApp Image 2026-09-24 at 8.26.31 PM.jpeg",
        alt: "TATTVA Material & Finish Selection Project Photo 3",
        caption: "MATERIAL PALETTE — Finish & material selection"
      },
      {
        src: "/project-photos/design-only/WhatsApp Image 2026-09-24 at 8.27.05 PM.jpeg",
        alt: "TATTVA Interior Lighting & Furniture Concept Photo 4",
        caption: "LIGHTING & FURNITURE — Fixture & furniture study"
      },
      {
        src: "/project-photos/design-only/WhatsApp Image 2026-09-24 at 8.27.19 PM.jpeg",
        alt: "TATTVA Design Documentation Project Photo 5",
        caption: "DESIGN DOCUMENTATION — Technical execution drawings"
      }
    ],
    includes: [
      "Initial consultation",
      "Space planning",
      "Concept development",
      "2D layouts",
      "3D visualizations",
      "Material and finish recommendations",
      "Lighting and furniture suggestions",
      "Design documentation"
    ],
    timeline: "2–4 weeks",
    pricing: {
      main: "₹2.5L – ₹5L",
      supporting: "INDICATIVE DESIGN ENGAGEMENT",
      note: "Final pricing depends on project size, scope, complexity, revisions and project requirements."
    }
  },
  {
    id: "design-execution",
    number: "02",
    name: "Design + Execution",
    subtitle: "Design & Coordinated Site Supervision",
    indicator: "DESIGN + MANAGEMENT",
    idealFor: "Ideal for clients who want design with professional execution coordination.",
    whoIsItFor: "For clients who need professional design along with execution coordination and supervision.",
    summary: "Design development with execution coordination and site supervision based on the agreed scope.",
    images: [
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.08 PM.jpeg",
        alt: "TATTVA Coordinated Commercial Interior Execution Project Photo 1",
        caption: "COMMERCIAL INTERIORS — Coordinated site execution"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.39 PM.jpeg",
        alt: "TATTVA On-Site Contractor Coordination Project Photo 2",
        caption: "SITE SUPERVISION — On-site contractor coordination"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.44 PM.jpeg",
        alt: "TATTVA Vendor & Procurement Supervision Project Photo 3",
        caption: "PROCUREMENT SUPPORT — Material & vendor oversight"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.45 PM.jpeg",
        alt: "TATTVA Quality Check & Site Execution Project Photo 4",
        caption: "PROJECT EXECUTION — Structural & finishing quality check"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.50 PM.jpeg",
        alt: "TATTVA Artisan Joinery Execution Project Photo 5",
        caption: "JOINERY DETAILS — Custom architectural woodwork"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.51 PM.jpeg",
        alt: "TATTVA Spatial Finishing & Supervision Project Photo 6",
        caption: "FINISHING WORK — Spatial execution & site delivery"
      },
      {
        src: "/project-photos/design-execution/WhatsApp Image 2026-09-24 at 8.26.58 PM.jpeg",
        alt: "TATTVA Progress Update & Site Delivery Project Photo 7",
        caption: "SITE PROGRESS — Managed execution & installation"
      }
    ],
    includes: [
      "Everything in Design-Only",
      "Contractor coordination",
      "Vendor coordination",
      "Execution supervision",
      "Material procurement support",
      "Quality checks",
      "Progress updates",
      "Basic project coordination"
    ],
    timeline: "6–10 weeks",
    pricing: {
      main: "FROM ₹8L + EXECUTION COST",
      supporting: "DESIGN + EXECUTION MANAGEMENT",
      note: "Final pricing depends on the execution scope, materials, site conditions, vendors and project requirements."
    }
  },
  {
    id: "turnkey",
    number: "03",
    name: "Turnkey",
    subtitle: "End-to-End Handover & Design-Build Delivery",
    indicator: "COMPLETE DELIVERY",
    idealFor: "Ideal for clients looking for complete design-to-handover support.",
    whoIsItFor: "For clients who want TATTVA to manage the project from initial design through final handover.",
    summary: "End-to-end design, coordination, procurement and project delivery based on the agreed scope.",
    images: [
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.26.16 PM.jpeg",
        alt: "TATTVA Completed Turnkey Commercial Interior Project Photo 1",
        caption: "TURNKEY PROJECT — Completed commercial space handover"
      },
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.26.49 PM.jpeg",
        alt: "TATTVA Turnkey Finished Space Handover Project Photo 2",
        caption: "EXECUTIVE INTERIORS — Turnkey design & build delivery"
      },
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.26.59 PM.jpeg",
        alt: "TATTVA Turnkey Commercial Architecture Project Photo 3",
        caption: "COMMERCIAL ARCHITECTURE — End-to-end space transformation"
      },
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.27.02 PM.jpeg",
        alt: "TATTVA Material & MEP Coordination Project Photo 4",
        caption: "MEP & FINISHES — Integrated civil & services execution"
      },
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.27.48 PM.jpeg",
        alt: "TATTVA Completed Executive Interior Handover Project Photo 5",
        caption: "COMPLETED HANDOVER — Bespoke corporate interior"
      },
      {
        src: "/project-photos/turnkey/WhatsApp Image 2026-09-24 at 8.27.51 PM.jpeg",
        alt: "TATTVA Finished Commercial Project Delivery Photo 6",
        caption: "FINISHED SPACE — Ready-to-occupy turnkey delivery"
      }
    ],
    includes: [
      "Consultation and site assessment",
      "Complete design",
      "2D layouts",
      "3D visualizations",
      "Material and finish selection",
      "Vendor and contractor management",
      "Procurement coordination",
      "Civil/electrical/furnishing coordination",
      "Quality control",
      "Timeline management",
      "Final handover"
    ],
    timeline: "8–16 weeks",
    pricing: {
      main: "PROJECTS FROM ₹25L",
      supporting: "COMPLETE DESIGN-TO-HANDOVER",
      note: "Final project pricing is prepared after understanding the site, scope, materials, specifications and execution requirements."
    }
  }
];

export const PRICING_DISCLAIMER =
  "Pricing shown is indicative and intended for initial planning purposes only. Final pricing varies based on project size, scope, complexity, location, materials, specifications, site conditions and client requirements. A detailed quotation will be prepared after understanding the project requirements.";

export const PACKAGE_COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Consultation",
    designOnly: "Included",
    designExecution: "Included",
    turnkey: "Included with site assessment"
  },
  {
    feature: "Space Planning",
    designOnly: "Included",
    designExecution: "Included",
    turnkey: "Included"
  },
  {
    feature: "2D Layouts",
    designOnly: "Included",
    designExecution: "Included",
    turnkey: "Included"
  },
  {
    feature: "3D Visualizations",
    designOnly: "Included",
    designExecution: "Included",
    turnkey: "Included"
  },
  {
    feature: "Material Selection",
    designOnly: "Recommendations",
    designExecution: "Recommendations",
    turnkey: "Selection"
  },
  {
    feature: "Vendor Coordination",
    designOnly: "Not included",
    designExecution: "Included",
    turnkey: "Included/Management"
  },
  {
    feature: "Execution Supervision",
    designOnly: "Not included",
    designExecution: "Included",
    turnkey: "Included"
  },
  {
    feature: "Procurement Coordination",
    designOnly: "Not included",
    designExecution: "Support",
    turnkey: "Coordination"
  },
  {
    feature: "Quality Control",
    designOnly: "Not included",
    designExecution: "Quality checks",
    turnkey: "Included"
  },
  {
    feature: "Project Management",
    designOnly: "Not included",
    designExecution: "Basic coordination",
    turnkey: "Timeline management"
  },
  {
    feature: "Final Handover",
    designOnly: "Not included",
    designExecution: "Not specified",
    turnkey: "Included"
  }
];

export const PRICING_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How is TATTVA's pricing calculated?",
    answer:
      "Commercial interior pricing at TATTVA is project-specific and tier-based. Indicative design-only engagement ranges from ₹2.5L–₹5L. Design + Execution starts from ₹8L alongside execution cost, while Turnkey projects typically start from ₹25L. Detailed final quotations are prepared after analyzing site dimensions, materials, and execution scope."
  },
  {
    id: "faq-2",
    question: "How long does a typical project take?",
    answer:
      "Timelines vary by service level and project scale: Design-Only takes 2–4 weeks; Design + Execution ranges from 6–10 weeks depending on site conditions; Turnkey projects take 8–16 weeks depending on size, complexity, and site approvals."
  },
  {
    id: "faq-3",
    question: "What is included in the Design-Only package?",
    answer:
      "The Design-Only package includes initial consultation, space planning, concept development, 2D layouts, 3D visualizations, material and finish recommendations, lighting and furniture suggestions, and complete design documentation for independent execution."
  },
  {
    id: "faq-4",
    question: "What is the difference between Design + Execution and Turnkey?",
    answer:
      "Design + Execution provides complete design expertise alongside contractor and vendor coordination, execution supervision, progress updates, and quality checks while you manage direct procurement accounts. Turnkey provides single-point delivery covering everything from initial site assessment and full material selection to procurement, civil/MEP management, timeline tracking, and final space handover."
  },
  {
    id: "faq-5",
    question: "How are design revisions handled?",
    answer:
      "Design revision requirements depend on the specific project scope and initial brief agreements. Revisions are incorporated during the concept and layout phase to ensure complete alignment prior to final documentation or execution."
  },
  {
    id: "faq-6",
    question: "Does TATTVA coordinate contractors and vendors?",
    answer:
      "Yes, contractor and vendor coordination is included in both our Design + Execution and Turnkey packages. In Design-Only, execution management remains with the client."
  },
  {
    id: "faq-7",
    question: "Does TATTVA provide site visits or site assessments?",
    answer:
      "Site assessments and consultation are included as an integral part of our Turnkey package, and site coordination/supervision support is provided throughout the Design + Execution workflow."
  },
  {
    id: "faq-8",
    question: "How can I request a custom quotation?",
    answer:
      "You can request a custom quotation by filling out our consultation form below or reaching out directly with your project details, floor plans, approximate area, and location."
  }
];

export const ABOUT_TATTVA_CONTENT = {
  tagline: "Designing Spaces with Purpose.",
  title: "Purposeful Commercial Interior Architecture",
  paragraphs: [
    "TATTVA approaches commercial interior design with a focus on purpose, functionality and thoughtful visual expression.",
    "From corporate workplaces and retail environments to hospitality, healthcare and professional spaces, our approach is centred on creating environments that work for the people and businesses they serve.",
    "We bring together space planning, material selection, visualization and execution-focused thinking to develop interiors that are refined, functional and tailored to each project's requirements."
  ]
};
