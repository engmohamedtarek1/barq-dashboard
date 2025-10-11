import React, { FC, useRef, useState } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

const FileInput: FC<FileInputProps> = ({ className, onChange, accept }) => {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    } else {
      setSelectedFile("");
    }
    if (onChange) {
      onChange(event);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={handleFileChange}
        accept={accept}
      />
      <div className="focus:border-ring-brand-300 shadow-theme-xs flex h-11 w-full items-center overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex h-full cursor-pointer items-center rounded-l-lg border-0 border-r border-solid border-gray-200 bg-gray-50 py-3 ps-3.5 pe-3 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
        >
          اختر ملف
        </button>
        <span className="flex-1 px-3 text-gray-500 dark:text-gray-400">
          {selectedFile || "لم يتم اختيار ملف"}
        </span>
      </div>
    </div>
  );
};

export default FileInput;
