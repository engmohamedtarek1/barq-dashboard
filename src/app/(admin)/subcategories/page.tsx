// src/app/(admin)/categories/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SubcategoriesTable from "@/components/subcategories/SubcategoriesTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "الفئات | برق",
  description: "هذه هي صفحة الفئات حيث يمكنك إدارة بيانات الفئات.",
};

export default function Subcategories() {
  return (
    <div>
      <PageBreadcrumb pageTitle="الفئات" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <SubcategoriesTable />
      </div>
    </div>
  );
}
