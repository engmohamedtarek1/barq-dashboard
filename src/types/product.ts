export interface Product {
  _id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  amount: number;
  shopId: {
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
