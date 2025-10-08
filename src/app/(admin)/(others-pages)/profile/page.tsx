import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserPasswordCard from "@/components/user-profile/UserPasswordCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "الملف الشخصي | برق",
  description: "هذه هي صفحة الملف الشخصي حيث يمكنك إدارة معلوماتك الشخصية.",
};

export default function Profile() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          الملف الشخصي
        </h3>
        <div className="space-y-6">
          <UserInfoCard />
          <UserPasswordCard />
        </div>
      </div>
    </div>
  );
}
