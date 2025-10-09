// lib/api/categorys.ts
import axios from "axios";
import { Category, CreateCategoryPayload } from "@/types/category";
import { BASE_URL } from "../config";
import { authHeaders } from "./auth";

export async function createCategory(payload: CreateCategoryPayload) {
  return axios.post(`${BASE_URL}/category`, payload, {
    headers: {
      ...authHeaders(),
    },
  });
}

export async function updateCategory(
  category: string,
  data: Partial<CreateCategoryPayload>,
) {
  const response = await axios.patch(`${BASE_URL}/category/${category}`, data, {
    headers: {
      ...authHeaders(),
    },
  });
  return response.data;
}

export async function deleteCategory(category: string) {
  return axios.delete(`${BASE_URL}/category/${category}`, {
    headers: {
      ...authHeaders(),
    },
  });
}

export const fetchCategories = async (): Promise<{
  data: Category[];
}> => {
  const response = await axios.get(`${BASE_URL}/category`, {
    headers: {
      ...authHeaders(),
    },
  });

  return {
    data: response.data.data,
  };
};

export const fetchCategoriesByKeyword = async (
  keyword: string,
  page: number,
  limit: number,
): Promise<{ data: Category[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/category`, {
    params: { keyword, page, limit },
    headers: {
      ...authHeaders(),
    },
  });
  return {
    data: response.data.data ?? [],
    pages: response.data?.metadata?.pages ?? 1,
  };
};
