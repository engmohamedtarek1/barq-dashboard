import { Metadata } from "next";
import OrderDetailsComponent from "@/components/orders/[orderId]";

export const metadata: Metadata = {
  title: "تفاصيل الطلب | برق",
  description: "هذه هي صفحة تفاصيل الطلب حيث يمكنك إدارة بيانات الطلب.",
};

export default function OrderDetailsPage() {
  return <OrderDetailsComponent />;
}
