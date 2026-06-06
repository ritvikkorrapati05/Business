import { ICRMAgent, CRMLead, CRMResponse } from "./types";

export class MyCaseAgent implements ICRMAgent {
  constructor(private apiKey: string) {}

  async pushLead(lead: CRMLead): Promise<CRMResponse> {
    console.log(`[MyCaseAgent] Pushing lead to MyCase API with key ${this.apiKey.substring(0, 4)}...`);
    
    // MyCase API implementation
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        crmId: `mycase_${Math.random().toString(36).substring(7)}`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
