export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const DESIGN_PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Understanding the client's requirements, objectives, timeline and project scope.",
  },
  {
    number: "02",
    title: "Site Assessment",
    description:
      "Studying the site's dimensions, conditions and constraints to inform the design.",
  },
  {
    number: "03",
    title: "Concept Development",
    description:
      "Developing layouts, material direction and 3D visuals based on the agreed brief.",
  },
  {
    number: "04",
    title: "Design Approval",
    description:
      "Reviewing the concept with the client and refining it until the design is finalized.",
  },
  {
    number: "05",
    title: "Execution",
    description:
      "Coordinating contractors and vendors, supervising the work and sharing progress updates.",
  },
  {
    number: "06",
    title: "Final Handover",
    description:
      "Completing final quality checks and handing over a finished, ready-to-use space.",
  },
];