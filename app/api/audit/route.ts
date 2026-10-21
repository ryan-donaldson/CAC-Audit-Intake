import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "The request body must contain valid JSON." },
      { status: 400 },
    );
  }

  // TODO: forward `body` to the Railway endpoint and return the generated PDF.
  void body;

  return NextResponse.json({ ok: true });
}
