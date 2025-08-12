import { Category } from "./category";

export interface Subcategory {
  _id: string;
  nameAr: string;
  nameEn: string;
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubcategoryPayload {
  nameAr: string;
  nameEn: string;
  image: string;
  category: string;
}
