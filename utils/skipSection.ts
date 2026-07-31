import { AnswerMap } from "../stores/intakeStore"

export function shouldSkipSection(section: string, answers: AnswerMap) {
  if (section === "Scheduling & Fulfillment") {
    return answers["q3_1"] === "no";
  }
  return false;
}
