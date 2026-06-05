import { Queue, Worker } from "bullmq";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const followUpQueue = new Queue("follow-up", {
  connection: { url: REDIS_URL },
});

// Worker to process follow-ups
if (process.env.NODE_ENV !== "test") {
  const worker = new Worker(
    "follow-up",
    async (job) => {
      console.log(`[Follow-Up] Processing job ${job.id} for lead ${job.data.leadId}`);
      // In a real app, send SMS/Email here
      console.log(`[Follow-Up] Sending message: ${job.data.template}`);
    },
    { connection: { url: REDIS_URL } }
  );

  worker.on("completed", (job) => {
    console.log(`[Follow-Up] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Follow-Up] Job ${job?.id} failed with error:`, err);
  });
}

export async function scheduleFollowUp(leadId: string, delayMinutes: number, template: string) {
  await followUpQueue.add(
    "send-message",
    { leadId, template },
    { delay: delayMinutes * 60 * 1000 }
  );
}
