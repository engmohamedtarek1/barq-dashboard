// types/agent.ts
export interface CreateAgentPayload {
  name: string;
  mobile: string;
  role: "delivery-agent";
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  commissionRate?: number;
}

export interface Agent {
  _id: string;
  name: string;
  mobile: string;
  role: "delivery-agent";
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  commissionRate: number;
}
