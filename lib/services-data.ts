export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const SERVICES_INTRO =
  "A complete range of commercial interior services, from initial planning to final handover.";

export const SERVICES: Service[] = [
  {
    id: "commercial-interior-design",
    number: "01",
    title: "Commercial Interior Design",
    description:
      "Complete planning and design for business spaces. Each interior is developed around the brand, the users and the intended function of the space.",
  },
  {
    id: "space-planning",
    number: "02",
    title: "Space Planning",
    description:
      "Efficient layouts focused on functionality, movement and productivity. Every area is planned to support how the space will actually be used.",
  },
  {
    id: "3d-visualization",
    number: "03",
    title: "3D Visualization",
    description:
      "3D concepts and visual previews prepared before execution. These help clients review the design and finalize decisions with confidence.",
  },
  {
    id: "material-finish-selection",
    number: "04",
    title: "Material & Finish Selection",
    description:
      "Considered selection of flooring, furniture, lighting, textures and finishes. Choices balance aesthetics, durability and project requirements.",
  },
  {
    id: "project-execution",
    number: "05",
    title: "Project Execution",
    description:
      "Coordination and supervision of implementation activities on site. Includes contractor and vendor coordination, quality checks and progress updates.",
  },
  {
    id: "turnkey-solutions",
    number: "06",
    title: "Turnkey Interior Solutions",
    description:
      "End-to-end project management from design to final handover. A single point of delivery based on the agreed scope.",
  },
];