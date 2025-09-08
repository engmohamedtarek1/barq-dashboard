// src/app/(admin)/agents/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentsTable from "@/components/agents/AgentsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "عمال التوصيل | برق",
  description: "هذه هي صفحة عمال التوصيل حيث يمكنك إدارة بيانات عمال التوصيل.",
};

export default function Agents() {
  return (
    <div>
      <PageBreadcrumb pageTitle="عمال التوصيل" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <AgentsTable />
      </div>
    </div>
  );
}
