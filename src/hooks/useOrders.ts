"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllOrders,
  getOrderById,
  getOrderStatsSummary,
  getRecentOrders,
  getShopOrders,
  getUserOrders,
  deleteOrderByAdmin,
  OrdersListResponse,
  OrderQueryParams,
  OrderStatsSummary,
} from "@/lib/api/orders";
import { Order } from "@/types/order";

export type UseOrdersOptions = Omit<OrderQueryParams, "page" | "limit"> & {
  initialPage?: number;
  initialLimit?: number;
};

export function useOrders(options: UseOrdersOptions = {}) {
  const { initialPage = 1, initialLimit = 10, ...initialFilters } = options;

  const [data, setData] = useState<Order[]>([]);
  const [metadata, setMetadata] = useState<OrdersListResponse["metadata"]>({
    totalOrders: 0,
    currentPage: initialPage,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] =
    useState<Omit<OrderQueryParams, "page" | "limit">>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const params = useMemo<OrderQueryParams>(
    () => ({ page, limit, ...filters }),
    [page, limit, filters],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllOrders(params);
      setData(res.data);
      setMetadata(res.metadata);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    metadata,
    page,
    setPage,
    limit,
    setLimit,
    filters,
    setFilters,
    loading,
    error,
    refetch,
  };
}

export function useOrder(orderId?: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getOrderById(orderId);
      setOrder(res.data);
        } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}

export function useRecentOrders(limit = 10) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecentOrders(limit);
      setOrders(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecent();
  }, [fetchRecent]);

  return { orders, loading, error, refetch: fetchRecent };
}

export function useOrderStats(filters?: { shopId?: string; userId?: string }) {
  const [stats, setStats] = useState<OrderStatsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrderStatsSummary(filters);
      setStats(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useShopOrders(
  shopId: string | undefined,
  options: UseOrdersOptions = {},
) {
  const { initialPage = 1, initialLimit = 10, ...initialFilters } = options;
  const [data, setData] = useState<Order[]>([]);
  const [metadata, setMetadata] = useState<OrdersListResponse["metadata"]>({
    totalOrders: 0,
    currentPage: initialPage,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] =
    useState<Omit<OrderQueryParams, "page" | "limit">>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getShopOrders(shopId, { page, limit, ...filters });
      setData(res.data);
      setMetadata(res.metadata);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [shopId, page, limit, filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    metadata,
    page,
    setPage,
    limit,
    setLimit,
    filters,
    setFilters,
    loading,
    error,
    refetch,
  };
}

export function useUserOrders(
  userId: string | undefined,
  options: UseOrdersOptions = {},
) {
  const { initialPage = 1, initialLimit = 10, ...initialFilters } = options;
  const [data, setData] = useState<Order[]>([]);
  const [metadata, setMetadata] = useState<OrdersListResponse["metadata"]>({
    totalOrders: 0,
    currentPage: initialPage,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [filters, setFilters] =
    useState<Omit<OrderQueryParams, "page" | "limit">>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getUserOrders(userId, { page, limit, ...filters });
      setData(res.data);
      setMetadata(res.metadata);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit, filters]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    metadata,
    page,
    setPage,
    limit,
    setLimit,
    filters,
    setFilters,
    loading,
    error,
    refetch,
  };
}

export function useDeleteOrder(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteOrder = useCallback(
    async (orderId: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteOrderByAdmin(orderId);
        onSuccess?.();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess],
  );

  return { deleteOrder, loading, error };
}
