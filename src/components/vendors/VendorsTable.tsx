"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { useVendors } from "@/hooks/useVendors";
import Pagination from "../tables/Pagination";
import VendorsActions from "./VendorsActions";

const limits = [5, 10, 20, 50];

export default function VendorsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { vendors, loading, totalPages } = useVendors(page, limit);

  return (
    <div className="space-y-4">
      {/* Limit Selector */}
      <div className="flex items-center justify-end gap-2">
        <label
          htmlFor="limit"
          className="text-sm text-gray-600 dark:text-white/70"
        >
          Rows per page:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1); // Reset to first page when limit changes
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
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Vendor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Location
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Rating
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell className="py-6 text-center text-gray-500">
                      Loading vendors...
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {vendors.map((vendor) => (
                    <TableRow key={vendor._id}>
                      <TableCell className="px-5 py-4 text-start sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              width={40}
                              height={40}
                              src={vendor.profileImage}
                              alt={vendor.name}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 dark:text-white/90">
                              {vendor.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {vendor.mobile}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {vendor.category?.nameEn}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {vendor.location}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={vendor.isActive ? "success" : "error"}
                        >
                          {vendor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        ⭐ {vendor.rating}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        <VendorsActions vendor={vendor} />
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
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
