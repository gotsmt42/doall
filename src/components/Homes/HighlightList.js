import React from "react";
import { useTranslation } from "react-i18next";

const HighlightList = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 bg-red-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-100 mb-6">
          {t("home.why_title")}
        </h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300 text-left mx-auto max-w-md">
          <li>✅ {t("home.why1")}</li>
          <li>✅ {t("home.why2")}</li>
          <li>✅ {t("home.why3")}</li>
          <li>✅ {t("home.why4")}</li>
        </ul>
      </div>
    </section>
  );
};

export default HighlightList;
