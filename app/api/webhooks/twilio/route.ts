import { NextResponse } from "next/server";
import { processMessage } from "@/lib/ai-agent";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;
    const numMedia = parseInt(formData.get("NumMedia") as string || "0");

    if (!from || (!body && numMedia === 0)) {
      return new Response("Missing From, Body, or Media", { status: 400 });
    }

    // Handle media if present
    let messageToProcess = body || "";
    if (numMedia > 0) {
      const mediaUrls = [];
      for (let i = 0; i < numMedia; i++) {
        mediaUrls.push(formData.get(`MediaUrl${i}`));
      }
      console.log(`[Twilio] Received ${numMedia} media files:`, mediaUrls);
      if (!messageToProcess) {
        messageToProcess = "[Sent images of accident/damage]";
      } else {
        messageToProcess += " [Attached images]";
      }
    }

    // For SMS, externalId is the phone number
    // In a real app, we would look up the tenant by the 'To' number
    const tenantId = "default-tenant"; 

    const response = await processMessage(tenantId, from, "SMS", messageToProcess);

    // Twilio expects TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${response}</Message>
</Response>`;

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
