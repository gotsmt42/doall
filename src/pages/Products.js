import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const products = [
  {
    title: "Product A",
    description: "นวัตกรรมที่ช่วยยกระดับธุรกิจคุณอย่างยั่งยืน",
    icon: "💡",
  },
  {
    title: "Service B",
    description: "บริการออกแบบระบบอัตโนมัติครบวงจร ตั้งแต่ต้นแบบถึงติดตั้งจริง",
    icon: "⚙️",
  },
  {
    title: "Solution C",
    description:
      "โซลูชันธุรกิจตอบโจทย์ยุคดิจิทัล ทั้ง ERP/CRM และ IoT Platform",
    icon: "🚀",
  },
];

const Products = () => {

      const { t } = useTranslation();
    
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>
          สินค้าและบริการ - บริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด
        </title>
        <meta
          name="description"
          content="สำรวจผลิตภัณฑ์และบริการด้านนวัตกรรม วิศวกรรม และเทคโนโลยีของบริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด"
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-center text-red-800 dark:text-red-200 mb-12">
                {t("products.heading")}

      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border bg-white dark:bg-gray-800 shadow hover:shadow-xl transition transform hover:scale-[1.02]"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">
              {item.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {t("products.des")}
        </p>
        <a
          href="/contact"
          className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded hover:bg-red-700 transition"
        >
          📩  {t("products.contact")}
        </a>
      </div>
    </section>
  );
};

export default Products;
