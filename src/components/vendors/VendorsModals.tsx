// components/vendors/AddVendorModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Switch from "../form/switch/Switch";
import FileInput from "../form/input/FileInput";
import { ChevronDownIcon } from "@/icons";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import { Category } from "@/types/category";
import { Subcategory } from "@/types/subcategory";
import { useModal } from "@/hooks/useModal";
import { fetchSubcategoriesByCategory } from "@/lib/api/subcategories";
import { createVendor, deleteVendor, updateVendor } from "@/lib/api/vendors";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateVendorPayload, Vendor } from "@/types/vendor";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import { fetchCategories } from "@/lib/api/categories";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";
import { AxiosError } from "axios";

export function AddVendorModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    location: string;
    workingHours: [string, string];
    profileImage: File;
    category: string;
    subcategories: string[];
  }>({
    name: "",
    mobile: "",
    location: "",
    workingHours: ["07:00", "15:00"],
    profileImage: new File([], ""), // Initialize with an empty file
    category: "",
    subcategories: [],
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const { data: categories } = await fetchCategories();
        setCategories(categories);
        // Clear subcategories when modal opens
        setSubcategories([]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!formData.category) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategoriesForCategory = async () => {
      try {
        const { data: subcategories } = await fetchSubcategoriesByCategory(
          formData.category,
        );
        setSubcategories(subcategories);
        // Reset selected subcategories when category changes
        setFormData((prev) => ({ ...prev, subcategories: [] }));
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubcategories([]);
      }
    };

    fetchSubcategoriesForCategory();
  }, [formData.category]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Validation for required fields
      if (!formData.name) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم البائع مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.mobile) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "رقم الهاتف مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.location) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الموقع مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (
        !formData.workingHours ||
        !Array.isArray(formData.workingHours) ||
        formData.workingHours.length !== 2 ||
        !formData.workingHours[0] ||
        !formData.workingHours[1]
      ) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "ساعات العمل (بداية ونهاية) مطلوبة.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.category) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "الفئة مطلوبة.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      let profileImageUrl = "";
      if (
        formData.profileImage instanceof File &&
        formData.profileImage.size > 0
      ) {
        const uploaded = await uploadImage(formData.profileImage);
        profileImageUrl = uploaded.data;
      }

      const payloadRaw: CreateVendorPayload = {
        name: formData.name,
        mobile: formData.mobile,
        location: formData.location,
        workingHours: formData.workingHours,
        profileImage: profileImageUrl,
        category: formData.category,
        subcategories: formData.subcategories,
        role: "shop",
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as CreateVendorPayload;

      await createVendor(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء البائع",
        message: "تم إنشاء البائع بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      setFormData({
        name: "",
        mobile: "",
        location: "",
        workingHours: ["07:00", "15:00"],
        profileImage: new File([], ""), // Initialize with an empty file
        category: "",
        subcategories: [],
      });
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في إنشاء البائع",
          message:
            err.response?.data?.message ||
            "فشل في إنشاء البائع. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add vendor:", err);
    } finally {
      setIsLoading(false);
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
                معلومات البائع
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Profile Image */}
                <div className="lg:col-span-2">
                  <Label>صورة الملف الشخصي</Label>
                  <FileInput
                    accept="image/*"
                    onChange={(e) =>
                      handleChange("profileImage", e.target.files?.[0])
                    }
                  />
                </div>

                {/* Name */}
                <div>
                  <Label>
                    الاسم <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="اسم البائع"
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Mobile */}
                <div>
                  <Label>
                    الهاتف <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="01234567890"
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <Label>
                    الموقع <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="مدينة نصر"
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>

                {/* Working Hours */}
                <div>
                  <Label>
                    ساعات العمل <span className="text-error-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.workingHours[0]}
                      onChange={(e) =>
                        handleChange("workingHours", [
                          e.target.value,
                          formData.workingHours[1],
                        ])
                      }
                      required
                    />

                    <span className="text-gray-500">إلى</span>
                    <Input
                      type="time"
                      value={formData.workingHours[1]}
                      onChange={(e) =>
                        handleChange("workingHours", [
                          formData.workingHours[0],
                          e.target.value,
                        ])
                      }
                      required
                    />
                  </div>
                </div>

                {/* Active */}
                <div>
                  <Label>
                    نشط <span className="text-error-500">*</span>
                  </Label>
                  <Switch label="" defaultChecked={true} />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                تفاصيل متجر البائع
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
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
                      placeholder="اختر الفئة"
                      onChange={(val) => handleChange("category", val)}
                      required
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Subcategories */}
                <MultiSelect
                  label="الفئات الفرعية"
                  placeholder={
                    !formData.category
                      ? "يرجى اختيار فئة أولاً"
                      : subcategories.length === 0
                        ? "لا توجد فئات فرعية لهذه الفئة"
                        : "اختر الفئات الفرعية"
                  }
                  options={subcategories.map((sc) => ({
                    value: sc._id,
                    text: sc.nameAr,
                    selected: formData.subcategories.includes(sc._id),
                  }))}
                  onChange={(values) => handleChange("subcategories", values)}
                  disabled={!formData.category || subcategories.length === 0}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              إغلاق
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <div className="fixed end-4 top-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function AddVendorButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterCreate = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + إضافة بائع
      </Button>
      <AddVendorModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditVendorModal({
  isOpen = false,
  closeModal = () => {},
  vendor = {} as Vendor,
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    location: string;
    workingHours: [string, string];
    profileImage: File | string;
    category: string;
    subcategories: string[];
  }>({
    name: "",
    mobile: "",
    location: "",
    workingHours: ["07:00", "15:00"],
    profileImage: "", // can be url or File
    category: "",
    subcategories: [],
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const { data: categories } = await fetchCategories();
        setCategories(categories);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Fill formData with vendor data when modal opens or vendor changes
  useEffect(() => {
    if (vendor && isOpen) {
      setFormData({
        name: vendor.name || "",
        mobile: vendor.mobile || "",
        location: vendor.location || "",
        workingHours:
          Array.isArray(vendor.workingHours) && vendor.workingHours.length === 2
            ? vendor.workingHours
            : ["07:00", "15:00"],
        profileImage: vendor.profileImage || "",
        category: vendor.category?._id || "",
        subcategories: vendor.subcategories?.map((sc) => sc._id) || [],
      });
    }
  }, [vendor, isOpen]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!formData.category) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategoriesForCategory = async () => {
      try {
        const { data: subcategories } = await fetchSubcategoriesByCategory(
          formData.category,
        );
        setSubcategories(subcategories);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubcategories([]);
      }
    };

    fetchSubcategoriesForCategory();
  }, [formData.category]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let profileImageUrl = "";

      if (formData.profileImage instanceof File) {
        const uploaded = await uploadImage(formData.profileImage);
        profileImageUrl = uploaded.data || uploaded.url;
      } else if (typeof formData.profileImage === "string") {
        profileImageUrl = formData.profileImage;
      }

      const payloadRaw: Partial<CreateVendorPayload> = {
        name: formData.name,
        mobile: formData.mobile,
        location: formData.location,
        workingHours: formData.workingHours,
        profileImage: profileImageUrl,
        category: formData.category,
        subcategories: formData.subcategories,
        role: "shop",
        isActive: true,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as Partial<CreateVendorPayload>;

      await updateVendor(vendor._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث البائع",
        message: "تم تحديث البائع بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في تحديث البائع",
          message:
            err.response?.data?.message ||
            "فشل في تحديث البائع. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update vendor:", err);
    } finally {
      setIsLoading(false);
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
                معلومات البائع
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <Label>صورة الملف الشخصي</Label>
                  {typeof formData.profileImage === "string" &&
                    formData.profileImage && (
                      <Image
                        src={formData.profileImage}
                        width={160}
                        height={160}
                        alt="Current Profile"
                        className="mb-4 justify-self-center"
                      />
                    )}
                  <FileInput
                    accept="image/*"
                    onChange={(e) =>
                      handleChange("profileImage", e.target.files?.[0])
                    }
                  />
                </div>
                <div>
                  <Label>الاسم</Label>
                  <Input
                    type="text"
                    placeholder="اسم البائع"
                    defaultValue={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    type="text"
                    placeholder="01234567890"
                    defaultValue={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>الموقع</Label>
                  <Input
                    type="text"
                    placeholder="مدينة نصر"
                    defaultValue={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label>ساعات العمل</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.workingHours[0]}
                      onChange={(e) =>
                        handleChange("workingHours", [
                          e.target.value,
                          formData.workingHours[1],
                        ])
                      }
                      required
                    />
                    <span className="text-gray-500">إلى</span>
                    <Input
                      type="time"
                      value={formData.workingHours[1]}
                      onChange={(e) =>
                        handleChange("workingHours", [
                          formData.workingHours[0],
                          e.target.value,
                        ])
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>نشط</Label>
                  <Switch label="" defaultChecked={true} />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                تفاصيل متجر البائع
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>الفئة</Label>
                  <div className="relative">
                    <Select
                      options={categories.map((cat) => ({
                        value: cat._id,
                        label: cat.nameAr,
                      }))}
                      placeholder="اختر الفئة"
                      defaultValue={formData.category}
                      onChange={(val) => handleChange("category", val)}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                <MultiSelect
                  label="الفئات الفرعية"
                  placeholder={
                    !formData.category
                      ? "يرجى اختيار فئة أولاً"
                      : subcategories.length === 0
                        ? "لا توجد فئات فرعية لهذه الفئة"
                        : "اختر الفئات الفرعية"
                  }
                  options={subcategories.map((sc) => ({
                    value: sc._id,
                    text: sc.nameAr,
                    selected: formData.subcategories.includes(sc._id),
                  }))}
                  onChange={(values) => handleChange("subcategories", values)}
                  disabled={!formData.category || subcategories.length === 0}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              إغلاق
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </div>
      {toast && (
        <div className="fixed end-4 top-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function EditVendorButton({
  vendor,
  onSuccess,
}: {
  vendor: Vendor;
  onSuccess?: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterEdit = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="text-sm text-blue-500">
        <FaPencilAlt />
      </button>
      <EditVendorModal
        isOpen={isOpen}
        closeModal={closeModal}
        vendor={vendor}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteVendorModal({
  isOpen = false,
  closeModal = () => {},
  vendorId = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteVendor(vendorId);
      setToast({
        variant: "success",
        title: "نجح حذف البائع",
        message: "تم حذف البائع بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في حذف البائع",
          message:
            err.response?.data?.message ||
            "فشل في حذف البائع. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to delete vendor:", err);
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
            حذف البائع
          </h4>

          <p className="text-gray-800 dark:text-white/90">
            هل أنت متأكد أنك تريد حذف هذا البائع؟
          </p>

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
        <div className="fixed end-4 top-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function DeleteVendorButton({
  vendorId,
  onSuccess,
}: {
  vendorId: string;
  onSuccess?: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterDelete = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <button onClick={openModal} className="text-sm text-red-500">
        <FaTrashAlt />
      </button>
      <DeleteVendorModal
        isOpen={isOpen}
        closeModal={closeModal}
        vendorId={vendorId}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
