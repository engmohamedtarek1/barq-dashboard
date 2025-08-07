// src/hooks/useSubcategories.ts
import { useCallback, useEffect, useState } from "react";
import { fetchSubcategories } from "@/lib/api/subcategories";
import { Subcategory } from "@/types/subcategory";

export function useSubcategories(page: number, limit: number) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadSubcategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchSubcategories(page, limit);
      setSubcategories(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadSubcategories();
  }, [loadSubcategories]);

  return { subcategories, loading, totalPages, refetch: loadSubcategories };
}
