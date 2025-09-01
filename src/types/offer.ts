import { Product } from "./product";
import { Vendor } from "./vendor";

// types/offer.ts
export interface CreateOfferPayload {
  name: string;
  product: string;
  image: string;
  description: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  shopId: string;
}

export interface Offer {
  _id: string;
  name: string;
  shopId: Vendor;
  product: Product;
  image: string;
  description: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}
