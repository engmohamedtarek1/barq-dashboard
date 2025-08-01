// src/app/(admin)/vendors/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VendorsTable from "@/components/vendors/VendorsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vendors | Barq",
  description: "This is the Vendors page where you can manage vendor data.",
};

export default function Vendors() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Vendors" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <VendorsTable />
      </div>
    </div>
  );
}
