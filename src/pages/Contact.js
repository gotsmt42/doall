import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  const schema = Yup.object().shape({
    name: Yup.string().required(t("contact.errors.name")),
    email: Yup.string().email(t("contact.errors.email_format")).required(t("contact.errors.email")),
    message: Yup.string().required(t("contact.errors.message")),
  });

  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    reset();
  };

  return (
    <section className="py-16 px-4 max-w-xl mx-auto">
      <Helmet>
        <title>{t("contact.title")}</title>
        <meta name="description" content={t("contact.description")} />
      </Helmet>

      <h2 className="text-3xl font-bold text-red-800 dark:text-red-200 text-center mb-8">
        {t("contact.heading")}
      </h2>

      {submitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded shadow">
          ✅ {t("contact.success")}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded shadow"
      >
        <div>
          <label className="block mb-1 font-medium">{t("contact.name_label")}</label>
          <input
            type="text"
            placeholder={t("contact.name_placeholder")}
            {...register("name")}
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("contact.email_label")}</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">{t("contact.message_label")}</label>
          <textarea
            rows="5"
            placeholder={t("contact.message_placeholder")}
            {...register("message")}
            className="w-full p-3 border rounded dark:bg-gray-800 dark:text-white"
          />
          <p className="text-red-500 text-sm mt-1">{errors.message?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded hover:bg-red-700 transition"
        >
          ✉️ {t("contact.submit_button")}
        </button>
      </form>
    </section>
  );
};

export default Contact;

