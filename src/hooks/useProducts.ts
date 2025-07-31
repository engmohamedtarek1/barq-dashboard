import { BASE_URL } from "@/lib/config";
import { Product } from "@/types/product";
import axios from "axios";
import { useEffect, useState } from "react";

export function useProducts(page: number, limit: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/product?page=${page}&limit=${limit}`)
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.metadata.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [page, limit]);

  return { products, loading, totalPages };
}
