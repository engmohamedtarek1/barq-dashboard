"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateSubcategoryPayload, Subcategory } from "@/types/subcategory";

import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import { createSubcategory, deleteSubcategory, updateSubcategory } from "@/lib/api/subcategories";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";

export function AddSubcategoryModal({
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
      let imageUrl = "";

      const uploaded = await uploadImage(formData.image);
      imageUrl = uploaded.data;

      const payload: CreateSubcategoryPayload = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        image: imageUrl,
      };

      await createSubcategory(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء الفئة الفرعية",
        message: "تم إنشاء الفئة الفرعية بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في إنشاء الفئة الفرعية",
        message: "فشل في إنشاء الفئة الفرعية. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add subcategory:", err);
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
                {/* Subcategory Image */}
                <div className="lg:col-span-2">
                  <Label>صورة الفئة</Label>
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
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                  />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>الاسم (بالإنجليزية)</Label>
                  <Input
                    type="text"
                    placeholder="Sea Food"
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
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function AddSubcategoryButton({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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
      <AddSubcategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditSubcategoryModal({
  isOpen = false,
  closeModal = () => {},
  subcategory = {} as Subcategory,
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

  // Fill formData with subcategory data when modal opens or subcategory changes
  useEffect(() => {
    if (subcategory && isOpen) {
      setFormData({
        nameAr: subcategory.nameAr || "",
        nameEn: subcategory.nameEn || "",
        image: "",
      });
    }
  }, [subcategory, isOpen]);

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

      const payload: Partial<CreateSubcategoryPayload> = {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        image: imageUrl,
      };

      await updateSubcategory(subcategory._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث الفئة الفرعية",
        message: "تم تحديث الفئة الفرعية بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في تحديث الفئة الفرعية",
        message: "فشل في تحديث الفئة الفرعية. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update subcategory:", err);
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
                {/* Subcategory Image */}
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
                    placeholder="محمد طارق"
                    defaultValue={formData.nameAr}
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                  />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>الاسم (بالإنجليزية)</Label>
                  <Input
                    type="text"
                    placeholder="Mohamed Tarek"
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
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function EditSubcategoryButton({
  subcategory,
  onSuccess,
}: {
  subcategory: Subcategory;
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
      <EditSubcategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        subcategory={subcategory}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteSubcategoryModal({
  isOpen = false,
  closeModal = () => {},
  categoryId = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteSubcategory(categoryId);
      setToast({
        variant: "success",
        title: "نجح حذف الفئة الفرعية",
        message: "تم حذف الفئة الفرعية بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      setToast({
        variant: "error",
        title: "خطأ في حذف الفئة الفرعية",
        message: "فشل في حذف الفئة الفرعية. يرجى المحاولة مرة أخرى",
      });
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to delete subcategory:", err);
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
      {toast && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </Modal>
  );
}

export function DeleteSubcategoryButton({
  categoryId,
  onSuccess,
}: {
  categoryId: string;
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
      <DeleteSubcategoryModal
        isOpen={isOpen}
        closeModal={closeModal}
        categoryId={categoryId}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
