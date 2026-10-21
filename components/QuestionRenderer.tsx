"use client";

import { Question, questions } from "../utils/questions";
import { useIntakeStore } from "../stores/intakeStore";
import { sectionOrder } from "../utils/sectionOrder";
import FinalQuestion from "./questions/FinalQuestion";

const conditionalQuestions: Record<string, string[]> = {
  q0_5: ["q0_6"],
  q1_2: ["q1_2a"],
  q2_2: ["q2_2a"],
  q3_1: ["q3_2", "q3_3", "q3_4"],
  q5_1: ["q5_1a"],
};

function isQuestionVisible(
  question: Question,
  answers: Record<string, string>,
) {
  switch (question.id) {
    case "q0_6":
      return (
        answers.q0_5 === "Other businesses" || answers.q0_5 === "A mix of both"
      );
    case "q1_2a":
      return answers.q1_2?.trim().toLowerCase() === "crm tool";
    case "q2_2a":
      return answers.q2_2 === "yes";
    case "q3_2":
    case "q3_3":
    case "q3_4":
      return answers.q3_1 === "yes";
    case "q5_1a":
      return answers.q5_1 === "yes";
    default:
      return true;
  }
}

function isQuestionComplete(question: Question, answer: string | undefined) {
  if (question.required === false) return true;
  if (!answer?.trim()) return false;
  if (question.type === "number") {
    return Number.isFinite(Number(answer)) && Number(answer) >= 0;
  }
  if (question.id === "qC_3") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer);
  }
  return true;
}

export default function QuestionRenderer() {
  const {
    answers,
    sectionIndex,
    setSectionIndex,
    addAnswer,
    removeAnswer,
    setProgress,
  } = useIntakeStore();

  if (sectionIndex >= sectionOrder.length) {
    return <FinalQuestion question={questions.qC_4} />;
  }

  const section = sectionOrder[sectionIndex];
  const visibleQuestions = Object.values(questions).filter(
    (question) =>
      question.section === section &&
      question.type !== "final" &&
      isQuestionVisible(question, answers),
  );
  const canContinue = visibleQuestions.every((question) =>
    isQuestionComplete(question, answers[question.id]),
  );

  function handleAnswer(question: Question, value: string) {
    if (answers[question.id] !== value) {
      conditionalQuestions[question.id]?.forEach(removeAnswer);
    }
    addAnswer(question.id, value);
  }

  function goToSection(index: number) {
    setSectionIndex(index);
    setProgress(Math.round((index / sectionOrder.length) * 100));
  }

  return (
    <section className="section-form">
      <header className="section-header">
        <p className="section-count">
          Section {sectionIndex + 1} of {sectionOrder.length}
        </p>
        <h2>{section}</h2>
      </header>

      <div className="section-questions">
        {visibleQuestions.map((question) => (
          <div className="form-question" key={question.id}>
            <label className="question-title" htmlFor={question.id}>
              {question.text}
            </label>
            {question.description && (
              <p className="question-description">{question.description}</p>
            )}

            {question.type === "text" && (
              <input
                id={question.id}
                type={question.id === "qC_3" ? "email" : "text"}
                value={answers[question.id] ?? ""}
                onChange={(event) => handleAnswer(question, event.target.value)}
                placeholder={
                  question.id === "qC_3"
                    ? "email@example.com"
                    : "Type your answer..."
                }
                required={question.required !== false}
              />
            )}

            {question.type === "number" && (
              <input
                id={question.id}
                type="number"
                min="0"
                step="any"
                value={answers[question.id] ?? ""}
                onChange={(event) => handleAnswer(question, event.target.value)}
                placeholder="Enter a number..."
                required={question.required !== false}
              />
            )}

            {question.type === "select" && (
              <select
                id={question.id}
                value={answers[question.id] ?? ""}
                onChange={(event) => handleAnswer(question, event.target.value)}
              >
                <option value="">Select an option</option>
                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {question.type === "yesno" && (
              <div className="answer-options">
                {["yes", "no"].map((value) => (
                  <button
                    aria-pressed={answers[question.id] === value}
                    className={
                      answers[question.id] === value
                        ? "button"
                        : "button secondary"
                    }
                    key={value}
                    onClick={() => handleAnswer(question, value)}
                    type="button"
                  >
                    {value === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <nav className="section-navigation" aria-label="Section navigation">
        <button
          className="button secondary"
          disabled={sectionIndex === 0}
          onClick={() => goToSection(sectionIndex - 1)}
          type="button"
        >
          Previous section
        </button>
        <button
          className="button"
          disabled={!canContinue}
          onClick={() => goToSection(sectionIndex + 1)}
          type="button"
        >
          {sectionIndex === sectionOrder.length - 1
            ? "Complete audit"
            : "Next section"}
        </button>
      </nav>
    </section>
  );
}
