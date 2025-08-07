export interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  nameAr: string;
  nameEn: string;
  image: string;
}
