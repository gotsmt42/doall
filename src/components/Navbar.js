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
    <nav className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-md font-bold">
      <Helmet>
        <title>
          {i18n.language === "th" ? "หน้าแรก | ดูออล อาคอเทค แอนด์ เอ็นจิเนียริ่ง จำกัด" : "Home | Do All Architect And Engineering Co., Ltd"}
        </title>
        <meta
          name="description"
          content="บริการดูแลบำรุงรักษาระบบ Fire Alarm ระบบ cctv ครบวงจร"
        />
      </Helmet>

<div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4">
        {/* 🔷 Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logoSrc}
            onError={(e) => (e.target.src = logoLight)}
            alt="โลโก้บริษัท"
            className="h-28 sm:h-28 md:h-30 lg:h-40 max-w-[360px] object-contain transition-all duration-300 ease-in-out"
          />
        </Link>

        {/* 💻 Desktop Menu */}
        <div className="hidden sm:flex items-center justify-between flex-grow">
<ul className="flex space-x-2 justify-end flex-grow">
            <li className="hover:bg-primary-light rounded hover:text-white px-3 py-1">
              <Link to="/">{i18n.language === "th" ? "หน้าแรก" : "Home"}</Link>
            </li>
            <li className="hover:bg-primary-light rounded hover:text-white px-3 py-1">
              <Link to="/about">
                {i18n.language === "th" ? "เกี่ยวกับเรา" : "About"}
              </Link>
            </li>
            <li className="hover:bg-primary-light rounded hover:text-white px-3 py-1">
              <Link to="/projects">
                {i18n.language === "th" ? "ผลงาน" : "Projects"}
              </Link>
            </li>
            <li className="hover:bg-primary-light rounded hover:text-white px-3 py-1">
              <Link to="/products">
                {i18n.language === "th" ? "สินค้าและบริการ" : "Products"}
              </Link>
            </li>
            <li className="hover:bg-primary-light rounded hover:text-white px-3 py-1">
              <Link to="/contact">
                {i18n.language === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Link>
            </li>
          </ul>

          {/* 🌐 Language + Dark Mode */}
          <div className="flex items-center space-x-2 pl-4">
            <button
              aria-label="Toggle language"
              onClick={toggleLang}
              className="text-sm px-3 py-1 bg-light hover:bg-gray-200 dark:hover:bg-primary-light rounded"
            >
              🌐 {i18n.language === "th" ? "TH" : "EN"}
            </button>
            <DarkModeToggle />
          </div>
        </div>

        {/* 🍔 Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="sm:hidden focus:outline-none ml-4"
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
      <div
        className={`sm:hidden px-4 pb-4 transition-all ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="space-y-2">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              {i18n.language === "th" ? "หน้าแรก" : "Home"}
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              {i18n.language === "th" ? "เกี่ยวกับเรา" : "About"}
            </Link>
          </li>
          <li>
            <Link to="/projects" onClick={() => setMenuOpen(false)}>
              {i18n.language === "th" ? "ผลงาน" : "Projects"}
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              {i18n.language === "th" ? "สินค้าและบริการ" : "Products"}
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              {i18n.language === "th" ? "ติดต่อเรา" : "Contact Us"}
            </Link>
          </li>

          {/* 🌐 Language + Dark Mode */}
          <li>
            <button
              aria-label="Toggle language"
              onClick={toggleLang}
              className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              🌐 {i18n.language === "th" ? "TH" : "EN"}
            </button>
          </li>
          <li>
            <DarkModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
