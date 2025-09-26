"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaBox, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

export default function UserLayout({ active, setActive, children }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  // Employee menu items
  const menuItems = [
    { label: "Products", icon: <FaBox />, key: "products" },
    { label: "Services", icon: <FaClipboardList />, key: "services" },
  ];

  const navButtonClass = (key) =>
    `flex items-center w-full px-5 py-4 mb-3 rounded-lg text-base font-medium transition-all duration-300 cursor-pointer relative
    ${
      active === key
        ? "text-white bg-red-800 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-white before:rounded-r"
        : "text-gray-700 hover:bg-red-800 hover:text-white hover:translate-x-1 active:translate-x-1 active:scale-98"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-gray-100 border-r-4 border-red-800 shadow-lg flex flex-col py-4 z-50">
        {/* Header */}
        <div className="px-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl shadow-md p-4 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-800 mb-1">User Panel</h1>
            <p className="text-sm text-red-600">Welcome back!</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-3 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={navButtonClass(item.key)}
              onClick={() => setActive(item.key)}
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto px-3 pt-5 border-t-2 border-gray-300">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-5 py-4 rounded-lg text-base font-semibold text-white bg-red-800 hover:bg-red-900 transition-all duration-300 cursor-pointer"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 overflow-auto">{children}</div>
    </div>
  );
}
