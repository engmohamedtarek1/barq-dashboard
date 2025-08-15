"use client";

import { useEffect, useState } from "react";
import { Categoryshop, CreateCategoryshopPayload } from "@/types/categoryshop";
import {
  fetchCategoryshopsByVendor,
  createCategoryshop,
  updateCategoryshop,
  deleteCategoryshop,
} from "@/lib/api/categoryshop";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

export default function CategoryShopCRUD({ vendorId }: { vendorId: string }) {
  const [categoryshops, setCategoryshops] = useState<Categoryshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<AlertProps | null>(null);

  // Modal states
  const {
    isOpen: isAddOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  // Form states
  const [form, setForm] = useState<CreateCategoryshopPayload>({
    nameAr: "",
    nameEn: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateCategoryshopPayload>({
    nameAr: "",
    nameEn: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    fetchCategoryshopsByVendor(vendorId)
      .then((res) => setCategoryshops(res.data))
      .catch(() => setError("فشل تحميل الفئات لهذا البائع"))
      .finally(() => setLoading(false));
  }, [vendorId]);

  // Refetch helper to keep data up-to-date after CRUD
  const refetchCategoryshops = async () => {
    try {
      const res = await fetchCategoryshopsByVendor(vendorId);
      setCategoryshops(res.data);
    } catch {
      // ignore for now; initial load handles error state
    }
  };

  const handleChange = (
    field: keyof CreateCategoryshopPayload,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditChange = (
    field: keyof CreateCategoryshopPayload,
    value: string,
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      // Validation for required fields
      if (!form.nameEn || typeof form.nameEn !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم البائع (بالعربية) مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!form.nameAr || typeof form.nameAr !== "string") {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم البائع (بالإنجليزية) مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      await createCategoryshop({ ...form, shop: vendorId });
      setToast({
        variant: "success",
        title: "تم إضافة الفئة",
        message: "تمت إضافة الفئة بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      setForm({ nameAr: "", nameEn: "" });
      closeAddModal();
      await refetchCategoryshops();
    } catch {
      setToast({
        variant: "error",
        title: "خطأ في الإضافة",
        message: "فشل إضافة الفئة للبائع",
      });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleEdit = (cat: Categoryshop) => {
    setEditId(cat._id);
    setEditForm({ nameAr: cat.nameAr, nameEn: cat.nameEn });
    openEditModal();
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      const payloadRaw: Partial<CreateCategoryshopPayload> = {
        nameAr: editForm.nameAr,
        nameEn: editForm.nameEn,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as Partial<CreateCategoryshopPayload>;

      await updateCategoryshop(editId, { ...payload });
      setToast({
        variant: "success",
        title: "تم تعديل الفئة",
        message: "تم تعديل الفئة بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      setEditId(null);
      setEditForm({ nameAr: "", nameEn: "" });
      closeEditModal();
      await refetchCategoryshops();
    } catch {
      setToast({
        variant: "error",
        title: "خطأ في التعديل",
        message: "فشل تعديل الفئة للبائع",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategoryshop(deleteId);
      setToast({
        variant: "success",
        title: "تم حذف الفئة",
        message: "تم حذف الفئة بنجاح",
      });
      setDeleteId(null);
      closeDeleteModal();
      await refetchCategoryshops();
    } catch {
      setToast({
        variant: "error",
        title: "خطأ في الحذف",
        message: "فشل حذف الفئة للبائع",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-1 text-lg font-medium text-gray-800 dark:text-white/90">
          فئات البائع
        </h2>
        <Button size="xs" variant="primary" onClick={openAddModal}>
          + أضف فئة متجر
        </Button>
      </div>
      {error && <div className="text-error-500 mb-2">{error}</div>}
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2">
            {categoryshops.map((cat) => (
              <li
                key={cat._id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/[0.05]"
              >
                <span className="font-medium text-gray-700 dark:text-white/80">
                  {cat.nameAr} / {cat.nameEn}
                </span>
                <span className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                    title="تعديل"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(cat._id);
                      openDeleteModal();
                    }}
                    className="flex items-center gap-1 text-sm text-red-500 hover:underline"
                    title="حذف"
                  >
                    <FaTrashAlt />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        className="z-50 m-4 max-w-[500px] bg-black"
      >
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-8 dark:bg-gray-900">
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
              إضافة فئة متجر
            </h5>
            <div className="grid grid-cols-1 gap-y-5">
              <div>
                <Label>
                  الاسم (بالعربية) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="اسم الفئة بالعربية"
                  value={form.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>
                  الاسم (بالإنجليزية) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="اسم الفئة بالإنجليزية"
                  value={form.nameEn}
                  onChange={(e) => handleChange("nameEn", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeAddModal}>
                إغلاق
              </Button>
              <Button size="sm" onClick={handleCreate}>
                إضافة
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        className="z-50 m-4 max-w-[500px] bg-black"
      >
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-8 dark:bg-gray-900">
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
              تعديل فئة متجر
            </h5>
            <div className="grid grid-cols-1 gap-y-5">
              <div>
                <Label>الاسم (بالعربية)</Label>
                <Input
                  type="text"
                  placeholder="اسم الفئة بالعربية"
                  value={editForm.nameAr}
                  onChange={(e) => handleEditChange("nameAr", e.target.value)}
                />
              </div>
              <div>
                <Label>الاسم (بالإنجليزية)</Label>
                <Input
                  type="text"
                  placeholder="اسم الفئة بالإنجليزية"
                  value={editForm.nameEn}
                  onChange={(e) => handleEditChange("nameEn", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal}>
                إغلاق
              </Button>
              <Button size="sm" onClick={handleUpdate}>
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

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        className="z-50 m-4 max-w-[400px] bg-black"
      >
        <div className="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-8 dark:bg-gray-900">
          <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <h4 className="mb-5 px-2 pb-3 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
              حذف الفئة
            </h4>
            <p>هل أنت متأكد من حذف هذه الفئة؟</p>
            <div className="mt-6 flex items-center gap-3 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeDeleteModal}>
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

      {/* Toast for non-modal actions */}
      {toast && !isAddOpen && !isEditOpen && !isDeleteOpen && (
        <div className="fixed end-4 bottom-4 z-[9999] max-w-sm">
          <Alert {...toast} />
        </div>
      )}
    </div>
  );
}
