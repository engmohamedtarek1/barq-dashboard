import { Category } from "./category";
import { Subcategory } from "./subcategory";

// types/vendor.ts
export interface CreateVendorPayload {
  name: string;
  mobile: string;
  location: string;
  workingHours: [string, string];
  profileImage: string;
  category: string;
  subcategories: string[];
  role: string;
  isActive?: boolean;
}

export interface Vendor {
  _id: string;
  name: string;
  mobile: string;
  profileImage?: string;
  role: string;
  isActive?: boolean;
  location?: string;
  rating?: number;
  workingHours?: [string, string];
  category?: Category;
  subcategories?: Subcategory[];
  reviewCount?: number;
}
