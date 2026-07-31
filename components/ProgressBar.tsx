"use client"

import { useIntakeStore } from "../stores/intakeStore";

export default function ProgressBar() {
  const progress = useIntakeStore((s) => s.progress);

  return (
    <div className="progress-wrapper">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
