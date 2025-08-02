// lib/api/products.ts
import axios from "axios";
import { CreateProductPayload, Product } from "@/types/product";
import { BASE_URL } from "../config";

export async function createProduct(payload: CreateProductPayload) {
  return axios.post(`${BASE_URL}/product`, payload);
}

export async function updateProduct(
  productId: string,
  data: Partial<CreateProductPayload>,
) {
  const response = await axios.patch(`${BASE_URL}/product/${productId}`, data);
  return response.data;
}

export async function deleteProduct(productId: string) {
  return axios.delete(`${BASE_URL}/product/${productId}`);
}

export const fetchProducts = async (
  page: number,
  limit: number,
): Promise<{ data: Product[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/product`, {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pages: response.data.metadata.pages,
  };
};
