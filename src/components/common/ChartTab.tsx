import React, { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
      <button
        onClick={() => setSelected("optionOne")}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionOne",
        )}`}
      >
        شهري
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionTwo",
        )}`}
      >
        ربع سنوي
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "optionThree",
        )}`}
      >
        سنوي
      </button>
    </div>
  );
};

export default ChartTab;
