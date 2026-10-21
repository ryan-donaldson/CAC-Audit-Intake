export const sectionOrder = [
  "Business Basics",
  "Business Context",
  "Lead Capture & Intake",
  "Customer Communication & Nurture",
  "Scheduling & Fulfillment",
  "Internal Ops & Team Communication",
  "Content & Marketing",
  "Data & Reporting",
  "Closing",
] as const;

export type SectionName = typeof sectionOrder[number];

