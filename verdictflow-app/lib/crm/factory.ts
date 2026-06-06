import { prisma } from "../prisma";
import { ClioAgent } from "./clio";
import { MyCaseAgent } from "./mycase";
import { ICRMAgent } from "./types";

export async function getCRMAgent(tenantId: string): Promise<ICRMAgent | null> {
  const config = await prisma.cRMConfig.findUnique({
    where: { tenantId }
  });

  if (!config || config.provider === "NONE") {
    return null;
  }

  switch (config.provider) {
    case "CLIO":
      return new ClioAgent(config.apiKey || "");
    case "MYCASE":
      return new MyCaseAgent(config.apiKey || "");
    default:
      return null;
  }
}
