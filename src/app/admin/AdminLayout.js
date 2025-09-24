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
    { label: "Categories", icon: <FaTags />, key: "categories" }, // ✅ Added
    { label: "Services", icon: <FaClipboardList />, key: "services" },
    { label: "Users", icon: <FaUsers />, key: "users" },
    { label: "Reports", icon: <FaClipboardList />, key: "reports" },
    { label: "Settings", icon: <FaCog />, key: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
                  active === item.key ? "bg-gray-700" : ""
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 bg-red-500 rounded hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
