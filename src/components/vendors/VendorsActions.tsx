// components/vendors/VendorsActions.tsx

"use client";

import { Vendor } from "@/types/vendor";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

export default function VendorsActions({ vendor }: { vendor: Vendor }) {
  const handleEdit = () => {
    console.log("Edit vendor", vendor);
  };

  const handleDelete = () => {
    console.log("Delete vendor", vendor._id);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleEdit}
        className="text-sm text-blue-500 hover:underline"
      >
        <FaPencilAlt />
      </button>
      <button
        onClick={handleDelete}
        className="text-sm text-red-500 hover:underline"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
}
