// src/components/orders/OrdersTable.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "../tables/Pagination";
import { FaEye } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { useEffect } from "react";
import io from "socket.io-client";
import { getAuthToken } from "@/lib/api/auth";

const limits = [5, 10, 20, 50];

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use shared orders hook with internal pagination
  const {
    data: orders,
    loading,
    metadata,
    page,
    setPage,
    limit,
    setLimit,
    refetch,
  } = useOrders({ initialPage: 1, initialLimit: 10 });

  useEffect(() => {
    const token = getAuthToken();
    const socket = io("http://localhost:4000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
      withCredentials: true,
      transports: ["polling", "websocket"], // polling first for handshake
    });

    socket.on("new:order", () => {
      refetch();
    });

    socket.on("update:order", () => {
      refetch();
    });
  }, [refetch]);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const idTail = o._id?.slice(-6) ?? "";
      const user = o.userId?.mobile ?? "";
      const shop = o.shopId?.name ?? "";
      return (
        idTail.toLowerCase().includes(q) ||
        user.toLowerCase().includes(q) ||
        shop.toLowerCase().includes(q)
      );
    });
  }, [orders, searchTerm]);

  const effectiveTotalPages = metadata.totalPages || 1;

  return (
    <div className="space-y-4">
      {/* Card Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2">
            <svg
              className="fill-gray-500 dark:fill-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill=""
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث عن متاجر..."
            className="h-11 w-full rounded-lg border border-gray-500 bg-transparent py-2.5 ps-12 pe-14 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:outline-hidden dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        {/* Add Order Button */}
        {/* <AddOrderButton onSuccess={refetch} /> */}
      </div>

      {/* Limit Selector */}
      <div className="flex items-center justify-end gap-2">
        <label
          htmlFor="limit"
          className="text-sm text-gray-600 dark:text-white/70"
        >
          عمود في الصفحة:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/80"
        >
          {limits.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader className="text-start font-medium">
                    رقم الطلب
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    المستخدم
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    المتجر
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    الإجمالي
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    الدفع
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    حالة الطلب
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    تاريخ الإنشاء
                  </TableCell>
                  <TableCell isHeader className="text-start font-medium">
                    إجراءات
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              {loading ? (
                <TableBody>
                  {Array.from({ length: 6 }).map((_, rowIdx) => (
                    <TableRow key={rowIdx}>
                      <TableCell className="px-4 py-6 text-center text-gray-500">
                        <Skeleton baseColor="#ecebeb" width={80} height={16} />
                      </TableCell>
                      {Array.from({ length: 6 }).map((_, cellIdx) => (
                        <TableCell
                          key={cellIdx}
                          className="px-4 py-6 text-center text-gray-500"
                        >
                          <Skeleton
                            baseColor="#ecebeb"
                            width="100%"
                            height={16}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="px-4 py-6 text-center text-gray-500">
                        <Skeleton baseColor="#ecebeb" width={24} height={24} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredOrders.map((o) => (
                    <TableRow key={o._id}>
                      <TableCell className="px-5 py-4 text-start">
                        <Link
                          href={`/orders/${o._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {o._id.slice(-6)}
                        </Link>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {o.userId?.mobile}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-4">
                          <div className="h-8 w-8 overflow-hidden rounded-full">
                            <Image
                              src={
                                o.shopId?.profileImage ||
                                "/images/logo/barq-logo.png"
                              }
                              alt={o.shopId?.name || "shop"}
                              width={32}
                              height={32}
                              className="h-8 w-8 object-cover"
                            />
                          </div>
                          <div className="text-sm">
                            <p>{o.shopId?.name}</p>
                            <p>{o.shopId?.mobile}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {o.totalAmount?.toLocaleString()} ج.م
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {o.paymentMethod} / {o.paymentStatus}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          size="sm"
                          color={
                            o.orderStatus === "completed"
                              ? "success"
                              : o.orderStatus === "pending"
                                ? "warning"
                                : "info"
                          }
                        >
                          {o.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {new Date(
                          o.createdAt as unknown as string,
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Link
                          href={`/orders/${o._id}`}
                          className="text-sm text-indigo-600 dark:text-indigo-400"
                          title="عرض الطلب"
                        >
                          <FaEye />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end pt-2">
        <Pagination
          currentPage={page}
          totalPages={effectiveTotalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
