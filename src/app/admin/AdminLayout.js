"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { 
  FaBox, 
  FaUsers, 
  FaClipboardList, 
  FaCog, 
  FaSignOutAlt, 
  FaTools, 
  FaTags 
} from "react-icons/fa";

export default function AdminLayout({ active, setActive, children }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: <FaTools />, key: "dashboard" },
    { label: "Products", icon: <FaBox />, key: "products" },
    { label: "Categories", icon: <FaTags />, key: "categories" },
    { label: "Services", icon: <FaClipboardList />, key: "services" },
    { label: "Users", icon: <FaUsers />, key: "users" },
    { label: "Reports", icon: <FaClipboardList />, key: "reports" },
    { label: "Settings", icon: <FaCog />, key: "settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8 text-gray-800">Admin Panel</h1>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-100 transition ${
                  active === item.key ? "bg-red-100 font-semibold" : ""
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.icon} <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
