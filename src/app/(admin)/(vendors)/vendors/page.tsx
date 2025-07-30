import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import VendorsTable from "@/components/vendors/VendorsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vendors | Barq",
  description: "This is the Vendors page where you can manage vendor data.",
  // other metadata
};

export default function Vendors() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Vendors" />

      <div className="space-y-6">
        <div
          className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
        >
          {/* Card Header */}
          <div className="px-6 py-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              {/* Search Input */}
              <form className="relative w-full sm:max-w-sm">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search for vendors..."
                  className="h-11 w-full rounded-lg border border-gray-500 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                />
              </form>

              {/* Add Vendor Button */}
              <Button size="md" variant="primary">
                + Add Vendor
              </Button>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-6 border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800">
            <VendorsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
