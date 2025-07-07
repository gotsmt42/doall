import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.description')} />
      </Helmet>

      <section className="py-20 px-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-red-800 dark:text-red-300 mb-6 text-center">
          {t('about.heading')}
        </h1>

        <p className="mb-6 text-lg leading-relaxed">{t('about.paragraph1')}</p>
        <p className="mb-8 text-lg">{t('about.paragraph2')}</p>

        <div className="bg-red-50 dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-200">
            {t('about.management_title')}
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>👤 <strong>{t('about.ceo')}</strong></li>
            <li>👩‍💼 <strong>{t('about.cfo')}</strong></li>
            <li>👨‍🔧 <strong>{t('about.engineering')}</strong></li>
            <li>👩‍🎨 <strong>{t('about.design')}</strong></li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default About;
