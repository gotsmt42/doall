import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>
          © {new Date().getFullYear()} {t('footer.company')}
        </p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="/privacy" className="hover:underline">{t('footer.privacy')}</a>
          <a href="/contact" className="hover:underline">{t('footer.contact')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
