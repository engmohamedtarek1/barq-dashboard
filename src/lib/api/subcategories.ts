// lib/api/subcategory.ts
import axios from "axios";
import { Subcategory, CreateSubcategoryPayload } from "@/types/subcategory";
import { BASE_URL } from "../config";

export async function createSubcategory(payload: CreateSubcategoryPayload) {
  return axios.post(`${BASE_URL}/subcategory`, payload);
}

export async function updateSubcategory(
  category: string,
  data: Partial<CreateSubcategoryPayload>,
) {
  const response = await axios.patch(
    `${BASE_URL}/subcategory/${category}`,
    data,
  );
  return response.data;
}

export async function deleteSubcategory(category: string) {
  return axios.delete(`${BASE_URL}/subcategory/${category}`);
}

export const fetchSubcategories = async (
  page?: number,
  limit?: number,
): Promise<{ data: Subcategory[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/subcategory`, {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pages: response.data.metadata.pages,
  };
};

export const fetchSubcategoriesByCategory = async (
  category: string,
): Promise<{ data: Subcategory[] }> => {
  const response = await axios.get(`${BASE_URL}/subcategory`, {
    params: { category: category },
  });

  return {
    data: response.data.data,
  };
};

export const fetchSubcategoriesByKeyword = async (
  keyword: string,
  page: number,
  limit: number,
): Promise<{ data: Subcategory[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/subcategory`, {
    params: { keyword, page, limit },
  });
  return {
    data: response.data.data ?? [],
    pages: response.data?.metadata?.pages ?? 1,
  };
};
