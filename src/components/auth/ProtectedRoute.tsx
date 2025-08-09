"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAdminData } from "@/lib/api/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated();
        const adminData = getAdminData();

        if (!authenticated || !adminData) {
          // Redirect to signin if not authenticated
          router.push("/signin");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/signin");
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            جاري التحقق من الصلاحيات...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
