// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useParams, useRouter } from "next/navigation";
// import { getSingleOrder } from "@/lib/api/orders";
// import { Order } from "@/types/order";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import Button from "@/components/ui/button/Button";
// import Badge from "@/components/ui/badge/Badge";
// import {
//   EditOrderButton,
//   DeleteOrderButton,
// } from "@/components/orders/OrdersModals";
// import CategoryShopCRUD from "./CategoryShopCRUD";
// import { AddProductButton } from "@/components/products/ProductsModals";
// import InfoCard from "@/components/shared/InfoCard";

// export default function OrderDetailsComponent() {
//   const { orderId } = useParams<{ orderId: string }>();
//   const router = useRouter();
//   const [order, setOrder] = useState<Order | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!orderId) return;
//     const fetchOrder = async () => {
//       try {
//         const data = await getSingleOrder(orderId);
//         setOrder(data);
//       } catch {
//         setError("فشل تحميل بيانات البائع");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   if (loading) {
//     return (
//       <div className="flex h-[60vh] items-center justify-center">
//         <div className="text-center">
//           <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-400">
//             جاري التحميل...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
//         <p className="text-gray-600 dark:text-gray-400">
//           {error || "لم يتم العثور على البائع"}
//         </p>
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => router.push("/orders")}
//         >
//           العودة
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <div className="space-y-8">
//         <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
//               {order.name}
//             </h1>
//           </div>
//           <Button size="sm" onClick={() => router.push("/orders")}>
//             رجوع
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//           {/* Left column: Main info */}
//           <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-white/10 dark:bg-white/[0.05]">
//             <div className="flex flex-col gap-6 sm:flex-row">
//               <div className="flex flex-col items-center gap-4">
//                 <Image
//                   width={140}
//                   height={140}
//                   src={order.profileImage || "/images/logo/barq-logo.png"}
//                   alt={order.name}
//                   className="h-36 w-36 rounded-full object-contain ring-4 ring-gray-100 dark:ring-white/10"
//                 />
//                 <Badge
//                   size="sm"
//                   color={order.isActive ? "success" : "error"}
//                   variant="light"
//                 >
//                   {order.isActive ? "نشط" : "غير نشط"}
//                 </Badge>
//               </div>

//               <div className="flex-1 space-y-6">
//                 {/* Name, Phone Number, Location, Working Hours, Rating, Review Count */}
//                 <div>
//                   <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
//                     معلومات عامة
//                   </h2>
//                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                     <InfoCard label="الاسم" value={order.name} />
//                     <InfoCard label="الهاتف" value={order.mobile} />
//                     <InfoCard
//                       label="الموقع"
//                       value={order.location ? order.location : "غير محدد"}
//                     />
//                     <InfoCard
//                       label="ساعات العمل"
//                       value={
//                         Array.isArray(order.workingHours)
//                           ? order.workingHours.join(" - ")
//                           : (order.workingHours ?? "غير محدد")
//                       }
//                     />
//                     <InfoCard label="التقييم" value={`${order.rating} ⭐`} />
//                     <InfoCard
//                       label="عدد المراجعات"
//                       value={`${order.reviewCount ?? 0}`}
//                     />
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
//                     الفئة
//                   </h2>
//                   <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-white/5">
//                     <p className="text-gray-700 dark:text-gray-300">
//                       {order.category
//                         ? `${order.category?.nameAr} / ${order.category?.nameEn}`
//                         : "غير محدد"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Subcategories */}
//                 <div>
//                   <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
//                     الفئات الفرعية
//                   </h2>
//                   <div className="flex flex-wrap gap-2">
//                     {order.subcategories?.length ? (
//                       order.subcategories.map((sc) => (
//                         <span
//                           key={sc._id}
//                           className="bg-brand-500/10 text-brand-600 dark:text-brand-300 rounded-full px-3 py-1 text-xs"
//                         >
//                           {sc.nameAr} / {sc.nameEn}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="text-sm text-gray-500 dark:text-gray-400">
//                         لا يوجد
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Shop Categories */}
//                 {order && <CategoryShopCRUD orderId={order._id} />}
//               </div>
//             </div>
//           </div>

//           {/* Right column: Metadata */}
//           <div className="space-y-6">
//             <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.05]">
//               <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
//                 الوضع
//               </h3>
//               <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
//                 <span className="h-2 w-2 rounded-full bg-green-500"></span>
//                 {order.isActive ? "الحساب فعال" : "الحساب غير فعال"}
//               </div>
//             </div>
//             <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.05]">
//               <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">
//                 الإجراءات
//               </h3>
//               <div className="flex flex-wrap gap-4">
//                 {order && (
//                   <>
//                     <EditOrderButton
//                       order={order}
//                       onSuccess={async () => {
//                         try {
//                           const data = await getSingleOrder(orderId);
//                           setOrder(data);
//                         } catch {
//                           // ignore
//                         }
//                       }}
//                     />
//                     <DeleteOrderButton
//                       orderId={order._id}
//                       onSuccess={() => router.push("/orders")}
//                     />
//                     {/* Add Product for this order */}
//                     <AddProductButton
//                       orderId={order._id}
//                       onSuccess={() => {
//                         /* refresh products section if added later */
//                       }}
//                     />
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }
