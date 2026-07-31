"use client";

import { useEffect, useState } from "react";
import { Question } from "../../utils/questions";
import { useIntakeStore } from "../../stores/intakeStore";

export default function FinalQuestion({ question }: { question: Question }) {
  const answers = useIntakeStore((s) => s.answers);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 180,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        confetti.default({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 },
        });
      }, 400);
    });
  }, []);

  async function sendAudit() {
    const payload = {
      answers,
      timestamp: new Date().toISOString(),
    };

    console.log("Sending audit payload:", payload);

    // Example: send to your future API route
    await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🎉 Thank you!</h2>
      <p style={{ marginTop: "1rem" }}>
        Your responses have been recorded. Click the button below to receive
        your audit.
      </p>

      <button
        className="button"
        style={{ marginTop: "2rem" }}
        onClick={() => {
          sendAudit();
          setSent(true);
        }}
      >
        {sent ? "Audit sent!" : "Send Audit"}
      </button>
    </div>
  );
}
