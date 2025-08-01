import { useCallback, useEffect, useState } from "react";
import { Vendor } from "@/types/vendor";
import { fetchVendors } from "@/lib/api/vendors";

export function useVendors(page: number, limit: number) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchVendors(page, limit);
      setVendors(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  return { vendors, loading, totalPages, refetch: loadVendors };
}
