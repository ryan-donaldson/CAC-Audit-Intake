// stores/intakeStore.ts
import { create } from "zustand";

export type AnswerMap = Record<string, string>;

export type IntakeState = {
  answers: AnswerMap;
  sectionIndex: number;
  progress: number;

  setSectionIndex: (index: number) => void;
  addAnswer: (id: string, value: string) => void;
  removeAnswer: (id: string) => void;
  setProgress: (percent: number) => void;
};

export const useIntakeStore = create<IntakeState>((set) => ({
  answers: {},
  sectionIndex: 0,
  progress: 0,

  setSectionIndex: (index) => set({ sectionIndex: index }),

  addAnswer: (id, value) =>
    set((state) => ({
      answers: { ...state.answers, [id]: value },
    })),

  removeAnswer: (id) =>
    set((state) => {
      const answers = { ...state.answers };
      delete answers[id];
      return { answers };
    }),

  setProgress: (percent) => set({ progress: percent }),
}));

export function shouldSkipSection(section: string, answers: AnswerMap) {
  if (section === "Scheduling & Fulfillment") {
    return answers["q3_1"] === "no";
  }
  return false;
}
