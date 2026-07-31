"use client";

import { questions } from "../utils/questions";
import { useIntakeStore } from "../stores/intakeStore";
import { calculateSectionProgress } from "../utils/progress";
import YesNoQuestion from "./questions/YesNoQuestion";
import SelectQuestion from "./questions/SelectQuestion";
import TextQuestion from "./questions/TextQuestion";
import { QuestionType, Question } from "../utils/questions";
import { FC } from "react";
import FinalQuestion from "./questions/FinalQuestion";

export const questionComponents: Record<
  QuestionType,
  FC<{
    question: Question;
    onNext: (answer: string) => void;
    onPrevious: () => void;
  }>
> = {
  yesno: YesNoQuestion,
  text: TextQuestion,
  select: SelectQuestion,
  final: FinalQuestion,
};

export default function QuestionRenderer() {
  const { current, setCurrent, addAnswer, setProgress, addToHistory, goBack } =
    useIntakeStore();

  const question = questions[current];

  if (!question) {
    return <div>Loading question…</div>;
  }

  const Component = questionComponents[question.type];

  function handleNext(answer: string) {
    addAnswer(question.id, answer);

    const next =
      typeof question.next === "function"
        ? question.next(answer)
        : question.next;

    setProgress(calculateSectionProgress(useIntakeStore.getState().answers));

    if (next) {
      addToHistory(current);
      setCurrent(next);
    }
  }

  return (
    <div>
      <h2 className="question-title">{question.text}</h2>

      {question.description && (
        <p className="question-description">{question.description}</p>
      )}

      <Component
        question={question}
        onNext={question.type !== "final" ? handleNext : () => {}}
        onPrevious={question.type !== "final" ? goBack : () => {}}
      />
    </div>
  );
}
