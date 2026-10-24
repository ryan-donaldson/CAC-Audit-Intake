"use client";

import { useEffect, useState } from "react";
import { Question } from "../../utils/questions";
import { useIntakeStore } from "../../stores/intakeStore";
import {
  buildAuditPayload,
  formatAuditMessage,
} from "../../utils/buildAuditPayload";

export default function FinalQuestion({ question }: { question: Question }) {
  const answers = useIntakeStore((s) => s.answers);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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
    setSending(true);
    setError("");

    try {
      const answersPayload = buildAuditPayload(answers);
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answersPayload,
          userMessage: formatAuditMessage(answersPayload),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setSent(true);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to send your audit. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🎉 Thank you!</h2>
      <p style={{ marginTop: "1rem" }}>
        Click below to generate your PDF audit report and have it emailed to you.
      </p>
      {error && (
        <p role="alert" style={{ marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <button
        className="button"
        style={{ marginTop: "2rem" }}
        disabled={sending || sent}
        onClick={sendAudit}
      >
        {sending
          ? "Sending..."
          : sent
            ? "Email sent!"
            : "Send Audit"}
      </button>
    </div>
  );
}
