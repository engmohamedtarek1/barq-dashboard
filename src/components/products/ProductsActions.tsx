// components/Products/ProductsActions.tsx

"use client";

import { Product } from "@/types/product";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

export default function ProductsActions({ product }: { product: Product }) {
  const handleEdit = () => {
    console.log("Edit product", product);
  };

  const handleDelete = () => {
    console.log("Delete product", product._id);
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
