import { useState, useEffect } from "react";
import { Question } from "../../utils/questions";

type Props = {
  question: Question;
  onNext: (answer: string) => void;
  onPrevious: () => void;
};

export default function SelectQuestion({ question, onNext, onPrevious }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [question.id]);

  return (
    <div>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Select an option</option>
        {question.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "1rem" }}>
        <button className="button secondary" onClick={onPrevious}>
          Previous
        </button>

        <button
          className="button"
          style={{ marginLeft: "1rem" }}
          onClick={() => value && onNext(value)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
