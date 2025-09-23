"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import { getDashboardOverview } from "@/lib/api/dashboard";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  interface Overview {
    totalCustomers: number;
    totalVendors: number;
    totalAgents: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    processingOrders: number;
    shippedOrders: number;
  }

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview().then((data) => {
      setOverview(data);
      setLoading(false);
    });
  }, []);

  // Calculate progress percentage (e.g., completedOrders / totalOrders)
  const progress =
    overview && overview.totalOrders
      ? ((overview.completedOrders / overview.totalOrders) * 100).toFixed(2)
      : 0;
  const series = [Number(progress)];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Cairo, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        الهدف الشهري
      </h3>
      <p className="text-theme-sm mt-1 font-normal text-gray-500 dark:text-gray-400">
        الهدف التي وضعته كل شهر
      </p>

      <div className="relative">
        <div className="max-h-[330px]">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              جاري التحميل...
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          )}
        </div>

        <span className="bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500 absolute start-1/2 top-full translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium">
          {overview ? `${progress}% إكمال الطلبات` : ""}
        </span>
      </div>
      {overview && (
        <div className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
            إجمالي الإيرادات:{" "}
            <span className="text-success-600 dark:text-success-500 font-bold">
              {overview.totalRevenue} ج.م
            </span>
            ، وهو أعلى إيراد تم تحقيقه. استمر في عملك الرائع!
          </p>
        </div>
      )}
    </div>
  );
}
