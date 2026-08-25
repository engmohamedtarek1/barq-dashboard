"use client";

import React, { useId } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import Input from "../form/input/InputField";
import Radio from "../form/input/Radio";
import { ProductSize } from "@/types/product";

export interface SizesEditorProps {
  sizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
}

export default function SizesEditor({ sizes, onChange }: SizesEditorProps) {
  const groupName = useId();

  const handleAdd = () => {
    onChange([
      ...sizes,
      {
        nameAr: "",
        nameEn: "",
        price: 0,
        // First size added becomes the default automatically
        isDefault: sizes.length === 0,
      },
    ]);
  };

  const handleField = (
    idx: number,
    field: "nameAr" | "nameEn" | "price",
    value: string,
  ) => {
    const next = sizes.map((size, i) =>
      i === idx
        ? {
            ...size,
            [field]:
              field === "price"
                ? Math.max(0, parseFloat(value) || 0)
                : value,
          }
        : size,
    );
    onChange(next);
  };

  const handleSetDefault = (idx: number) => {
    // Radio-style: picking a default clears every other one
    onChange(sizes.map((size, i) => ({ ...size, isDefault: i === idx })));
  };

  const handleRemove = (idx: number) => {
    const wasDefault = sizes[idx]?.isDefault;
    const next = sizes.filter((_, i) => i !== idx);
    // Deleting the default promotes the first remaining size
    if (wasDefault && next.length > 0) {
      onChange(next.map((size, i) => ({ ...size, isDefault: i === 0 })));
      return;
    }
    onChange(next);
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h6 className="text-base font-medium text-gray-800 dark:text-white/90">
          الأحجام
        </h6>
        <button
          type="button"
          className="text-brand-blue hover:text-brand-600 flex items-center gap-1 text-sm font-medium"
          onClick={handleAdd}
        >
          <FaPlus className="h-3 w-3" />
          إضافة حجم
        </button>
      </div>

      {sizes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            الأحجام اختيارية. إذا لم تضف أي حجم، سيتم استخدام سعر المنتج
            الأساسي كما هو.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            {/* Sizes Header */}
            <div className="mb-2 grid grid-cols-[1fr_1fr_100px_auto_40px] items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span>اسم الحجم (عربي)</span>
              <span>اسم الحجم (English)</span>
              <span>سعر الحجم</span>
              <span>افتراضي</span>
              <span></span>
            </div>

            {/* Size Rows */}
            {sizes.map((size, idx) => (
              <div
                key={size._id ?? idx}
                className="mb-2 grid grid-cols-[1fr_1fr_100px_auto_40px] items-center gap-3"
              >
                <Input
                  type="text"
                  placeholder="ادخل اسم"
                  value={size.nameAr}
                  onChange={(e) => handleField(idx, "nameAr", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Enter name"
                  value={size.nameEn}
                  onChange={(e) => handleField(idx, "nameEn", e.target.value)}
                  dir="ltr"
                />
                <Input
                  type="number"
                  placeholder="0"
                  value={size.price === 0 ? "" : size.price}
                  onChange={(e) => handleField(idx, "price", e.target.value)}
                  min="0"
                />
                <div className="flex items-center justify-center">
                  <Radio
                    id={`${groupName}-size-default-${idx}`}
                    name={`${groupName}-size-default`}
                    value={String(idx)}
                    checked={size.isDefault}
                    label=""
                    onChange={() => handleSetDefault(idx)}
                  />
                </div>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(idx)}
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </div>
            ))}

            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              سعر الحجم هو سعر الوحدة الكامل لهذا الحجم. سعر الحجم الافتراضي
              هو السعر الذي يظهر للعميل على المنتج.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
