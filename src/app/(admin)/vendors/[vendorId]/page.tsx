import VendorDetailsComponent from "@/components/vendors/[vendorId]";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المتجر | برق",
  description: "هذه هي صفحة تفاصيل المتجر حيث يمكنك إدارة بيانات المتجر.",
};

export default function VendorDetailsPage() {
  return <VendorDetailsComponent />;
}
