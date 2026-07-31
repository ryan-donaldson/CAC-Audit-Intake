// stores/intakeStore.ts
import { create } from "zustand";

export type AnswerMap = Record<string, string>;

export type IntakeState = {
  answers: AnswerMap;
  history: string[];
  current: string;
  progress: number;

  setCurrent: (id: string) => void;
  addAnswer: (id: string, value: string) => void;
  setProgress: (percent: number) => void;

  addToHistory: (id: string) => void;
  goBack: () => void;
};

export const useIntakeStore = create<IntakeState>((set, get) => ({
  answers: {},
  history: ["q0_1"],
  current: "q0_1",
  progress: 0,

  addToHistory: (id) =>
    set((state) => ({
      history: [...state.history, id],
    })),

  goBack: () => {
    const history = [...get().history];
    if (history.length <= 1) return; // cannot go back from first question

    history.pop(); // remove current
    const previous = history[history.length - 1];

    set({
      current: previous,
      history,
    });
  },

  setCurrent: (id) => set({ current: id }),

  addAnswer: (id, value) =>
    set((state) => ({
      answers: { ...state.answers, [id]: value },
    })),

  setProgress: (percent) => set({ progress: percent }),
  
}));

export function shouldSkipSection(section: string, answers: AnswerMap) {
  if (section === "Scheduling & Fulfillment") {
    return answers["q3_1"] === "no";
  }
  return false;
}
