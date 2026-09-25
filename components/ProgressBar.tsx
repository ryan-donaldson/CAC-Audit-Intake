"use client";

import { useIntakeStore } from "../stores/intakeStore";

export default function ProgressBar() {
  const progress = useIntakeStore((s) => s.progress);

  return (
    <div
      className="progress-wrapper"
      role="progressbar"
      aria-label="Audit progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
