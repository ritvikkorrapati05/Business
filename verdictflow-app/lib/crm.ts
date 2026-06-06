import { getCRMAgent } from "./crm/factory";
import { CRMLead } from "./crm/types";

export async function pushToCRM(tenantId: string, lead: CRMLead) {
  console.log(`[CRM] Attempting to push lead for tenant ${tenantId}...`);
  
  const agent = await getCRMAgent(tenantId);
  
  if (!agent) {
    console.log(`[CRM] No CRM integration configured for tenant ${tenantId}.`);
    return { success: false, error: "No CRM configured" };
  }

  return agent.pushLead(lead);
}
