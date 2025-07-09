import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import DarkModeToggle from "./DarkModeToggle";
import { useTheme } from "next-themes";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { Helmet } from "react-helmet-async";

const Navbar = () => {
  const { i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(logoLight);

  useEffect(() => {
    setLogoSrc(theme === "dark" ? logoDark : logoLight);
  }, [theme]);

  const toggleLang = () => {
    const nextLang = i18n.language === "th" ? "en" : "th";
    i18n.changeLanguage(nextLang);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="relative bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-sm h-20 z-50">
      <Helmet>
        <title>
          {i18n.language === "th"
            ? "หน้าแรก | ดูออล อาคิเทค แอนด์ เอ็นจิเนียริ่ง จำกัด"
            : "Home | Do All Architect And Engineering Co., Ltd"}
        </title>
        <meta
          name="description"
          content="บริการดูแลบำรุงรักษาระบบ Fire Alarm ระบบ CCTV ครบวงจร"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 h-full relative">
        {/* 🔷 Logo */}
        <Link to="/" className="flex-shrink-0 mt-3">
          {" "}
<img
  src={logoSrc}
  onError={(e) => (e.target.src = logoLight)}
  alt="โลโก้บริษัท"
  className="h-28 sm:h-32 md:h-36 lg:h-29 object-contain max-w-[300px] sm:max-w-[340px]"
/>


        </Link>

        {/* 💻 Desktop Menu */}
        <div className="hidden sm:flex items-center justify-end flex-grow space-x-3 ml-auto">
          <ul className="flex space-x-2 text-sm font-medium">
            <li className="hover:text-primary-light px-2">
              <Link to="/">{i18n.language === "th" ? "หน้าแรก" : "Home"}</Link>
            </li>
            <li className="hover:text-primary-light px-2">
              <Link to="/about">
                {i18n.language === "th" ? "เกี่ยวกับเรา" : "About"}
              </Link>
            </li>
            <li className="hover:text-primary-light px-2">
              <Link to="/projects">
                {i18n.language === "th" ? "ผลงาน" : "Projects"}
              </Link>
            </li>
            <li className="hover:text-primary-light px-2">
              <Link to="/products">
                {i18n.language === "th" ? "สินค้าและบริการ" : "Products"}
              </Link>
            </li>
            <li className="hover:text-primary-light px-2">
              <Link to="/contact">
                {i18n.language === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Link>
            </li>
          </ul>

          {/* 🌐 Language + Dark Mode */}
          <div className="flex items-center space-x-2 pl-2">
            <button
              onClick={toggleLang}
              className="text-xs px-2 py-1  bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded shadow-sm"
            >
              🌐 {i18n.language === "th" ? "TH" : "EN"}
            </button>
            <DarkModeToggle />
          </div>
        </div>

        {/* 🍔 Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="sm:hidden ml-auto p-2"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-3  bg-gray-100 dark:bg-gray-900">
          <ul className="space-y-1 text-[14px]">
            <li>
              <Link
                className="py-1 px-2 inline-block"
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                {i18n.language === "th" ? "หน้าแรก" : "Home"}
              </Link>
            </li>
            <li>
              <Link
                className="py-1 px-2 inline-block"
                to="/about"
                onClick={() => setMenuOpen(false)}
              >
                {i18n.language === "th" ? "เกี่ยวกับเรา" : "About"}
              </Link>
            </li>
            <li>
              <Link
                className="py-1 px-2 inline-block"
                to="/projects"
                onClick={() => setMenuOpen(false)}
              >
                {i18n.language === "th" ? "ผลงาน" : "Projects"}
              </Link>
            </li>
            <li>
              <Link
                className="py-1 px-2 inline-block"
                to="/products"
                onClick={() => setMenuOpen(false)}
              >
                {i18n.language === "th" ? "สินค้าและบริการ" : "Products"}
              </Link>
            </li>
            <li>
              <Link
                className="py-1 px-2 inline-block"
                to="/contact"
                onClick={() => setMenuOpen(false)}
              >
                {i18n.language === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Link>
            </li>
            <li>
              <button
                aria-label="Toggle language"
                onClick={toggleLang}
                className="mt-2 mb-2 mx-2 mr-3 px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white"
              >
                🌐 {i18n.language === "th" ? "TH" : "EN"}
              </button>

              <DarkModeToggle />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
