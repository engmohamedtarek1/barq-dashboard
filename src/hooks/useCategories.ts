// src/hooks/useCategories.ts
import { useCallback, useEffect, useState } from "react";
import { Category } from "@/types/category";
import { fetchCategories } from "@/lib/api/categories";

export function useCategories(page: number, limit: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchCategories(); // get full data

      const calculatedPages = Math.ceil(data.length / limit);
      setTotalPages(calculatedPages);

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = data.slice(start, end);

      setCategories(paginatedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return { categories, loading, totalPages, refetch: loadCategories };
}
