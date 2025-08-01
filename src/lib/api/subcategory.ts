// lib/api/subcategory.ts

import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { Subcategory } from "@/types/subcategory";
import { Category } from "@/types/category";

interface SubcategoryResponse {
  data: Subcategory[];
  categories: Category[];
}

export const fetchSubcategories = async (): Promise<SubcategoryResponse> => {
  try {
    const res = await axios.get(`${BASE_URL}/subcategory`);
    const subcategories: Subcategory[] = res.data.data;

    const uniqueCategoriesMap = new Map<string, Category>();
    subcategories.forEach((sc) => {
      uniqueCategoriesMap.set(sc.category._id, sc.category);
    });

    const categories = Array.from(uniqueCategoriesMap.values());

    return {
      data: subcategories,
      categories,
    };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};
