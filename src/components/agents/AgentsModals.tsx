// components/agents/AddAgentModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useModal } from "@/hooks/useModal";
import { createAgent, deleteAgent, updateAgent } from "@/lib/api/agents";
import { CreateAgentPayload, Agent } from "@/types/agent";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Alert, { AlertProps } from "@/components/ui/alert/Alert";
import { AxiosError } from "axios";
import Switch from "../form/switch/Switch";

export function AddAgentModal({
  isOpen = false,
  closeModal = () => {},
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    commissionRate: number;
  }>({
    name: "",
    mobile: "",
    commissionRate: 0,
  });

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
          message: "اسم عامل التوصيل مطلوب.",
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

      const payloadRaw: CreateAgentPayload = {
        name: formData.name,
        mobile: formData.mobile,
        role: "delivery-agent",
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as CreateAgentPayload;

      await createAgent(payload);
      setToast({
        variant: "success",
        title: "نجح إنشاء عامل التوصيل",
        message: "تم إنشاء عامل التوصيل بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      setFormData({
        name: "",
        mobile: "",
        commissionRate: 0,
      });
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في إنشاء عامل التوصيل",
          message:
            err.response?.data?.message ||
            "فشل في إنشاء عامل التوصيل. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to add agent:", err);
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
                إضافة عامل توصيل
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Name */}
                <div>
                  <Label>
                    الاسم <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="اسم عامل التوصيل"
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

export function AddAgentButton({ onSuccess }: { onSuccess?: () => void }) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleAfterCreate = async () => {
    onSuccess?.(); // call parent's refetch
    closeModal();
  };

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + إضافة عامل توصيل
      </Button>
      <AddAgentModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSuccess={handleAfterCreate}
      />
    </>
  );
}

export function EditAgentModal({
  isOpen = false,
  closeModal = () => {},
  agent = {} as Agent,
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    rating: number;
    reviewCount: number;
    role: "delivery-agent";
    isActive: boolean;
    commissionRate: number;
  }>({
    name: "",
    mobile: "",
    rating: 0,
    reviewCount: 0,
    role: "delivery-agent",
    isActive: true,
    commissionRate: 0,
  });

  // Fill formData with agent data when modal opens or agent changes
  useEffect(() => {
    if (agent && isOpen) {
      setFormData({
        name: agent.name || "",
        mobile: agent.mobile || "",
        rating: agent.rating || 0,
        reviewCount: agent.reviewCount || 0,
        isActive: agent.isActive || true,
        role: "delivery-agent",
        commissionRate: agent.commissionRate || 0,
      });
    }
  }, [agent, isOpen]);

  const handleChange = (
    field: string,
    value: string | string[] | File | boolean | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const payloadRaw: Partial<CreateAgentPayload> = {
        name: formData.name,
        mobile: formData.mobile,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        isActive: formData.isActive,
        commissionRate: formData.commissionRate,
        role: "delivery-agent",
      };
      // Remove empty-string fields
      const payload = Object.fromEntries(
        Object.entries(payloadRaw).filter((entry) => {
          const v = entry[1] as unknown;
          return typeof v === "string" ? v.trim() !== "" : true;
        }),
      ) as Partial<CreateAgentPayload>;

      await updateAgent(agent._id, payload);
      setToast({
        variant: "success",
        title: "نجح تحديث عامل التوصيل",
        message: "تم تحديث عامل التوصيل بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في تحديث عامل التوصيل",
          message:
            err.response?.data?.message ||
            "فشل في تحديث عامل التوصيل. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to update agent:", err);
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
                تعديل عامل التوصيل
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>الاسم</Label>
                  <Input
                    type="text"
                    placeholder="اسم عامل التوصيل"
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
                  <Label>التقييم</Label>
                  <Input
                    type="number"
                    placeholder="4.5"
                    defaultValue={formData.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>عدد المراجعات</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    defaultValue={formData.reviewCount}
                    onChange={(e) =>
                      handleChange("reviewCount", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>معدل العمولة</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    defaultValue={formData.commissionRate}
                    onChange={(e) =>
                      handleChange("commissionRate", e.target.value)
                    }
                    required
                  />
                </div>
                {/* Active */}
                <div>
                  <Label>
                    نشط <span className="text-error-500">*</span>
                  </Label>
                  <Switch
                    label=""
                    defaultChecked={agent.isActive}
                    onChange={() => handleChange("isActive", !agent.isActive)}
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

export function EditAgentButton({
  agent,
  onSuccess,
}: {
  agent: Agent;
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
      <EditAgentModal
        isOpen={isOpen}
        closeModal={closeModal}
        agent={agent}
        onSuccess={handleAfterEdit}
      />
    </>
  );
}

export function DeleteAgentModal({
  isOpen = false,
  closeModal = () => {},
  agentId = "",
  onSuccess = () => {},
}) {
  const [toast, setToast] = useState<AlertProps | null>(null);
  const handleDelete = async () => {
    try {
      await deleteAgent(agentId);
      setToast({
        variant: "success",
        title: "نجح حذف عامل التوصيل",
        message: "تم حذف عامل التوصيل بنجاح",
      });
      setTimeout(() => setToast(null), 5000);
      onSuccess?.();
      closeModal();
    } catch (err) {
      if (err instanceof AxiosError) {
        setToast({
          variant: "error",
          title: "خطأ في حذف عامل التوصيل",
          message:
            err.response?.data?.message ||
            "فشل في حذف عامل التوصيل. يرجى المحاولة مرة أخرى",
        });
      } else {
        setToast({
          variant: "error",
          title: "خطأ غير متوقع",
          message: "حدث خطأ غير معروف",
        });
      }
      setTimeout(() => setToast(null), 5000);
      console.error("Failed to delete agent:", err);
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
            حذف عامل التوصيل
          </h4>

          <p className="text-gray-800 dark:text-white/90">
            هل أنت متأكد أنك تريد حذف هذا عامل التوصيل؟
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

export function DeleteAgentButton({
  agentId,
  onSuccess,
}: {
  agentId: string;
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
      <DeleteAgentModal
        isOpen={isOpen}
        closeModal={closeModal}
        agentId={agentId}
        onSuccess={handleAfterDelete}
      />
    </>
  );
}
