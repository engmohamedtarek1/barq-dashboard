// src/hooks/useOffers.ts
import { useCallback, useEffect, useState } from "react";
import { Offer } from "@/types/offer";
import { fetchOffers } from "@/lib/api/offers";

export function useOffers(page: number, limit: number) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchOffers(page, limit);
      setOffers(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  return { offers, loading, totalPages, refetch: loadOffers };
}
