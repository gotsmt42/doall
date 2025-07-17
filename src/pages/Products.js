import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { products } from "../data/products";

import ProductGroup from "../components/Products/ProductGroup";
import ProductCTA from "../components/Products/ProductCTA";

const Products = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Helmet>
        <title>
          สินค้าและบริการ - บริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด
        </title>
        <meta
          name="description"
          content="สำรวจผลิตภัณฑ์และบริการด้านนวัตกรรม วิศวกรรม และเทคโนโลยีของบริษัท ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด"
        />
      </Helmet>

      <h1 className="text-4xl font-bold text-center text-red-800 dark:text-red-200 mb-16">
        {t("products.heading")}
      </h1>

      {products.map((group, index) => (
        <ProductGroup key={index} group={group} index={index} />
      ))}

      <ProductCTA />
    </section>
  );
};

export default Products;
