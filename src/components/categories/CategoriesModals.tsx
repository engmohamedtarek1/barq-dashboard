"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateCategoryPayload, Category } from "@/types/category";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/api/categories";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";

export function AddCategoryModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [formData, setFormData] = useState<{
    nameAr: string;
    nameEn: string;
    image: File;
  }>({
    nameAr: "",
    nameEn: "",
    image: new File([], ""),
  });

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

      let imageUrl = "";
      if (formData.image instanceof File && formData.image.size > 0) {
        const uploaded = await uploadImage(formData.image);
        imageUrl = uploaded.data;
      }

      const payloadRaw: CreateCategoryPayload = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        image: imageUrl,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as CreateCategoryPayload;

      await createCategory(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء الفئة",
        message: "تم إنشاء الفئة بنجاح",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في إنشاء الفئة",
        message: "فشل في إنشاء الفئة. يرجى المحاولة مرة أخرى",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      console.error("Failed to add category:", err);
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
                تفاصيل الفئة
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Category Image */}
                <div className="lg:col-span-2">
                  <Label>صورة الفئة</Label>
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
                    placeholder="مأكولات بحرية"
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
                    placeholder="Sea Food"
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                    required
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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed end-4 bottom-4 max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function AddCategoryButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterCreate = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + أضف فئة
      </Button>
      <AddCategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditCategoryModal({
  isOpen = false,
  closeModal = () => {},
  category = {} as Category,
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [formData, setFormData] = useState<{
    nameAr: string;
    nameEn: string;
    image: string | File;
  }>({
    nameAr: "",
    nameEn: "",
    image: new File([], ""),
  });

  // Fill formData with category data when modal opens or category changes
  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        nameAr: category.nameAr || "",
        nameEn: category.nameEn || "",
        image: "",
      });
    }
  }, [category, isOpen]);

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

      const payload: Partial<CreateCategoryPayload> = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        image: imageUrl,
      };

      await updateCategory(category._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث الفئة",
        message: "تم تحديث الفئة بنجاح",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في تحديث الفئة",
        message: "فشل في تحديث الفئة. يرجى المحاولة مرة أخرى",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      console.error("Failed to update category:", err);
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
                تفاصيل الفئة
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Category Image */}
                <div className="lg:col-span-2">
                  <Label>صورة الفئة</Label>
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
                    placeholder="مأكولات بحرية"
                    defaultValue={formData.nameAr}
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                  />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>الاسم (بالإنجليزية)</Label>
                  <Input
                    type="text"
                    placeholder="Sea Food"
                    defaultValue={formData.nameEn}
                    onChange={(e) => handleChange("nameEn", e.target.value)}
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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function EditCategoryButton({
  category,
  onSuccess,
}: {
  category: Category;
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
      <EditCategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        category={category}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteCategoryModal({
  isOpen = false,
  closeModal = () => {},
  category = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteCategory(category);
      setToast({
        variant: "success",
        title: "نجح حذف الفئة",
        message: "تم حذف الفئة بنجاح",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في حذف الفئة",
        message: "فشل في حذف الفئة. يرجى المحاولة مرة أخرى",
      });

      // Auto hide toast after 5 seconds
      setTimeout(() => setToast(null), 5000);

      console.error("Failed to delete category:", err);
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
            حذف الفئة
          </h4>

          <p>هل أنت متأكد من حذف هذا الفئة؟</p>

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
      {/* Toast Notification */}
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function DeleteCategoryButton({
  category,
  onSuccess,
}: {
  category: string;
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
      <DeleteCategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        category={category}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
