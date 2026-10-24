import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reportPollAttempts = 18;
const reportPollIntervalMs = 1_000;

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getReportId(value: unknown): string | undefined {
  if (!isJsonObject(value)) {
    return undefined;
  }

  return (
    getString(value.report_id) ??
    getString(value.job_id) ??
    getString(value.id)
  );
}

function safeFilename(value: string): string {
  const name = value
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${name || "business"}-audit-report.pdf`;
}

async function getGeneratedPdf(
  baseUrl: URL,
  reportId: string,
  headers: HeadersInit,
): Promise<Buffer | null> {
  const reportUrl = new URL(`/reports/${encodeURIComponent(reportId)}`, baseUrl);

  for (let attempt = 0; attempt < reportPollAttempts; attempt += 1) {
    const response = await fetch(reportUrl, { headers });

    if (response.status === 404) {
      if (attempt < reportPollAttempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, reportPollIntervalMs),
        );
        continue;
      }
      return null;
    }

    if (!response.ok) {
      console.error("Railway report retrieval failed with status", response.status);
      throw new Error("Unable to retrieve the generated audit report.");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("application/pdf")) {
      console.error("Railway report response was not a PDF:", contentType);
      throw new Error("The report service returned an invalid PDF.");
    }

    const pdf = Buffer.from(await response.arrayBuffer());
    if (pdf.length < 5 || pdf.subarray(0, 5).toString("ascii") !== "%PDF-") {
      console.error("Railway report response did not contain valid PDF data.");
      throw new Error("The report service returned an invalid PDF.");
    }

    return pdf;
  }

  return null;
}

export async function POST(req: Request) {
  const railwayUrl = process.env.RAILWAY_URL;
  const webhookSecret = process.env.RAILWAY_WEBHOOK_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (!railwayUrl || !webhookSecret || !resendApiKey || !resendFromEmail) {
    console.error(
      "RAILWAY_URL, RAILWAY_WEBHOOK_SECRET, RESEND_API_KEY, and RESEND_FROM_EMAIL must be configured.",
    );
    return NextResponse.json(
      { error: "The audit report service is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "The request body must contain valid JSON." },
      { status: 400 },
    );
  }

  if (!isJsonObject(body)) {
    return NextResponse.json(
      { error: "The request body must be an audit response." },
      { status: 400 },
    );
  }

  const recipient = getString(body["Email address"]);
  if (!recipient || !emailPattern.test(recipient)) {
    return NextResponse.json(
      { error: "A valid recipient email address is required." },
      { status: 400 },
    );
  }

  const businessBasics = body["Business Basics"];
  const businessContext = body["Business Context"];
  const businessName =
    isJsonObject(businessBasics) &&
    getString(businessBasics["What is your business name?"]);
  const industry =
    isJsonObject(businessContext) &&
    getString(businessContext["What does your business do?"]);

  if (!businessName) {
    return NextResponse.json(
      { error: "A business name is required to generate the audit report." },
      { status: 400 },
    );
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(railwayUrl);
    if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
      throw new Error("RAILWAY_URL must use HTTP or HTTPS.");
    }
  } catch (error) {
    console.error("RAILWAY_URL is invalid:", error);
    return NextResponse.json(
      { error: "The audit report service is not configured correctly." },
      { status: 500 },
    );
  }

  const railwayHeaders = {
    "Content-Type": "application/json",
    "x-webhook-secret": webhookSecret,
  };

  try {
    const generateResponse = await fetch(new URL("/generate-report", baseUrl), {
      method: "POST",
      headers: railwayHeaders,
      body: JSON.stringify({
        client: {
          business_name: businessName,
          ...(industry ? { industry } : {}),
        },
        intake: body,
      }),
    });

    if (!generateResponse.ok) {
      console.error(
        "Railway report generation failed with status",
        generateResponse.status,
      );
      return NextResponse.json(
        { error: "Unable to generate the audit report." },
        { status: 502 },
      );
    }

    let generationResult: unknown;
    try {
      generationResult = await generateResponse.json();
    } catch {
      console.error("Railway report generation returned invalid JSON.");
      return NextResponse.json(
        { error: "The report service returned an invalid response." },
        { status: 502 },
      );
    }

    const reportId = getReportId(generationResult);
    if (!reportId) {
      console.error("Railway report generation response did not include a report ID.");
      return NextResponse.json(
        { error: "The report service returned an invalid response." },
        { status: 502 },
      );
    }

    const pdf = await getGeneratedPdf(
      baseUrl,
      reportId,
      railwayHeaders,
    );
    if (!pdf) {
      return NextResponse.json(
        { error: "The audit report is still being generated. Please try again shortly." },
        { status: 504 },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [recipient],
        subject: "Your business automation audit report",
        text: "Thank you for completing your business automation audit. Your PDF report is attached.",
        attachments: [
          {
            filename: safeFilename(businessName),
            content: pdf.toString("base64"),
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      console.error("Resend email request failed with status", emailResponse.status);
      return NextResponse.json(
        { error: "Unable to email the audit report." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Audit report delivery failed:", error);
    return NextResponse.json(
      { error: "Unable to generate or email the audit report." },
      { status: 502 },
    );
  }
}
