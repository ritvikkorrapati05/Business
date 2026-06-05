import { prisma } from "./prisma";
import { pushToCRM } from "./crm";
import { scheduleFollowUp } from "./queue";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export type ChatState = {
  step: "COLLECTING" | "QUALIFIED" | "BOOKING" | "COMPLETED";
  data: {
    name?: string;
    phone?: string;
    email?: string;
    caseType?: string;
    details?: string;
  };
};

export async function processMessage(
  tenantId: string,
  externalId: string,
  platform: "WEB" | "SMS",
  message: string
) {
  // 1. Get or create conversation
  let conversation = await prisma.conversation.findUnique({
    where: {
      platform_externalId_tenantId: {
        platform,
        externalId,
        tenantId,
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        platform,
        externalId,
        tenantId,
      },
      include: {
        messages: true,
      },
    });
  }

  // 2. Derive current state/data from history
  const history = conversation.messages.map(m => ({
    role: m.role as "assistant" | "user",
    content: m.content
  }));
  
  // Add the new message to history for analysis
  history.push({ role: "user", content: message });

  // 3. Use LLM to extract data and decide next response
  const { response, extractedData, isQualified } = await callLLM(history);

  // 4. Save messages
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: message,
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: response,
    },
  });

  // 5. Update Lead if data was extracted
  if (extractedData && Object.keys(extractedData).length > 0) {
    if (conversation.leadId) {
      const currentLead = await prisma.lead.findUnique({ where: { id: conversation.leadId } });
      const updatedLead = await prisma.lead.update({
        where: { id: conversation.leadId },
        data: {
          ...extractedData,
          status: isQualified ? "QUALIFIED" : (currentLead?.status || "NEW"),
        },
      });

      if (isQualified && currentLead?.status !== "QUALIFIED") {
        await triggerQualificationActions(tenantId, updatedLead);
      }
    } else {
      const lead = await prisma.lead.create({
        data: {
          ...extractedData,
          status: isQualified ? "QUALIFIED" : "NEW",
          tenantId,
        },
      });
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { leadId: lead.id },
      });

      if (isQualified) {
        await triggerQualificationActions(tenantId, lead);
      }
    }
  }

  return response;
}

async function triggerQualificationActions(tenantId: string, lead: any) {
  // Push to CRM upon qualification
  await pushToCRM(tenantId, {
    name: lead.name || "Anonymous",
    phone: lead.phone || "",
    email: lead.email || "",
    caseType: lead.caseType || "",
    details: lead.details || "",
  });

  // Schedule follow-up
  await scheduleFollowUp(lead.id, 5, `Hi ${lead.name}, this is VerdictFlow AI. We noticed you're qualified for a consultation. When are you free?`);
}

async function callLLM(history: { role: "assistant" | "user", content: string }[]) {
  // If we had a real API key, we would do this:
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
    ],
    response_format: { type: "json_object" }
  });
  */

  // Since we are mocking, let's simulate the extraction logic
  const lastMessage = history[history.length - 1].content.toLowerCase();
  const userMessages = history.filter(h => h.role === "user");
  
  let response = "";
  let extractedData: any = {};
  let isQualified = false;

  // Simple heuristic-based "LLM" for MVP
  if (userMessages.length === 1) {
    extractedData.name = userMessages[0].content;
    response = `Nice to meet you, ${extractedData.name}. What's the best phone number to reach you at?`;
  } else if (userMessages.length === 2) {
    extractedData.phone = userMessages[1].content;
    response = `Got it. What kind of case is this regarding? (e.g., Car Accident, Slip and Fall)`;
  } else if (userMessages.length === 3) {
    extractedData.caseType = userMessages[2].content;
    response = `I see. Can you tell me a little more about what happened and if anyone was injured?`;
  } else if (userMessages.length >= 4) {
    extractedData.details = userMessages[3]?.content || "";
    isQualified = true;
    response = `Thank you for sharing. Based on what you've told me, you may have a strong case. Would you like to schedule a free consultation? You can book here: https://calendly.com/verdictflow-demo`;
  } else {
    response = "Hello! How can I help you with your legal inquiry today?";
  }

  return { response, extractedData, isQualified };
}

const SYSTEM_PROMPT = `
You are an intake assistant for a personal injury law firm called VerdictFlow.
Your goal is to politely collect the following information from the lead:
1. Name
2. Phone number
3. Case type (Car accident, Slip and fall, etc.)
4. Brief details of the incident and injuries.

Once you have enough information to determine if it's a personal injury case, mark it as qualified and provide a booking link.
Always respond in JSON format with the following fields:
{
  "response": "Your message to the user",
  "extractedData": { "name": "...", "phone": "...", "caseType": "...", "details": "..." },
  "isQualified": true/false
}
`;
