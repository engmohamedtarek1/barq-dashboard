"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Switch from "../form/switch/Switch";
import FileInput from "../form/input/FileInput";
import { ChevronDownIcon } from "@/icons";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";

interface AddVendorModalProps {
  isOpen?: boolean;
  closeModal?: () => void;
}

function AddVendorModal({
  isOpen = false,
  closeModal = () => {},
}: AddVendorModalProps) {
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "1", text: "Option 1", selected: false },
    { value: "2", text: "Option 2", selected: false },
    { value: "3", text: "Option 3", selected: false },
    { value: "4", text: "Option 4", selected: false },
    { value: "5", text: "Option 5", selected: false },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="z-50 m-4 max-w-[700px] bg-black"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Vendor Details
          </h4>
          <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
            Update the vendor details to keep the information up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                Personal Details
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label>Profile Image</Label>
                  <FileInput accept="image/*" />
                </div>

                <div>
                  <Label>Name</Label>
                  <Input type="text" placeholder="Mohamed Tarek" />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input type="text" placeholder="+20 123 456 7890" />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    placeholder="10 Ahmed Street, Nasr City, Cairo"
                  />
                </div>

                <div>
                  <Label>Working Hours</Label>
                  <Input type="text" placeholder="09:00 AM - 10:00 PM" />
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
                      options={options}
                      placeholder="Select Option"
                      onChange={handleSelectChange}
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
                    options={multiOptions}
                    onChange={(values) => setSelectedValues(values)}
                  />
                  <p className="sr-only">
                    Selected Values: {selectedValues.join(", ")}
                  </p>
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
