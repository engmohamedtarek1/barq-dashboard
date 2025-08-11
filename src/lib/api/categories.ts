// lib/api/categorys.ts
import axios from "axios";
import { Category, CreateCategoryPayload } from "@/types/category";
import { BASE_URL } from "../config";

export async function createCategory(payload: CreateCategoryPayload) {
  return axios.post(`${BASE_URL}/category`, payload);
}

export async function updateCategory(
  category: string,
  data: Partial<CreateCategoryPayload>,
) {
  const response = await axios.patch(`${BASE_URL}/category/${category}`, data);
  return response.data;
}

export async function deleteCategory(category: string) {
  return axios.delete(`${BASE_URL}/category/${category}`);
}

export const fetchCategories = async (): Promise<{
  data: Category[];
}> => {
  const response = await axios.get(`${BASE_URL}/category`);

  return {
    data: response.data.data,
  };
};
