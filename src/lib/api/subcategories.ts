// lib/api/subcategory.ts
import axios from "axios";
import { Subcategory, CreateSubcategoryPayload } from "@/types/subcategory";
import { BASE_URL } from "../config";
import { authHeaders } from "./auth";

export async function createSubcategory(payload: CreateSubcategoryPayload) {
  return axios.post(`${BASE_URL}/subcategory`, payload, {
    headers: {
      ...authHeaders(),
    },
  });
}

export async function updateSubcategory(
  category: string,
  data: Partial<CreateSubcategoryPayload>,
) {
  const response = await axios.patch(
    `${BASE_URL}/subcategory/${category}`,
    data,
    {
      headers: {
        ...authHeaders(),
      },
    },
  );
  return response.data;
}

export async function deleteSubcategory(category: string) {
  return axios.delete(`${BASE_URL}/subcategory/${category}`, {
    headers: {
      ...authHeaders(),
    },
  });
}

export const fetchSubcategories = async (
  page?: number,
  limit?: number,
): Promise<{ data: Subcategory[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/subcategory`, {
    params: { page, limit },
    headers: {
      ...authHeaders(),
    },
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
    headers: {
      ...authHeaders(),
    },
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
    headers: {
      ...authHeaders(),
    },
  });
  return {
    data: response.data.data ?? [],
    pages: response.data?.metadata?.pages ?? 1,
  };
};
