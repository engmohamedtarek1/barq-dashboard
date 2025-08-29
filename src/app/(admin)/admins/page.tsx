// src/app/(admin)/admins/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminsTable from "@/components/admins/AdminsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "المشرفين | برق",
  description: "هذه هي صفحة المشرفين حيث يمكنك إدارة بيانات المشرفين.",
};

export default function Admins() {
  return (
    <div>
      <PageBreadcrumb pageTitle="المشرفين" />

      <div
        className={`space-y-6 rounded-2xl border border-t border-gray-100 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]`}
      >
        <AdminsTable />
      </div>
    </div>
  );
}
