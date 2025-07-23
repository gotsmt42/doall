// src/components/Layout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });


  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };
  // กำหนด padding ให้เนื้อหาเปลี่ยนตาม sidebar
  const contentPadding = sidebarCollapsed ? "md:pr-16" : "md:pr-72";

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition relative">
<main className={`flex-1 transition-all duration-500 ease-in-out ${contentPadding}`}>

        <Navbar />
        <div className="px-0 py-0">
          <Outlet />
        </div>
        <Footer />
      </main>
{/* 
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} /> */}
      <Sidebar collapsed={sidebarCollapsed} />
    </div>
  );
};

export default Layout;
