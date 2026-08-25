export interface ExtensionOption {
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface Extension {
  titleAr: string;
  titleEn: string;
  options: ExtensionOption[];
}

export interface ProductSize {
  _id?: string;          // present on products loaded from the API, absent for new rows
  nameAr: string;
  nameEn: string;
  price: number;         // ABSOLUTE unit price for this size, NOT a surcharge
  isDefault: boolean;
}

export interface CreateProductPayload {
  nameAr: string;
  nameEn: string;
  price: number;
  amount?: number;
  shopId: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  image?: string;
  images?: string[];
  extensions?: Extension[];
  sizes?: ProductSize[];
}

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
  descriptionEn: string;
  descriptionAr: string;
  category: {
    _id: string;
    nameAr: string;
    nameEn: string;
  };
  rating: number;
  image: string;
  images: string[];
  extensions?: Extension[];
  sizes?: ProductSize[];
  soldTimes: number;
  reviewCount: number;
  cartQuantity?: number;
  isInWishlist?: boolean;
  createdAt: string;
  updatedAt: string;
}
