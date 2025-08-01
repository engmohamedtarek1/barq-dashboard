// lib/api/products.ts
import axios from "axios";
import { Product } from "@/types/product";
import { BASE_URL } from "../config";

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
