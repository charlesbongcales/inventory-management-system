"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const API = process.env.NEXT_PUBLIC_USERS_API_URL;
    const url = `${API}/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("RAW RESPONSE:", text);
        setError("Server returned invalid JSON.");
        return;
      }

      if (!res.ok) {
        setError(data.message || `Login failed (${res.status})`);
        return;
      }

      if (!data.token || !data.user) {
        setError("Login succeeded but no token or user returned. Check backend.");
        return;
      }

      Cookies.set("token", data.token, { expires: 1 });
      const cookieRole = data.user.role === "employee" ? "employee" : data.user.role;
      Cookies.set("role", cookieRole, { expires: 1 });

      if (cookieRole === "admin") router.push("/admin");
      else router.push("/user");

    } catch (err) {
      console.error("LOGIN FETCH ERROR", err);
      setError(err.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>

        {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
