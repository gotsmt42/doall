import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ item }) => (
  <div className="p-4 sm:p-6 rounded-lg border bg-white dark:bg-gray-800 shadow hover:shadow-lg transition flex flex-col justify-between min-h-[480px] h-full">
    <div>
      <div className="aspect-[16/9] w-full rounded overflow-hidden mb-3">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
      <h3 className="mt-5 text-lg sm:text-xl font-semibold text-red-700 dark:text-red-300 leading-snug">
        {item.title}
      </h3>
      <p className="mt-5 pt-5 pb-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
        {item.description}
      </p>
    </div>

    <div className="mt-5 flex flex-col sm:flex-row gap-3">
      <Link
        to={`/services/${item.id}`}
        className="text-sm bg-blue-600 dark:bg-red-400 text-white dark:text-gray-900 px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-red-300 transition text-center"
      >
        ดูรายละเอียดเพิ่มเติม
      </Link>
      <a
        href="/contact"
        className="text-sm bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition text-center"
      >
        ติดต่อเรา
      </a>
    </div>
  </div>
);

export default ProductCard;
