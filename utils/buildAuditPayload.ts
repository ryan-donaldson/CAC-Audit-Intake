import { AnswerMap } from "../stores/intakeStore";
import { questions } from "./questions";

const sections = [
  "Business Basics",
  "Business Context",
  "Lead Capture & Intake",
  "Customer Communication & Nurture",
  "Scheduling & Fulfillment",
  "Internal Ops & Team Communication",
  "Content & Marketing",
  "Data & Reporting",
] as const;

type SectionName = (typeof sections)[number];
type SectionAnswers = Record<string, string>;

export type AuditPayload = Record<SectionName, SectionAnswers> & {
  "Self-identified biggest pain point": string;
  "Budget comfort level": string;
  "Email address": string;
  timestamp: string;
};

export function buildAuditPayload(
  answers: AnswerMap,
  timestamp = new Date().toISOString(),
): AuditPayload {
  const sectionAnswers = Object.fromEntries(
    sections.map((section) => [section, {}]),
  ) as Record<SectionName, SectionAnswers>;

  for (const [id, answer] of Object.entries(answers)) {
    const question = questions[id];
    if (
      question &&
      sections.includes(question.section as SectionName) &&
      answer.trim()
    ) {
      sectionAnswers[question.section as SectionName][question.text] = answer;
    }
  }

  return {
    ...sectionAnswers,
    "Self-identified biggest pain point": answers.qC_1 ?? "",
    "Budget comfort level": answers.qC_2 ?? "",
    "Email address": answers.qC_3 ?? "",
    timestamp,
  };
}

export function formatAuditMessage(payload: AuditPayload): string {
  return [
    `Business basics: ${formatSectionAnswers(payload["Business Basics"])}`,
    `Business context: ${formatSectionAnswers(payload["Business Context"])}`,
    `Lead Capture & Intake: ${formatSectionAnswers(payload["Lead Capture & Intake"])}`,
    `Customer Communication & Nurture: ${formatSectionAnswers(payload["Customer Communication & Nurture"])}`,
    `Scheduling & Fulfillment: ${formatSectionAnswers(payload["Scheduling & Fulfillment"])}`,
    `Internal Ops & Team Communication: ${formatSectionAnswers(payload["Internal Ops & Team Communication"])}`,
    `Content & Marketing: ${formatSectionAnswers(payload["Content & Marketing"])}`,
    `Data & Reporting: ${formatSectionAnswers(payload["Data & Reporting"])}`,
    `Self-identified biggest pain point: ${payload["Self-identified biggest pain point"]}`,
    `Budget comfort level: ${payload["Budget comfort level"]}`,
  ].join("\n");
}

function formatSectionAnswers(answers: SectionAnswers): string {
  return Object.entries(answers)
    .map(([question, answer]) => `${question}: ${answer}`)
    .join("; ");
}
