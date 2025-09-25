"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaBox, FaClipboardList, FaCashRegister, FaSignOutAlt } from "react-icons/fa";

export default function UserPage() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "employee") {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
      console.log("TOKEN:", token, "ROLE:", role);
    }
  }, [router]);

  if (isAuthorized === null) return <div>Loading...</div>; // wait for client check

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Products", icon: <FaBox />, key: "products" },
    { label: "Services", icon: <FaClipboardList />, key: "services" },
    { label: "Sales", icon: <FaCashRegister />, key: "sales" },
    { label: "Transactions", icon: <FaClipboardList />, key: "transactions" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">User Panel</h1>
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

      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-4">
          {active.charAt(0).toUpperCase() + active.slice(1)}
        </h2>
        <p>Content for &quot;{active}&quot; will go here...</p>
      </div>
    </div>
  );
}
