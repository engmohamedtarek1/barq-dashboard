// components/offers/AddOfferModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { ChevronDownIcon } from "../../../public/icons";
import Select from "../form/Select";
import { useModal } from "@/hooks/useModal";
import { createOffer, deleteOffer, updateOffer } from "@/lib/api/offers";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateOfferPayload, Offer } from "@/types/offer";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";
import { AxiosError } from "axios";
import { Product } from "@/types/product";
// Removed vendor imports for Edit modal auto-fill logic
import { fetchProducts } from "@/lib/api/products";
import DatePicker from "../form/date-picker";

export function AddOfferModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendor, setVendor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    product: string;
    image: File;
    description: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    shopId: string;
  }>({
    name: "",
    product: "",
    image: new File([], ""), // Initialize with an empty file
    description: "",
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
    shopId: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const { data: products } = await fetchProducts(1, 1000);
        setProducts(products);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Fetch shop when product changes
  useEffect(() => {
    if (!formData.product) {
      setVendor("");
      setFormData((prev) => ({ ...prev, shopId: "" }));
      return;
    }
    const prod = products.find((p) => p._id === formData.product);
    if (prod) {
      const shopName = prod.shopId?.name || "";
      const shopId = prod.shopId?._id || "";
      setVendor(shopName);
      setFormData((prev) => ({ ...prev, shopId }));
    } else {
      setVendor("");
      setFormData((prev) => ({ ...prev, shopId: "" }));
    }
  }, [formData.product, formData.shopId, products]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(field, value);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Validation for required fields
      if (!formData.name) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم العرض مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.product) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم المنتج مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.shopId) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "اسم المتجر مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.description) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "وصف العرض مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.discount) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "نسبة الخصم مطلوبة.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.startDate) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "تاريخ البدء مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }
      if (!formData.endDate) {
        setToast({
          variant: "error",
          title: "حقل مطلوب",
          message: "تاريخ الانتهاء مطلوب.",
        });
        setTimeout(() => setToast(null), 5000);
        return;
      }

      let imageUrl = "";
      if (formData.image instanceof File && formData.image.size > 0) {
        const uploaded = await uploadImage(formData.image);
        imageUrl = uploaded.data;
      }

      const payloadRaw: CreateOfferPayload = {
        name: formData.name,
        product: formData.product,
        image: imageUrl,
        description: formData.description,
        discount: formData.discount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        shopId: formData.shopId,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as CreateOfferPayload;

      await createOffer(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء العرض",
        message: "تم إنشاء العرض بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      setFormData({
        name: "",
        product: "",
        image: new File([], ""), // Initialize with an empty file
        description: "",
        discount: 0,
        startDate: new Date(),
        endDate: new Date(),
        shopId: "",
      });
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في إنشاء العرض",
          message:
            err.response?.data?.message ||
            "فشل في إنشاء العرض. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add offer:", err);
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
                معلومات العرض
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Offer Image */}
                <div className="lg:col-span-2">
                  <Label>صورة العرض</Label>
                  <FileInput
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files?.[0])}
                  />
                </div>

                {/* Name */}
                <div>
                  <Label>
                    الاسم <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="اسم العرض"
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Product */}
                <div>
                  <Label>
                    المنتج <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Select
                      options={products.map((prod) => ({
                        value: prod._id,
                        label: prod.nameAr,
                      }))}
                      placeholder="اختر المنتج"
                      onChange={(val) => handleChange("product", val)}
                      required
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                {/* Vendor (auto-filled) */}
                <div>
                  <Label>
                    المتجر <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={vendor}
                    placeholder={!vendor ? "يرجى اختيار منتج أولاً" : ""}
                    disabled
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>
                    الوصف <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="وصف العرض"
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Discount */}
                <div>
                  <Label>
                    الخصم <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="10"
                    defaultValue={formData.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <Label>
                    تاريخ البدء <span className="text-error-500">*</span>
                  </Label>
                  <DatePicker
                    id="start-date-picker"
                    placeholder="تاريخ البدء"
                    minDate="now"
                    onChange={(dates, currentDateString) => {
                      handleChange("startDate", currentDateString);
                    }}
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label>
                    تاريخ الانتهاء <span className="text-error-500">*</span>
                  </Label>
                  <DatePicker
                    id="end-date-picker"
                    placeholder="تاريخ الانتهاء"
                    minDate={formData.startDate || "now"}
                    onChange={(dates, currentDateString) => {
                      handleChange("endDate", currentDateString);
                    }}
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

export function AddOfferButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterCreate = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + إضافة عرض
      </Button>
      <AddOfferModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditOfferModal({
  isOpen = false,
  closeModal = () => {},
  offer = {} as Offer,
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  // const [products, setProducts] = useState<Product[]>([]);
  // const [vendorName, setVendorName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    // product: string;
    image: string | File;
    description: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    // shopId: string;
  }>({
    name: "",
    // product: "",
    image: "",
    description: "",
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
    // shopId: "",
  });

  // useEffect(() => {
  //   if (!isOpen) return;

  //   const fetchData = async () => {
  //     try {
  //       const { data: products } = await fetchProducts(1, 1000);
  //       setProducts(products);
  //     } catch (err) {
  //       console.error("Failed to fetch data:", err);
  //     }
  //   };

  //   fetchData();
  // }, [isOpen]);

  // Fill formData with offer data when modal opens or offer changes
  useEffect(() => {
    if (offer && isOpen) {
      setFormData({
        name: offer.name || "",
        // product: offer.product._id || "",
        image: offer.image, // Initialize with an empty file
        description: offer.description || "",
        discount: offer.discount || 0,
        startDate: offer.startDate || new Date(),
        endDate: offer.endDate || new Date(),
        // shopId: offer.shopId._id || "",
      });
      // setVendorName(offer.shopId?.name || "");
    }
  }, [offer, isOpen]);

  // Derive vendor/shop automatically when product changes (and when products list arrives)
  // useEffect(() => {
  //   if (!formData.product) {
  //     setVendorName("");
  //     setFormData((prev) => ({ ...prev, shopId: "" }));
  //     return;
  //   }
  //   const prod = products.find((p) => p._id === formData.product);
  //   if (prod) {
  //     const name = prod.shopId?.name || "";
  //     const id = prod.shopId?._id || "";
  //     setVendorName(name);
  //     if (id && id !== formData.shopId) {
  //       setFormData((prev) => ({ ...prev, shopId: id }));
  //     }
  //   } else {
  //     setVendorName("");
  //     setFormData((prev) => ({ ...prev, shopId: "" }));
  //   }
  // }, [formData.product, formData.shopId, products]);

  const handleChange = (
    field: string,
    value: string | string[] | File | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let imageUrl = "";

      if (formData.image instanceof File) {
        const uploaded = await uploadImage(formData.image);
        imageUrl = uploaded.data || uploaded.url;
      } else if (typeof formData.image === "string") {
        imageUrl = formData.image;
      }

      const payloadRaw: Partial<CreateOfferPayload> = {
        name: formData.name,
        // product: formData.product,
        image: imageUrl,
        description: formData.description,
        discount: formData.discount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        // shopId: formData.shopId,
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as Partial<CreateOfferPayload>;

      await updateOffer(offer._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث العرض",
        message: "تم تحديث العرض بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في تحديث العرض",
          message:
            err.response?.data?.message ||
            "فشل في تحديث العرض. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update offer:", err);
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
                معلومات العرض
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Image */}
                <div className="lg:col-span-2">
                  <Label>صورة العرض</Label>
                  {typeof formData.image === "string" && formData.image && (
                    <Image
                      src={formData.image}
                      width={160}
                      height={160}
                      alt="Current Offer Image"
                      className="mb-4 justify-self-center"
                    />
                  )}
                  <FileInput
                    accept="image/*"
                    onChange={(e) => handleChange("image", e.target.files?.[0])}
                  />
                </div>

                {/* Name */}
                <div>
                  <Label>الاسم</Label>
                  <Input
                    type="text"
                    placeholder="اسم العرض"
                    defaultValue={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                {/* Product */}
                {/* <div>
                  <Label>المنتج</Label>
                  <div className="relative">
                    <Select
                      options={products.map((prod) => ({
                        value: prod._id,
                        label: prod.nameAr,
                      }))}
                      defaultValue={formData.product}
                      placeholder="اختر المنتج"
                      onChange={(val) => handleChange("product", val)}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div> */}

                {/* Shop (auto-filled) */}
                {/* <div>
                  <Label>المتجر</Label>
                  <Input
                    type="text"
                    value={vendorName}
                    placeholder={!vendorName ? "يرجى اختيار منتج أولاً" : ""}
                    disabled
                  />
                </div> */}

                {/* Description */}
                <div>
                  <Label>الوصف</Label>
                  <Input
                    type="text"
                    placeholder="وصف العرض"
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    defaultValue={formData.description}
                  />
                </div>

                {/* Discount */}
                <div>
                  <Label>الخصم</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    defaultValue={formData.discount}
                    onChange={(e) => handleChange("discount", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <Label>تاريخ البدء</Label>
                  <DatePicker
                    id="edit-start-date-picker"
                    placeholder="تاريخ البدء"
                    defaultDate={formData.startDate}
                    minDate="now"
                    onChange={(dates, currentDateString) => {
                      handleChange("startDate", currentDateString);
                    }}
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label>تاريخ الانتهاء</Label>
                  <DatePicker
                    id="edit-end-date-picker"
                    placeholder="تاريخ الانتهاء"
                    defaultDate={formData.endDate}
                    minDate={formData.startDate || "now"}
                    onChange={(dates, currentDateString) => {
                      handleChange("endDate", currentDateString);
                    }}
                  />
                </div>
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

export function EditOfferButton({
  offer,
  onSuccess,
}: {
  offer: Offer;
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
      <EditOfferModal
        isOpen={isOpen}
        closeModal={closeModal}
        offer={offer}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteOfferModal({
  isOpen = false,
  closeModal = () => {},
  offerId = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteOffer(offerId);
      setToast({
        variant: "success",
        title: "نجح حذف العرض",
        message: "تم حذف العرض بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في حذف العرض",
          message:
            err.response?.data?.message ||
            "فشل في حذف العرض. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to delete offer:", err);
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
            حذف العرض
          </h4>

          <p className="text-gray-800 dark:text-white/90">
            هل أنت متأكد أنك تريد حذف هذا العرض؟
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

export function DeleteOfferButton({
  offerId,
  onSuccess,
}: {
  offerId: string;
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
      <DeleteOfferModal
        isOpen={isOpen}
        closeModal={closeModal}
        offerId={offerId}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
