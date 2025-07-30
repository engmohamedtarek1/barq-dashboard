import { BASE_URL } from "@/lib/config";
import { Vendor } from "@/types/vendor";
import axios from "axios";
import { useEffect, useState } from "react";

export function useVendors(page: number, limit: number) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/admin/vendors?page=${page}&limit=${limit}`)
      .then((res) => {
        setVendors(res.data.data);
        setTotalPages(res.data.metadata.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vendors:", err);
        setLoading(false);
      });
  }, [page, limit]);

  return { vendors, loading, totalPages };
}
