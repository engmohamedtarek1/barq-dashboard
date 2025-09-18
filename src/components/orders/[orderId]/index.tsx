"use client";

import Button from "@/components/ui/button/Button";
import { useOrder } from "@/hooks/useOrders";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailsComponent() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { order, loading, error } = useOrder(orderId);

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
      {/* ملخص الطلب */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
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

      {/* معلومات العميل */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">معلومات العميل</div>
        <div className="mb-2">
          <div className="flex h-20 w-full items-center justify-center rounded-lg bg-gray-100">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              عرض على الخريطة
              <svg
                width="16"
                height="16"
                fill="currentColor"
                className="inline-block"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#aaa"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M8 4v4l3 2"
                  stroke="#aaa"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between py-2">
            <span>اسم العميل</span>
            <span className="font-medium text-gray-700">
              {order.userId?.mobile ?? "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>رقم الهاتف</span>
            <span className="font-medium text-gray-700">
              {order.userId?.mobile ?? "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>عنوان العميل</span>
            <span className="font-medium text-gray-700">
              {order.deliveryAddress?.fullAddress ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل المتجر */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">تفاصيل المتجر</div>
        <div className="mb-2 flex items-center gap-2">
          <span className="font-medium text-gray-700">
            {order.shopId?.name ?? "-"}
          </span>
          <Image
            src={order.shopId?.profileImage || "/images/logo/barq-logo.png"}
            alt="اسم المتجر"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between py-2">
            <span>أرقام التواصل</span>
            <span className="font-medium text-gray-700">
              {order.shopId?.mobile ?? "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>عنوان المتجر</span>
            <span className="font-medium text-gray-700">
              {order.shopId?.location ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل التوصيل */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">تفاصيل التوصيل</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between py-2">
            <span>اسم المنسوب</span>
            <span className="font-medium text-gray-700">
              {order.deliveryAgent?.name ?? "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>رقم المنسوب</span>
            <span className="font-medium text-gray-700">
              {order.deliveryAgent?.mobile ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* تفاصيل التوصيل breakdown */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">تفاصيل التوصيل</div>
        <div className="mb-2 flex justify-between text-xs text-gray-500">
          <span>عدد المنتجات</span>
          <span>{order.items?.length ?? 0}</span>
        </div>
        <div className="flex flex-col gap-1 text-sm">
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

      {/* تفاصيل الطلب */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">تفاصيل الطلب</div>
        <div className="flex flex-col gap-2">
          {order.items?.length ? (
            order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 border-b pb-2 last:border-b-0"
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
                <div className="text-sm font-bold">
                  {item.price?.toLocaleString()} ج.م
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-500">لا توجد منتجات</div>
          )}
        </div>
      </div>

      {/* ملاحظات العميل */}
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-2 font-bold text-gray-800">ملاحظات العميل</div>
        <div className="min-h-[48px] text-xs text-gray-500">
          لا توجد أي ملاحظات
        </div>
      </div>
    </div>
  );
}
