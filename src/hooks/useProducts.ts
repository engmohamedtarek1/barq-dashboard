// src/hooks/useProducts.ts
import { useCallback, useEffect, useState } from "react";
import { Product } from "@/types/product";
import { fetchProducts } from "@/lib/api/products";

export function useProducts(page: number, limit: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchProducts(page, limit);
      setProducts(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, totalPages, refetch: loadProducts };
}
