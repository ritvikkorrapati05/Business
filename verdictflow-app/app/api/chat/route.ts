import { NextResponse } from "next/server";
import { processMessage } from "@/lib/ai-agent";

export async function POST(req: Request) {
  try {
    const { tenantId, externalId, message } = await req.json();

    if (!tenantId || !externalId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await processMessage(tenantId, externalId, "WEB", message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
