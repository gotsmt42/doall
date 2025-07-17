import React from "react";
import { useTranslation } from "react-i18next";

const ProductCTA = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-20 text-center">
      <p className="text-lg text-gray-700 dark:text-gray-300">{t("products.des")}</p>
      <a
        href="/contact"
        className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded hover:bg-red-700 transition"
      >
        📩 {t("products.contact")}
      </a>
    </div>
  );
};

export default ProductCTA;
