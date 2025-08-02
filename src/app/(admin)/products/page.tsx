// src/app/(admin)/products/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductsTable from "@/components/products/ProductsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Products | Barq",
  description: "This is the Products page where you can manage vendor data.",
};

export default function Products() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Products" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <ProductsTable />
      </div>
    </div>
  );
}
