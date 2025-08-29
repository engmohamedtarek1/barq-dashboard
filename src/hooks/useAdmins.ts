// src/hooks/useAdmins.ts
import { useCallback, useEffect, useState } from "react";
import { Admin } from "@/types/admin";
import { fetchAdmins } from "@/lib/api/admins";

export function useAdmins(page: number, limit: number) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchAdmins(page, limit);
      setAdmins(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  return { admins, loading, totalPages, refetch: loadAdmins };
}
