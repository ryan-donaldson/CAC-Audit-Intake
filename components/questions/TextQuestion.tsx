import { useState, useEffect } from "react";
import { Question } from "../../utils/questions";

type Props = {
  question: Question;
  onNext: (answer: string) => void;
  onPrevious: () => void;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function TextQuestion({ question, onNext, onPrevious }: Props) {
  const [value, setValue] = useState("");

  // Clear input when question changes
  useEffect(() => {
    setValue("");
  }, [question.id]);

  const isEmailQuestion = question.id === "qC_3"; // or whatever your email question ID is

  function handleContinue() {
    if (isEmailQuestion && !isValidEmail(value)) {
      alert("Please enter a valid email address.");
      return;
    }

    onNext(value);
  }

  return (
    <div>
      <input
        type={isEmailQuestion ? "email" : "text"}
        value={value}
        placeholder={isEmailQuestion ? "you@example.com" : "Type your answer..."}
        onChange={(e) => setValue(e.target.value)}
      />

       <div style={{ marginTop: "1rem" }}>
        <button className="button secondary" onClick={onPrevious}>
          Previous
        </button>

        <button
          className="button"
          style={{ marginLeft: "1rem" }}
          onClick={() => onNext(value)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
