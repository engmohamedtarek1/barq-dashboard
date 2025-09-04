import OfferDetailsComponent from "@/components/offers/[offerId]";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل العرض | برق",
  description: "هذه هي صفحة تفاصيل العرض حيث يمكنك إدارة بيانات العرض.",
};

export default function OfferDetailsPage() {
  return <OfferDetailsComponent />;
}
