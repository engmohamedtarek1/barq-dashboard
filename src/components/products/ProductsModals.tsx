"use client";

import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import FileInput from "../form/input/FileInput";
import { ChevronDownIcon } from "@/icons";
import Select from "../form/Select";

interface AddProductModalProps {
  isOpen?: boolean;
  closeModal?: () => void;
}

function AddProductModal({
  isOpen = false,
  closeModal = () => {},
}: AddProductModalProps) {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="z-50 m-4 max-w-[700px] bg-black"
    >
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Product Details
          </h4>
          <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
            Update the product details to keep the information up-to-date.
          </p>
        </div>
        <form className="flex flex-col">
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                Product Details
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Product Image */}
                <div className="lg:col-span-2">
                  <Label>Product Image</Label>
                  <FileInput accept="image/*" />
                </div>

                {/* Name (in Arabic) */}
                <div>
                  <Label>Name (in Arabic)</Label>
                  <Input type="text" placeholder="محمد طارق" />
                </div>

                {/* Name (in English) */}
                <div>
                  <Label>Name (in English)</Label>
                  <Input type="text" placeholder="Mohamed Tarek" />
                </div>

                {/* Price */}
                <div>
                  <Label>Price</Label>
                  <Input type="number" placeholder="100" />
                </div>

                {/* Amount */}
                <div>
                  <Label>Amount</Label>
                  <Input type="number" placeholder="10" />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    placeholder="Premium Arabic coffee beans freshly roasted"
                  />
                </div>

                {/* Category */}
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

                {/* Shop */}
                <div>
                  <Label>Shop</Label>
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

                {/* Rating */}
                <div>
                  <Label>Rating</Label>
                  <Input type="number" placeholder="5" />
                </div>

                {/* Sold Times */}
                <div>
                  <Label>Sold Times</Label>
                  <Input type="number" placeholder="150" />
                </div>

                {/* Review Count */}
                <div>
                  <Label>Review Count</Label>
                  <Input type="number" placeholder="50" />
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

function AddProductButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button size="md" variant="primary" onClick={openModal}>
        + Add Product
      </Button>
      <AddProductModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}

export { AddProductModal, AddProductButton };
