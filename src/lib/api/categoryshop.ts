// lib/api/categoryshop.ts
import axios from "axios";
import { Categoryshop, CreateCategoryshopPayload } from "@/types/categoryshop";
import { BASE_URL } from "../config";

export async function createCategoryshop(payload: CreateCategoryshopPayload) {
  return axios.post(`${BASE_URL}/category-shop`, payload);
}

export async function updateCategoryshop(
  category: string,
  data: Partial<CreateCategoryshopPayload>,
) {
  const response = await axios.patch(
    `${BASE_URL}/category-shop/${category}`,
    data,
  );
  return response.data;
}

export async function deleteCategoryshop(category: string) {
  return axios.delete(`${BASE_URL}/category-shop/${category}`);
}

export const fetchCategoryshops = async (
  page?: number,
  limit?: number,
): Promise<{ data: Categoryshop[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/category-shop`, {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pages: response.data.metadata.pages,
  };
};

export const fetchCategoryshopsByVendor = async (
  vendor: string,
): Promise<{ data: Categoryshop[] }> => {
  const response = await axios.get(`${BASE_URL}/category-shop`, {
    params: { shop: vendor },
  });

  return {
    data: response.data.data,
  };
};
