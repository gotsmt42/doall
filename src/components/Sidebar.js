import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaBoxOpen,
  FaProjectDiagram,
  FaPhone,
} from "react-icons/fa";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const navLinks = [
    { name: "หน้าแรก", path: "/", icon: <FaHome /> },
    { name: "เกี่ยวกับ", path: "/about", icon: <FaInfoCircle /> },

    { name: "โครงการ", path: "/projects", icon: <FaProjectDiagram /> },
    { name: "สินค้า", path: "/products", icon: <FaBoxOpen /> },
    { name: "ติดต่อเรา", path: "/contact", icon: <FaPhone /> },
  ];

  return (
    <aside
      className={`hidden md:flex fixed top-0 right-0 h-full z-50 shadow-lg bg-gray-100 dark:bg-gray-800 
        transition-all duration-500 ease-in-out
        ${collapsed ? "w-15" : "w-72"} rounded-none`}
    >
      <div className="flex flex-col w-full h-full">
        {/* 🔘 ปุ่มย่อ/ขยาย (optional toggle) */}
        <div className="p-2 flex justify-end">
          {/* <button
            onClick={onToggle}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition-transform duration-300 transform hover:scale-110"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button> */}
        </div>

        {/* 🧭 เมนูนำทาง */}
        <nav className="flex-1 px-1">
          <ul className="space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => collapsed || onToggle?.()}
                    className={`flex items-center gap-3 px-2 py-1 w-full rounded-xl transition-all duration-300 ease-in-out
                      ${collapsed ? "justify-center" : "justify-start"}
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-200"
                      }
                    `}
                  >
                    {/* 🖼 ไอคอนในวงกลม */}
                    <span
                      className={`flex items-center justify-center w-10 h-10 rounded-full
                        text-xl transition-all duration-300 ease-in-out
                        ${
                          isActive
                            ? "bg-red-600"
                            : "hover:bg-red-300 dark:hover:bg-red-600"
                        }
                      `}
                    >
                      {link.icon}
                    </span>

                    {/* 📝 Label */}
                    {!collapsed && (
                      <span className="text-base font-medium transition-opacity duration-300">
                        {link.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 🔖 ส่วนล่าง */}
        {!collapsed && (
          <div className="p-4 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} บริษัทของคุณ
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
