// lib/api/vendors.ts
import axios from "axios";
import { Vendor } from "@/types/vendor";
import { BASE_URL } from "../config";
import { CreateVendorPayload } from "@/types/vendor";

export async function createVendor(payload: CreateVendorPayload) {
  return axios.post(`${BASE_URL}/admin/users`, payload);
}

export const fetchVendors = async (
  page: number,
  limit: number,
): Promise<{ data: Vendor[]; pages: number }> => {
  const response = await axios.get(`${BASE_URL}/admin/vendors`, {
    params: { page, limit },
  });

  return {
    data: response.data.data,
    pages: response.data.metadata.pages,
  };
};
