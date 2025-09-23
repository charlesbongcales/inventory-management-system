"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <p className="mb-6">
        Welcome, User! You can view services, make sales, and handle
        transactions here.
      </p>

      <button
        onClick={handleLogout}
        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
