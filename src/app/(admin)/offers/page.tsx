// src/app/(admin)/offers/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OffersTable from "@/components/offers/OffersTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "العروض | برق",
  description: "هذه هي صفحة العروض حيث يمكنك إدارة بيانات العروض.",
};

export default function Offers() {
  return (
    <div>
      <PageBreadcrumb pageTitle="العروض" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <OffersTable />
      </div>
    </div>
  );
}
