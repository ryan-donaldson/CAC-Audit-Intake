import ProgressBar from "../components/ProgressBar";
import QuestionRenderer from "../components/QuestionRenderer";

export default function Home() {
  return (
    <div className="intake-container">
      <ProgressBar />

      <div className="intake__title--wrapper">
        <h1 className="intake__title">Covenant AI Consulting Audit Form</h1>
      </div>

      <div className="question-card">
        <QuestionRenderer />
      </div>
    </div>
  );
}

