// types/vendor.ts
export interface CreateVendorPayload {
  name: string;
  mobile: string;
  location: string;
  workingHours: string;
  profileImage: string;
  category: string;
  subcategories: string[];
  role: string;
}

export interface Vendor {
  _id: string;
  name: string;
  mobile: string;
  profileImage: string;
  role: string;
  isActive: boolean;
  location: string;
  rating: number;
  category: {
    nameAr: string;
    nameEn: string;
  };
  subcategories: {
    nameAr: string;
    nameEn: string;
  }[];
}
