"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { getDashboardOverview } from "@/lib/api/dashboard";

const metricsConfig = [
  {
    key: "totalCustomers",
    label: "العملاء",
    icon: <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />,
    badge: (
      <Badge color="success">
        <ArrowUpIcon />
        +11%
      </Badge>
    ),
  },
  {
    key: "totalVendors",
    label: "البائعون",
    icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    badge: (
      <Badge color="error">
        <ArrowDownIcon />
        -3%
      </Badge>
    ),
  },
  {
    key: "totalAgents",
    label: "إجمالي الوكلاء",
    icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    badge: (
      <Badge color="success">
        <ArrowUpIcon />
        +12%
      </Badge>
    ),
  },
];

type Metrics = {
  totalCustomers?: number;
  totalVendors?: number;
  totalAgents?: number;
  totalOrders?: number;
  totalRevenue?: number;
  [key: string]: number | undefined;
};

export const MetricsCards = () => {
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview().then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {metricsConfig.map((m) => (
        <div
          key={m.key}
          className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
            {m.icon}
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {m.label}
              </span>
              <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  (metrics[m.key]?.toLocaleString() ?? "-")
                )}
              </h4>
            </div>
            {/* {m.badge} */}
          </div>
        </div>
      ))}
    </div>
  );
};
