"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getSingleVendor } from "@/lib/api/vendors";
import { Vendor } from "@/types/vendor";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

export default function VendorDetailsPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    const fetchVendor = async () => {
      try {
        const data = await getSingleVendor(vendorId);
        setVendor(data);
      } catch {
        setError("فشل تحميل بيانات البائع");
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

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

  if (error || !vendor) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-600 dark:text-gray-400">
          {error || "لم يتم العثور على البائع"}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/vendors")}
        >
          العودة
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              {vendor.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              معرف: {vendor._id}
            </p>
          </div>
          <Button size="sm" onClick={() => router.push("/vendors")}>
            رجوع
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: Main info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-4">
                <Image
                  width={140}
                  height={140}
                  src={vendor.profileImage || "/images/logo/barq-logo.png"}
                  alt={vendor.name}
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-gray-100 dark:ring-white/10"
                />
                <Badge
                  size="sm"
                  color={vendor.isActive ? "success" : "error"}
                  variant="light"
                >
                  {vendor.isActive ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
                    معلومات عامة
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoItem label="الاسم" value={vendor.name} />
                    <InfoItem label="الهاتف" value={vendor.mobile} />
                    <InfoItem label="الموقع" value={vendor.location} />
                    <InfoItem label="ساعات العمل" value={vendor.workingHours} />
                    <InfoItem label="التقييم" value={`${vendor.rating} ⭐`} />
                    {/* If reviewCount becomes available in Vendor type, re-enable */}
                    {/* <InfoItem label="عدد المراجعات" value={`${vendor.reviewCount ?? 0}`} /> */}
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
                    الفئة
                  </h2>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-white/5">
                    <p className="text-gray-700 dark:text-gray-300">
                      {vendor.category?.nameAr} / {vendor.category?.nameEn}
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
                    الفئات الفرعية
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {vendor.subcategories?.length ? (
                      vendor.subcategories.map((sc) => (
                        <span
                          key={sc._id}
                          className="bg-brand-500/10 text-brand-600 dark:text-brand-300 rounded-full px-3 py-1 text-xs"
                        >
                          {sc.nameAr} / {sc.nameEn}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        لا يوجد
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Metadata */}
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.05]">
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                الوضع
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                {vendor.isActive ? "الحساب فعال" : "الحساب غير فعال"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.05]">
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                الإجراءات
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/vendors`)}
                >
                  رجوع
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-white/10">
      <span className="block text-[11px] font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
        {label}
      </span>
      <span className="mt-0.5 block font-medium text-gray-800 dark:text-white/90">
        {value}
      </span>
    </div>
  );
}
