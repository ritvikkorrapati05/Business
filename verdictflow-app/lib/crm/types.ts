export interface CRMLead {
  name: string;
  phone: string;
  email: string;
  caseType: string;
  details: string;
}

export interface CRMResponse {
  success: boolean;
  crmId?: string;
  error?: string;
}

export interface ICRMAgent {
  pushLead(lead: CRMLead): Promise<CRMResponse>;
}
