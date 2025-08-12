"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { ChevronDownIcon } from "@/icons";
import Select from "../form/Select";
import { Category } from "@/types/category";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateProductPayload, Product } from "@/types/product";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/api/products";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import { fetchCategories } from "@/lib/api/categories";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";
import { fetchVendors } from "@/lib/api/vendors";
import { Vendor } from "@/types/vendor";

export function AddProductModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState<{
    nameAr: string;
    nameEn: string;
    price: number;
    shopId: string;
    description: string;
    category: string;
    image: File;
  }>({
    nameAr: "",
    nameEn: "",
    price: 0,
    shopId: "",
    description: "",
    category: "",
    image: new File([], ""),
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchData = async () => {
      try {
        const { data: categories } = await fetchCategories();
        const { data: vendors } = await fetchVendors();
        setCategories(categories);
        setVendors(vendors);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Validation for required fields
      if (!formData.nameAr || typeof formData.nameAr !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الاسم (بالعربية) مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.nameEn || typeof formData.nameEn !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الاسم (بالإنجليزية) مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (formData.price < 0) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "السعر مطلوب ويجب أن يكون رقمًا أكبر أو يساوي صفر.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.description || typeof formData.description !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الوصف مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.category || typeof formData.category !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الفئة مطلوبة.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.shopId || typeof formData.shopId !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "معرف المتجر مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      let imageUrl = "";
      if (formData.image instanceof File && formData.image.size > 0) {
        const uploaded = await uploadImage(formData.image);
        imageUrl = uploaded.data;
      }

      const payloadRaw: CreateProductPayload = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        price: formData.price,
        shopId: formData.shopId,
        description: formData.description,
        category: formData.category,
        image: imageUrl,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as CreateProductPayload;

      await createProduct(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء المنتج",
        message: "تم إنشاء المنتج بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في إنشاء المنتج",
        message: "فشل في إنشاء المنتج. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add product:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="z-50 m-4 max-w-[700px] bg-black"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                إضافة منتج جديد
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Product Image */}
                <div className="lg:col-span-2">
                  <Label>صورة المنتج</Label>
                  <FileInput
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files?.[0])}
                  />
                </div>

                {/* Name (in Arabic) */}
                <div>
                  <Label>
                    الاسم (بالعربية) <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="قهوة عربية"
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                    required
                  />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>
                    الاسم (بالإنجليزية){" "}
                    <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Arabic Coffee"
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <Label>
                    السعر <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="100"
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                    min="0"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>
                    الوصف <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="قهوة عربية فاخرة محمصة طازجة"
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>
                    الفئة <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      options={categories.map((cat) => ({
                        value: cat._id,
                        label: cat.nameAr,
                      }))}
                      placeholder="اختر فئة"
                      onChange={(val) => handleChange("category", val)}
                      required
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Shop */}
                <div>
                  <Label>
                    المتجر <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      options={vendors.map((vendor) => ({
                        value: vendor._id,
                        label: vendor.name,
                      }))}
                      placeholder="اختر متجراً"
                      onChange={(val) => handleChange("shopId", val)}
                      required
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              إغلاق
            </Button>
            <Button size="sm" onClick={handleSave}>
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function AddProductButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterCreate = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + أضف منتج
      </Button>
      <AddProductModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditProductModal({
  isOpen = false,
  closeModal = () => {},
  product = {} as Product,
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [formData, setFormData] = useState<{
    nameAr: string;
    nameEn: string;
    price: number;
    amount: number;
    shopId: string;
    description: string;
    category: string;
    rating: number;
    image: string | File;
    soldTimes: number;
    reviewCount: number;
  }>({
    nameAr: "",
    nameEn: "",
    price: 0,
    amount: 0,
    shopId: "",
    description: "",
    category: "",
    image: new File([], ""),
    rating: 0,
    reviewCount: 0,
    soldTimes: 0,
  });

  useEffect(() => {
    if (!isOpen) {
      setCategoriesLoaded(false);
      return;
    }

    const fetchData = async () => {
      try {
        const { data: categories } = await fetchCategories();
        const { data: vendors } = await fetchVendors();
        setCategories(categories);
        setVendors(vendors);
        setCategoriesLoaded(true);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setCategoriesLoaded(true); // Set to true even on error to prevent infinite loading
      }
    };

    fetchData();
  }, [isOpen]);

  // Fill formData with product data when modal opens and categories are loaded
  useEffect(() => {
    if (product && isOpen && categoriesLoaded) {
      setFormData({
        nameAr: product.nameAr || "",
        nameEn: product.nameEn || "",
        price: product.price || 0,
        amount: product.amount || 0,
        shopId: product.shopId._id || "",
        description: product.description || "",
        category: product.category._id || "",
        image: product.image || "",
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        soldTimes: product.soldTimes || 0,
      });
    }
  }, [product, isOpen, categoriesLoaded]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      let imageUrl = "";

      if (formData.image instanceof File) {
        const uploaded = await uploadImage(formData.image);
        imageUrl = uploaded.data || uploaded.url;
      } else if (typeof formData.image === "string") {
        imageUrl = formData.image;
      }

      const payloadRaw: Partial<CreateProductPayload> = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        price: formData.price,
        shopId: formData.shopId,
        description: formData.description,
        category: formData.category,
        image: imageUrl,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as Partial<CreateProductPayload>;

      await updateProduct(product._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث المنتج",
        message: "تم تحديث المنتج بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في تحديث المنتج",
        message: "فشل في تحديث المنتج. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update product:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="z-50 m-4 max-w-[700px] bg-black"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                تفاصيل المنتج
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Product Image */}
                <div className="lg:col-span-2">
                  <Label>صورة المنتج</Label>
                  {typeof formData.image === "string" && formData.image && (
                    <Image
                      src={formData.image}
                      width={160}
                      height={160}
                      alt="Current Profile"
                      className="mb-4 justify-self-center"
                    />
                  )}
                  <FileInput
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files?.[0])}
                  />
                </div>

                {/* Name (in Arabic) */}
                <div>
                  <Label>الاسم (بالعربية)</Label>
                  <Input
                    type="text"
                    placeholder="قهوة عربية"
                    defaultValue={formData.nameAr}
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                  />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>الاسم (بالإنجليزية)</Label>
                  <Input
                    type="text"
                    placeholder="Arabic Coffee"
                    defaultValue={formData.nameEn}
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                  />
                </div>

                {/* Price */}
                <div>
                  <Label>السعر</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    defaultValue={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label>الكمية</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    defaultValue={formData.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>الوصف</Label>
                  <Input
                    type="text"
                    placeholder="قهوة عربية فاخرة محمصة طازجة"
                    defaultValue={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Shop */}
                <div>
                  <Label>المتجر</Label>
                  <div className="relative">
                    <Select
                      options={vendors.map((vendor) => ({
                        value: vendor._id,
                        label: vendor.name,
                      }))}
                      placeholder="اختر متجراً"
                      onChange={(val) => handleChange("shopId", val)}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label>الفئة</Label>
                  <div className="relative">
                    <Select
                      options={categories.map((cat) => ({
                        value: cat._id,
                        label: cat.nameEn,
                      }))}
                      placeholder="اختر فئة"
                      defaultValue={formData.category}
                      onChange={(val) => handleChange("category", val)}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <Label>التقييم</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    defaultValue={formData.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                  />
                </div>

                {/* Sold Times */}
                <div>
                  <Label>مرات البيع</Label>
                  <Input
                    type="number"
                    placeholder="150"
                    defaultValue={formData.soldTimes}
                    onChange={(e) => handleChange("soldTimes", e.target.value)}
                  />
                </div>

                {/* Review Count */}
                <div>
                  <Label>عدد المراجعات</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    defaultValue={formData.reviewCount}
                    onChange={(e) =>
                      handleChange("reviewCount", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              إغلاق
            </Button>
            <Button size="sm" onClick={handleSave}>
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function EditProductButton({
  product,
  onSuccess,
}: {
  product: Product;
  onSuccess?: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterEdit = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm text-blue-500 hover:underline"
      >
        <FaPencilAlt />
      </button>
      <EditProductModal
        isOpen={isOpen}
        closeModal={closeModal}
        product={product}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteProductModal({
  isOpen = false,
  closeModal = () => {},
  productId = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      setToast({
        variant: "success",
        title: "نجح حذف المنتج",
        message: "تم حذف المنتج بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في حذف المنتج",
        message: "فشل في حذف المنتج. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="z-50 m-4 max-w-[700px] bg-black"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <h4 className="mb-5 px-2 pb-3 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
            حذف المنتج
          </h4>

          <p>هل أنت متأكد من حذف هذا المنتج؟</p>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              إغلاق
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-error-500 hover:bg-error-700"
            >
              حذف
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function DeleteProductButton({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess?: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterDelete = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm text-red-500 hover:underline"
      >
        <FaTrashAlt />
      </button>
      <DeleteProductModal
        isOpen={isOpen}
        closeModal={closeModal}
        productId={productId}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
