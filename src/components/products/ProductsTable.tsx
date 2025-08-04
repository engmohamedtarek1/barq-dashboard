// src/components/products/ProductsTable.tsx
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
import { useProducts } from "@/hooks/useProducts";
import Pagination from "../tables/Pagination";
import {
  AddProductButton,
  DeleteProductButton,
  EditProductButton,
} from "./ProductsModals";

const limits = [5, 10, 20, 50];

export default function ProductsTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { products, loading, totalPages, refetch } = useProducts(page, limit);

  const filteredProducts = products.filter(
    (product) =>
      product.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  console.log("Filtered Products:", filteredProducts);

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
            placeholder="Search for products..."
            className="h-11 w-full rounded-lg border border-gray-500 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:outline-hidden dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        {/* Add Product Button */}
        <AddProductButton onSuccess={refetch} />
      </div>

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
                    Product
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
                    Vendor
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Sold Times
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Review Count
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
                    Description
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
                      Loading products...
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="px-5 py-4 text-start sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              width={40}
                              height={40}
                              src={
                                product.image || "/images/logo/barq-logo.png"
                              }
                              alt={product.nameEn}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 dark:text-white/90">
                              {product.nameEn} | {product.nameAr}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              ${product.price}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {product.category.nameAr}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {product.shopId.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {product.amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {product.soldTimes}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                        {product.reviewCount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        ⭐ {product.rating}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {product.description.slice(0, 50)}...
                      </TableCell>
                      <TableCell className="space-x-4 px-4 py-3 text-gray-500 dark:text-gray-400">
                        <EditProductButton
                          product={product}
                          onSuccess={refetch}
                        />
                        <DeleteProductButton
                          productId={product._id}
                          onSuccess={refetch}
                        />
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
