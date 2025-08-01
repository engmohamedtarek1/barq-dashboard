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
import { fetchSubcategories } from "@/lib/api/subcategory";
import { createVendor } from "@/lib/api/vendors";
import { uploadImage } from "@/lib/api/uploadImage";
import { CreateVendorPayload } from "@/types/vendor";

interface AddVendorModalProps {
  isOpen?: boolean;
  closeModal?: () => void;
}

function AddVendorModal({
  isOpen = false,
  closeModal = () => {},
}: AddVendorModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    location: string;
    workingHours: string;
    profileImage: string | File;
    category: string;
    subcategories: string[];
  }>({
    name: "",
    mobile: "",
    location: "",
    workingHours: "",
    profileImage: "",
    category: "",
    subcategories: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: subcats, categories } = await fetchSubcategories();
        setSubcategories(subcats);
        setCategories(categories);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

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
        profileImageUrl = uploaded.url;
      } else if (typeof formData.profileImage === "string") {
        profileImageUrl = formData.profileImage;
      }

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
      closeModal();
    } catch (err) {
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
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                Vendor Information
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <Label>Profile Image</Label>
                  <FileInput
                    accept="image/*"
                    onChange={(e) =>
                      handleChange("profileImage", e.target.files?.[0])
                    }
                  />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Vendor Name"
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    placeholder="01234567890"
                    onChange={(e) => handleChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    placeholder="Vendor Address"
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Working Hours</Label>
                  <Input
                    type="text"
                    placeholder="10 AM - 7 PM"
                    onChange={(e) =>
                      handleChange("workingHours", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Active</Label>
                  <Switch label="" defaultChecked={true} />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                Vendor Shop Details
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <div className="relative">
                    <Select
                      options={categories.map((cat) => ({
                        value: cat._id,
                        label: cat.nameEn,
                      }))}
                      placeholder="Select Category"
                      onChange={(val) => handleChange("category", val)}
                      className="dark:bg-dark-900"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <MultiSelect
                    label="Subcategories"
                    options={subcategories.map((sc) => ({
                      value: sc._id,
                      text: sc.nameEn,
                      selected: formData.subcategories.includes(sc._id),
                    }))}
                    onChange={(values) => handleChange("subcategories", values)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function AddVendorButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + Add Vendor
      </Button>
      <AddVendorModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}

export { AddVendorModal, AddVendorButton };
