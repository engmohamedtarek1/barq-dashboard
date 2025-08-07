// lib/api/categorys.ts
import axios from "axios";
import { Category, CreateCategoryPayload } from "@/types/category";
import { BASE_URL } from "../config";

export async function createCategory(payload: CreateCategoryPayload) {
  return axios.post(`${BASE_URL}/category`, payload);
}

export async function updateCategory(
  categoryId: string,
  data: Partial<CreateCategoryPayload>,
) {
  const response = await axios.patch(
    `${BASE_URL}/category/${categoryId}`,
    data,
  );
  return response.data;
}

export async function deleteCategory(categoryId: string) {
  return axios.delete(`${BASE_URL}/category/${categoryId}`);
}

export const fetchCategories = async (): Promise<{
  data: Category[];
}> => {
  const response = await axios.get(`${BASE_URL}/category`);

  return {
    data: response.data.data,
  };
};
