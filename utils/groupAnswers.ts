import { questions } from "./questions";
import { AnswerMap } from "../stores/intakeStore";
import { QuestionSection } from "./questions";

export function groupAnswersBySection(answers: AnswerMap) {
  const grouped: Record<QuestionSection, AnswerMap> = {
    "Business Basics": {},
    "Business Context": {},
    "Lead Capture & Intake": {},
    "Customer Communication & Nurture": {},
    "Scheduling & Fulfillment": {},
    "Internal Ops & Team Communication": {},
    "Content & Marketing": {},
    "Data & Reporting": {},
    "Closing": {},

  };

  for (const id in answers) {
    const section = questions[id].section as QuestionSection;
    if (!grouped[section]) grouped[section] = {};
    grouped[section][id] = answers[id];
  }

  return grouped;
}
