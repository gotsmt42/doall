// src/pages/Products.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { products } from "../data/products";
import CategorySidebar from "../components/Products/CategorySidebar";
import { Link } from "react-router-dom";

import { Bars3Icon, Squares2X2Icon } from "@heroicons/react/24/outline";

const Products = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredProducts = selectedCategory
    ? products.filter((item) => item.category === selectedCategory)
    : products;

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>สินค้าและบริการ | Do All Architect And Engineering</title>
        <meta
          name="description"
          content="สำรวจผลิตภัณฑ์และบริการของเราอย่างมืออาชีพ"
        />
      </Helmet>

      {/* 🏷️ Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-800 dark:text-red-200 mb-6">
        {t("products.heading")}
      </h1>

      {/* 🔘 Toggle Sidebar */}
      <div className="mb-6 flex justify-center sm:justify-start">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition shadow-sm sm:w-fit w-full justify-center"
        >
          {sidebarOpen ? (
            <>
              <Squares2X2Icon className="w-5 h-5" />
              <span className="hidden sm:inline">ซ่อนหมวดหมู่</span>
            </>
          ) : (
            <>
              <Bars3Icon className="w-5 h-5" />
              <span className="hidden sm:inline">แสดงหมวดหมู่</span>
            </>
          )}
        </button>
      </div>

      {/* 🧭 Layout หลัก */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar หมวดหมู่ */}
        {sidebarOpen && (
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className="sm:w-64"
          />
        )}

        {/* รายการสินค้า */}
        <div
          className={`flex-1 grid gap-6 grid-cols-1 sm:grid-cols-2 ${
            sidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded shadow bg-white dark:bg-gray-800 flex flex-col h-full"
            >
              <div className="aspect-[16/9] rounded overflow-hidden mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-300 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">
                {item.description}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
           <Link
  to={`/services/${item.id}`}
  className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded shadow transition text-center"
>
  ดูรายละเอียดเพิ่มเติม
</Link>

                <Link
                  to="/contact"
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-center"
                >
                  ติดต่อเรา
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
