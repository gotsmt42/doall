// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './Navbar';
import Footer from './Footer';
import DarkModeToggle from './DarkModeToggle';

const Layout = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition">
    {/* <Helmet>
      <title>บริษัทตัวอย่าง จำกัด</title>
      <meta name="description" content="เว็บไซต์บริษัทเทคโนโลยีและนักลงทุนสัมพันธ์" />
    </Helmet> */}

    <Navbar />
    {/* <div className="p-4 flex justify-end">
      <DarkModeToggle />
    </div> */}

    <main>
      <Outlet /> {/* ช่องสำหรับหน้าแต่ละหน้า */}
    </main>

    <Footer />
  </div>
);

export default Layout;
