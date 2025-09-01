import OfferDetailsComponent from "@/components/offers/[offerId]";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل البائع | برق",
  description: "هذه هي صفحة تفاصيل البائع حيث يمكنك إدارة بيانات البائع.",
};

export default function OfferDetailsPage() {
  return <OfferDetailsComponent />;
}
