import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VideosExample from "@/components/ui/video/VideosExample";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "مقاطع الفيديو | برق",
  description:
    "هذه هي صفحة مقاطع الفيديو حيث يمكنك مشاهدة وإدارة مقاطع الفيديو.",
};

export default function VideoPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="مقاطع الفيديو" />

      <VideosExample />
    </div>
  );
}
