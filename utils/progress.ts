import { sectionOrder } from "./sectionOrder";
import { questions } from "./questions";
import { AnswerMap } from "../stores/intakeStore";

export function calculateSectionProgress(answers: AnswerMap) {
  const completedSections = new Set<string>();

  for (const id in answers) {
    const section = questions[id].section;
    completedSections.add(section);
  }

  const percent =
    (completedSections.size / sectionOrder.length) * 100;

  return Math.round(percent);
}
