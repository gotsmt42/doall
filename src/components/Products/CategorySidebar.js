// src/components/CategorySidebar.jsx
import React from "react";

const categories = [
  "ระบบไฟฟ้า",
  "ระบบประปา",
  "ระบบสื่อสาร",
  "ระบบความปลอดภัย",
  "ระบบกล้อง CCTV",
  "ระบบดับเพลิง",
];

const CategorySidebar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <aside className="w-full sm:w-64 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        🗂️ หมวดหมู่สินค้าและบริการ
      </h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-4 py-2 rounded transition-all font-medium
                ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700"
                }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;
