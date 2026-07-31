import { Question } from "../../utils/questions"

type Props = {
  question: Question;
  onNext: (answer: string) => void;
  onPrevious: () => void;
};

export default function YesNoQuestion({ onNext, onPrevious }: Props) {
  return (
    <div>
      <button className="button" onClick={() => onNext("yes")}>
        Yes
      </button>

      <button
        className="button"
        style={{ marginLeft: "1rem" }}
        onClick={() => onNext("no")}
      >
        No
      </button>

      <div style={{ marginTop: "1rem" }}>
        <button className="button secondary" onClick={onPrevious}>
          Previous
        </button>
      </div>
    </div>
  );
}
