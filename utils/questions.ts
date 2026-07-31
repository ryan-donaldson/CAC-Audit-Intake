// utils/questions.ts

import YesNoQuestion from "../components/questions/YesNoQuestion";
import TextQuestion from "../components/questions/TextQuestion";
import SelectQuestion from "../components/questions/SelectQuestion";
import FinalQuestion from "../components/questions/FinalQuestion";

export type QuestionType = "text" | "yesno" | "select" | "final";

export type QuestionId = string;

export type Question = {
  id: QuestionId;
  section: string;
  text: string;
  type: QuestionType;
  options?: string[];
  description?: string;
  required?: boolean;
  next: QuestionId | ((answer: string) => QuestionId | null) | null;
};

export type QuestionSection =
  | "Business Context"
  | "Lead Capture & Intake"
  | "Customer Communication & Nurture"
  | "Scheduling & Fulfillment"
  | "Internal Ops & Team Communication"
  | "Content & Marketing"
  | "Data & Reporting"
  | "Closing";

export type QuestionMap = Record<QuestionId, Question>;

export const questions: QuestionMap = {
  /* -------------------------------------------
   * SECTION 0 — BUSINESS CONTEXT (always asked)
   * ------------------------------------------- */
  q0_1: {
    id: "q0_1",
    section: "Business Context",
    text: "What does your business do?",
    type: "text",
    required: true,
    next: "q0_2",
  },

  q0_2: {
    id: "q0_2",
    section: "Business Context",
    text: "How many employees do you have, including yourself?",
    type: "text",
    required: true,
    next: "q0_3",
  },

  q0_3: {
    id: "q0_3",
    section: "Business Context",
    text: "What's your biggest day-to-day time drain right now?",
    type: "text",
    required: true,
    next: "q1_1",
  },

  /* -------------------------------------------
   * SECTION 1 — LEAD CAPTURE & INTAKE
   * ------------------------------------------- */
  q1_1: {
    id: "q1_1",
    section: "Lead Capture & Intake",
    text: "How do new leads/customers typically reach you first?",
    type: "select",
    options: [
      "Phone",
      "Website form",
      "Walk-in",
      "Referral",
      "Social media",
      "Other",
    ],
    next: "q1_2",
  },

  q1_2: {
    id: "q1_2",
    section: "Lead Capture & Intake",
    text: "Once someone reaches out, how do you keep track of them?",
    type: "select",
    options: ["Nothing formal", "Spreadsheet", "Notebook/Paper", "CRM Tool"],
    next: (answer) =>
      answer.trim().toLowerCase() === "crm tool" ? "q1_2a" : "q1_3",
  },

  q1_2a: {
    id: "q1_2a",
    section: "Lead Capture & Intake",
    text: "Which CRM tool do you use?",
    type: "text",
    next: "q1_3",
  },

  q1_3: {
    id: "q1_3",
    section: "Lead Capture & Intake",
    text: "How long does it typically take you to respond to a new inquiry?",
    type: "select",
    options: ["Within minutes", "Same day", "1-2 days", "Longer"],
    next: "q2_1",
  },

  /* -------------------------------------------
   * SECTION 2 — CUSTOMER COMMUNICATION & NURTURE
   * ------------------------------------------- */
  q2_1: {
    id: "q2_1",
    section: "Customer Communication & Nurture",
    text: "After first contact, how do you follow up with someone who hasn't bought/booked yet?",
    type: "select",
    options: ["I don't", "Manually", "Automated email/text sequence"],
    next: "q2_2",
  },

  q2_2: {
    id: "q2_2",
    section: "Customer Communication & Nurture",
    text: "Do you currently send any automated emails or texts?",
    type: "yesno",
    next: (answer) => (answer === "yes" ? "q2_2a" : "q2_3"),
  },

  q2_2a: {
    id: "q2_2a",
    section: "Customer Communication & Nurture",
    text: "What tool do you use for automated emails or texts?",
    type: "text",
    next: "q2_3",
  },

  q2_3: {
    id: "q2_3",
    section: "Customer Communication & Nurture",
    text: "How do you currently collect reviews or testimonials?",
    type: "select",
    options: ["I don't ask", "I ask manually", "Automated request system"],
    next: "q3_1",
  },

  /* -------------------------------------------
   * SECTION 3 — SCHEDULING & FULFILLMENT
   * ------------------------------------------- */
  q3_1: {
    id: "q3_1",
    section: "Scheduling & Fulfillment",
    text: "Do customers/clients need to book appointments or services with you?",
    type: "yesno",
    next: (answer) => (answer === "yes" ? "q3_2" : "q4_1"),
  },

  q3_2: {
    id: "q3_2",
    section: "Scheduling & Fulfillment",
    text: "How is booking currently handled?",
    type: "select",
    options: ["Phone/text back and forth", "Online calendar tool", "Other"],
    next: "q3_3",
  },

  q3_3: {
    id: "q3_3",
    section: "Scheduling & Fulfillment",
    text: "Do you send appointment reminders?",
    type: "select",
    options: ["No", "Manually", "Automated"],
    next: "q4_1",
  },

  /* -------------------------------------------
   * SECTION 4 — INTERNAL OPS & TEAM COMMUNICATION
   * ------------------------------------------- */
  q4_1: {
    id: "q4_1",
    section: "Internal Ops & Team Communication",
    text: "If you have employees: how does work get assigned or handed off between team members?",
    type: "select",
    options: [
      "N/A — solo",
      "Verbally/in person",
      "Group chat",
      "Task management tool",
    ],
    next: "q4_2",
  },

  q4_2: {
    id: "q4_2",
    section: "Internal Ops & Team Communication",
    text: "How do you currently track what needs to get done each day/week?",
    type: "text",
    next: "q5_1",
  },

  /* -------------------------------------------
   * SECTION 5 — CONTENT & MARKETING
   * ------------------------------------------- */
  q5_1: {
    id: "q5_1",
    section: "Content & Marketing",
    text: "Do you post on social media for your business?",
    type: "yesno",
    next: (answer) => (answer === "yes" ? "q5_1a" : "q5_2"),
  },

  q5_1a: {
    id: "q5_1a",
    section: "Content & Marketing",
    text: "How often do you post, and who creates the content?",
    type: "text",
    next: "q5_2",
  },

  q5_2: {
    id: "q5_2",
    section: "Content & Marketing",
    text: "How do you currently create marketing content (posts, ads, emails)?",
    type: "select",
    options: [
      "I write it myself",
      "Someone on my team",
      "I don't do this currently",
    ],
    next: "q6_1",
  },

  /* -------------------------------------------
   * SECTION 6 — DATA & REPORTING
   * ------------------------------------------- */
  q6_1: {
    id: "q6_1",
    section: "Data & Reporting",
    text: "Do you have any way to see how your business is performing at a glance?",
    type: "select",
    options: [
      "No visibility",
      "I check manually across a few places",
      "I have a dashboard",
    ],
    next: "qC_1",
  },

  /* -------------------------------------------
   * CLOSING QUESTIONS
   * ------------------------------------------- */
  qC_1: {
    id: "qC_1",
    section: "Closing",
    text: "Of the following areas, which is the one that, if fixed, you feel would make the biggest difference to your business?",
    type: "select",
    options: [
      "Lead Capture & Intake",
      "Customer Communication & Nurture",
      "Scheduling and Fulfillment",
      "Internal Ops & Team Communication",
      "Content & Marketing",
      "Data & Reporting",
    ],
    next: "qC_2",
  },

  qC_2: {
    id: "qC_2",
    section: "Closing",
    text: "What's your rough monthly budget comfort level for tools/automation, if any?",
    type: "select",
    options: ["N/A", "$0-$50", "$50-$150", "$150-$300", "$300+"],
    required: false,
    next: "qC_3",
  },

  qC_3: {
    id: "qC_3",
    section: "Closing",
    text: "Please enter the email address you'd like this audit to be sent to.",
    type: "text",
    required: true,
    next: "qC_4",
  },

  qC_4: {
  id: "qC_4",
  section: "Closing",
  text: "Thank you for completing your business automation audit!",
  description:
    "",
  type: "final",
  next: null,
},
};

export const questionComponents: Record<QuestionType, any> = {
  yesno: YesNoQuestion,
  text: TextQuestion,
  select: SelectQuestion,
  final: FinalQuestion,
};
