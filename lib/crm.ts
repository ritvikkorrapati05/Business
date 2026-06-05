export interface CRMLead {
  name: string;
  phone: string;
  email: string;
  caseType: string;
  details: string;
}

export async function pushToCRM(tenantId: string, lead: CRMLead) {
  console.log(`[CRM] Pushing lead for tenant ${tenantId} to Clio...`);
  console.log(`[CRM] Lead data:`, lead);
  
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, crmId: `clio_${Math.random().toString(36).substring(7)}` });
    }, 500);
  });
}
