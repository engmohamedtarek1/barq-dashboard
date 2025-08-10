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

export function AddVendorModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    location: string;
    workingHours: string;
    profileImage: File;
    category: string;
    subcategories: string[];
  }>({
    name: "",
    mobile: "",
    location: "",
    workingHours: "",
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
    try {
      let profileImageUrl = "";

      const uploaded = await uploadImage(formData.profileImage);
      profileImageUrl = uploaded.data;

      const payload: CreateVendorPayload = {
        name: formData.name,
        mobile: formData.mobile,
        location: formData.location,
        workingHours: formData.workingHours,
        profileImage: profileImageUrl,
        category: formData.category,
        subcategories: formData.subcategories,
        role: "shop",
      };

      await createVendor(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء البائع",
        message: "تم إنشاء البائع بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في إنشاء البائع",
        message: "فشل في إنشاء البائع. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add vendor:", err);
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
                    placeholder="احمد محمد"
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    type="text"
                    placeholder="01234567890"
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <Label>الموقع</Label>
                  <Input
                    type="text"
                    placeholder="مدينة نصر"
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label>ساعات العمل</Label>
                  <Input
                    type="text"
                    placeholder="10 صباحًا - 7 مساءً"
                    onChange={(e) =>
                      handleChange("workingHours", e.target.value)
                    }
                  />
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
                        label: cat.nameEn,
                      }))}
                      placeholder="اختر الفئة"
                      onChange={(val) => handleChange("category", val)}
                      className="dark:bg-dark-900"
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
                    text: sc.nameEn,
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
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    location: string;
    workingHours: string;
    profileImage: File | string;
    category: string;
    subcategories: string[];
  }>({
    name: "",
    mobile: "",
    location: "",
    workingHours: "",
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
        // Clear subcategories when modal opens
        setSubcategories([]);
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
        workingHours: vendor.workingHours || "",
        profileImage: vendor.profileImage || "",
        category: vendor.category._id || "",
        subcategories: vendor.subcategories.map((sc) => sc._id) || [],
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
    try {
      let profileImageUrl = "";

      if (formData.profileImage instanceof File) {
        const uploaded = await uploadImage(formData.profileImage);
        profileImageUrl = uploaded.data || uploaded.url;
      } else if (typeof formData.profileImage === "string") {
        profileImageUrl = formData.profileImage;
      }

      const payload: Partial<CreateVendorPayload> = {
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

      await updateVendor(vendor._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث البائع",
        message: "تم تحديث البائع بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في تحديث البائع",
        message: "فشل في تحديث البائع. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update vendor:", err);
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
                    placeholder="احمد محمد"
                    defaultValue={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    type="text"
                    placeholder="01234567890"
                    defaultValue={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
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
                  <Input
                    type="text"
                    placeholder="10 صباحًا - 7 مساءً"
                    defaultValue={formData.workingHours}
                    onChange={(e) =>
                      handleChange("workingHours", e.target.value)
                    }
                  />
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
                        label: cat.nameEn,
                      }))}
                      placeholder="اختر الفئة"
                      defaultValue={formData.category}
                      onChange={(val) => handleChange("category", val)}
                      className="dark:bg-dark-900"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                <div className="relative">
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
                      text: sc.nameEn,
                      selected: formData.subcategories.includes(sc._id),
                    }))}
                    onChange={(values) => handleChange("subcategories", values)}
                    disabled={!formData.category || subcategories.length === 0}
                  />
                  {!formData.category && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      يرجى اختيار فئة أولاً
                    </p>
                  )}
                  {formData.category && subcategories.length === 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      لا توجد فئات فرعية لهذه الفئة
                    </p>
                  )}
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
      setToast({
        variant: "error",
        title: "خطأ في حذف البائع",
        message: "فشل في حذف البائع. يرجى المحاولة مرة أخرى",
      });
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

          <p>هل أنت متأكد أنك تريد حذف هذا البائع؟</p>

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
