"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // ✅ Normalize to array
        setAppointments(Array.isArray(data.appointments) ? data.appointments : []);
      } catch (err) {
        console.error(err);
        setError("Could not load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading && <p className="text-gray-600">Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Appointments Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              📅 Total Appointments
            </h2>
            <p className="text-4xl font-bold text-red-700">
              {appointments.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
