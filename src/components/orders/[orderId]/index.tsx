"use client";

import Button from "@/components/ui/button/Button";
import { useOrder } from "@/hooks/useOrders";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CiLocationOn, CiPhone } from "react-icons/ci";

export default function OrderDetailsComponent() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { order, loading, error } = useOrder(orderId);
  const coords = order?.deliveryAddress?.location;
  const mapUrl = coords
    ? `https://www.google.com/maps?q=${coords[0]},${coords[1]}`
    : undefined;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-gray-400">
          {error ? "فشل تحميل الطلب" : "لم يتم العثور على الطلب"}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/orders")}
        >
          العودة
        </Button>
      </div>
    );
  }

  // Layout
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-3">
      <div className="col-span-full flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            طلب رقم {order.orderNumber || "-"}
          </h1>
        </div>
        <Button size="sm" onClick={() => router.push("/vendors")}>
          رجوع
        </Button>
      </div>

      {/* ملخص الطلب */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-2 flex justify-between gap-2 font-bold text-gray-800">
          ملخص الطلب
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
            {order.orderStatus || "-"}
          </span>
        </div>

        <div className="flex flex-col gap-1 divide-y-2 text-sm">
          <div className="flex justify-between py-2">
            <span>رقم الطلب</span>
            <span className="font-medium text-gray-700">
              #{order.orderNumber || "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>الإجمالي</span>
            <span className="font-bold text-gray-800">
              {order.sumAmount?.toLocaleString() || "-"} ج.م
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>تاريخ الطلب</span>
            <span className="font-medium text-gray-700">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>طريقة الدفع</span>
            <span className="font-medium text-gray-700">
              {order.paymentMethod || "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>حالة الدفع</span>
            <span className="font-medium text-gray-700">
              {order.paymentStatus || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل المتجر */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-2 font-bold text-gray-800">تفاصيل المتجر</div>
        <div className="mb-2 flex items-center gap-2">
          <Image
            src={order.shopId?.profileImage || "/images/logo/barq-logo.png"}
            alt="اسم المتجر"
            width={32}
            height={32}
            className="size-10 rounded-full"
          />
          <span className="font-medium text-gray-700">
            {order.shopId?.name ?? "-"}
          </span>
        </div>
        <div className="flex flex-col gap-1 divide-y-2 text-sm">
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>رقم الهاتف</span>
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <CiPhone className="text-xl text-blue-600" />
              {order.shopId?.mobile ?? "-"}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>عنوان المتجر</span>
            <span className="flex gap-2 font-medium text-gray-700">
              <CiLocationOn className="flex-shrink-0 text-xl text-blue-600" />
              {order.shopId?.location ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* معلومات العميل */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-2 font-bold text-gray-800">معلومات العميل</div>
        <div className="mb-2">
          <div className="flex h-16 w-full items-center justify-center rounded-lg bg-[url('/images/country/map-placeholder.png')]">
            <Link
              href={mapUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-4xl bg-black/10 p-2 text-xs text-blue-900 backdrop-blur-xs transition-all duration-500 hover:underline hover:backdrop-blur-lg"
            >
              <CiLocationOn className="flex items-center gap-1 text-xl" />
              عرض على الخريطة
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-1 divide-y-2 text-sm">
          {/* <div className="flex flex-col justify-between gap-2 py-2">
            <span>اسم العميل</span>
            <span className="font-medium text-gray-700">
              {order.userId.mobile ?? "-"}
            </span>
          </div> */}
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>رقم الهاتف</span>
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <CiPhone className="text-xl text-blue-600" />
              {order.userId?.mobile ?? "-"}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>عنوان العميل</span>
            <span className="flex gap-2 font-medium text-gray-700">
              <CiLocationOn className="flex-shrink-0 text-xl text-blue-600" />
              {order.deliveryAddress?.fullAddress ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل الطلب */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 lg:col-span-2">
        <div className="mb-4 font-bold text-gray-800">تفاصيل الطلب</div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2">
              {order.items?.length ? (
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-xl border-2 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.itemId?.image || "/images/logo/barq-logo.png"}
                        alt={item.itemId?.nameAr || "منتج"}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {item.itemId?.nameAr ?? "اسم المنتج"}
                        </div>
                        <div className="text-xs text-gray-500">
                          الكمية: {item.quantity ?? 1}
                        </div>
                      </div>
                    </div>
                    <div className="text-brand-blue text-sm font-bold">
                      {item.price?.toLocaleString()} ج.م
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500">لا توجد منتجات</div>
              )}
            </div>
          </div>

          {/* تفاصيل التوصيل breakdown */}
          <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-gray-100 p-4">
            <div className="mb-2 font-bold text-gray-800">تفاصيل التوصيل</div>
            <div className="flex flex-col gap-1 divide-y-2 text-sm">
              <div className="flex justify-between py-2">
                <span>عدد المنتجات</span>
                <span className="font-bold">
                  {order.items?.length ?? 0} منتجات
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>السعر</span>
                <span className="font-bold">
                  {order.totalAmount?.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>رسوم التوصيل</span>
                <span className="font-bold">
                  {order.deliveryFee?.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>الخصم</span>
                <span className="font-bold text-red-600">
                  {order.totalDiscount?.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>الإجمالي</span>
                <span className="font-bold">
                  {order.sumAmount?.toLocaleString()} ج.م
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تفاصيل التوصيل */}
      <div className="flex h-fit flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-2 font-bold text-gray-800">تفاصيل التوصيل</div>
        <div className="flex flex-col gap-1 divide-y-2 text-sm">
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>اسم المنسوب</span>
            <span className="font-medium text-gray-700">
              {order.deliveryAgent?.name ?? "-"}
            </span>
          </div>
          <div className="flex flex-col justify-between gap-2 py-2">
            <span>رقم المنسوب</span>
            <span className="flex items-center gap-2 font-medium text-gray-700">
              <CiPhone className="text-xl text-blue-600" />
              {order.deliveryAgent?.mobile ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* ملاحظات العميل */}
      {/* <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-2 font-bold text-gray-800">ملاحظات العميل</div>
        <div className="min-h-[48px] text-xs text-gray-500">
          لا توجد أي ملاحظات
        </div>
      </div> */}
    </div>
  );
}
