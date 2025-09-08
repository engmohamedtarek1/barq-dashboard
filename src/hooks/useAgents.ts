// src/hooks/useAgents.ts
import { useCallback, useEffect, useState } from "react";
import { Agent } from "@/types/agent";
import { fetchAgents } from "@/lib/api/agents";

export function useAgents(page: number, limit: number) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, pages } = await fetchAgents(page, limit);
      setAgents(data);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return { agents, loading, totalPages, refetch: loadAgents };
}
