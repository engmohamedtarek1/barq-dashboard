import VendorDetailsComponent from "@/components/vendors/[vendorId]";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل البائع | برق",
  description: "هذه هي صفحة تفاصيل البائع حيث يمكنك إدارة بيانات البائع.",
};

export default function VendorDetailsPage() {
  return <VendorDetailsComponent />;
}
