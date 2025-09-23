export type Chat = {
  _id: string;
  user?: {
    _id: string;
    mobile?: string;
    expectedTime?: number;
    name: string;
    loyalPoints?: number;
    role?: string;
    subcategories?: [];
    workingHours?: [];
    isActive?: boolean;
    rating?: number;
    reviewCount?: number;
    commissionRate?: number;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type Message = {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  updatedAt: string;
};
