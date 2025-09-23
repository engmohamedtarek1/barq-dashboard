// src/app/(admin)/customer-service/page.tsx

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomerServiceComponent from "@/components/customer-service/CustomerService";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "خدمة العملاء | برق",
  description: "هذه هي صفحة خدمة العملاء حيث يمكنك إدارة بيانات خدمة العملاء.",
};

export default function CustomerService() {
  return (
    <div>
      <PageBreadcrumb pageTitle="خدمة العملاء" />

      <CustomerServiceComponent />
    </div>
  );
}
