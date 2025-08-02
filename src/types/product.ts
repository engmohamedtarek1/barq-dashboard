export interface CreateProductPayload {
  nameAr: string;
  nameEn: string;
  price: number;
  amount: number;
  // shopId: string;
  description: string;
  categoryId: string;
  rating: number;
  image: string;
  soldTimes: number;
  reviewCount: number;
}

export interface Product {
  _id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  amount: number;
  shop: {
    _id: string;
    name: string;
    mobile: string;
    rating: number;
    profileImage: string;
  };
  description: string;
  category: {
    _id: string;
    nameAr: string;
    nameEn: string;
  };
  rating: number;
  image: string;
  soldTimes: number;
  reviewCount: number;
}
