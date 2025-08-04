import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ResponsiveImage from "@/components/ui/images/ResponsiveImage";
import ThreeColumnImageGrid from "@/components/ui/images/ThreeColumnImageGrid";
import TwoColumnImageGrid from "@/components/ui/images/TwoColumnImageGrid";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "الصور | برق",
  description: "هذه هي صفحة الصور حيث يمكنك إدارة الصور.",
  // other metadata
};

export default function Images() {
  return (
    <div>
      <PageBreadcrumb pageTitle="الصور" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="صورة متجاوبة">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="صورة في شبكة 2">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="صورة في شبكة 3">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  );
}
