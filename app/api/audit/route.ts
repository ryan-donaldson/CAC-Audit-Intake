import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("Received audit:", body);

  // TODO: send to AI model, email service, database, etc.

  return NextResponse.json({ ok: true });
}
