import React from "react";

const ServiceCard = ({ img, title, desc, link }) => (
  <div className="flex flex-col bg-white dark:bg-gray-800 shadow p-6 rounded text-center min-h-[500px]">
    <img src={img} alt={title} className="w-full h-45 object-fill rounded mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="mt-auto text-gray-600 dark:text-gray-300 mb-4">{desc}</p>
    <div className="mt-auto">
      <a
        href={link}
        className="inline-block text-sm font-medium text-red-600 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-100 transition"
      >
        ดูรายละเอียดเพิ่มเติม →
      </a>
    </div>
  </div>
);

export default ServiceCard;
