"use client";

import { useEffect, useState } from "react";
import {
  FaBox,
  FaConciergeBell,
  FaTruck,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PRODUCTS_API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
  const SERVICES_API = process.env.NEXT_PUBLIC_SERVICES_API_URL;
  const SUPPLIERS_API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
  const APPOINTMENTS_API = "/api/appointments";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const productsRes = await fetch(`${PRODUCTS_API}/api/products`);
        const products = await productsRes.json();
        setTotalProducts(products.length);
        setLowStockProducts(products.filter((p) => p.stock <= p.reorder_level));

        const servicesRes = await fetch(`${SERVICES_API}/api/services`);
        const services = await servicesRes.json();
        setTotalServices(services.length);

        const suppliersRes = await fetch(`${SUPPLIERS_API}/api/suppliers`);
        const suppliers = await suppliersRes.json();
        setTotalSuppliers(suppliers.length);

        const appointmentsRes = await fetch(APPOINTMENTS_API);
        const appointmentsData = await appointmentsRes.json();
        setAppointments(
          Array.isArray(appointmentsData.appointments)
            ? appointmentsData.appointments
            : []
        );
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [PRODUCTS_API, SERVICES_API, SUPPLIERS_API, APPOINTMENTS_API]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 text-lg font-medium">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card title="Total Products" count={totalProducts} icon={<FaBox size={28} />} color="red" />
        <Card title="Total Services" count={totalServices} icon={<FaConciergeBell size={28} />} color="yellow" />
        <Card title="Total Suppliers" count={totalSuppliers} icon={<FaTruck size={28} />} color="blue" />
        <Card title="Appointments" count={appointments.length} icon={<FaCalendarAlt size={28} />} color="purple" />
        <Card title="Low Stock" count={lowStockProducts.length} icon={<FaExclamationTriangle size={28} />} color="pink" />
      </div>

      {/* Low Stock Products Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Low Stock Products</h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-gray-500">All products are sufficiently stocked.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Stock</th>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">Reorder Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className={`px-4 py-3 font-semibold ${p.stock <= 2 ? "text-red-600" : "text-gray-700"}`}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">{p.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Card component with subtle accent
function Card({ title, count, icon, color }) {
  const colorMap = {
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    pink: "bg-pink-50 border-pink-200 text-pink-700",
  };

  return (
    <div
      className={`border rounded-xl shadow-md p-6 h-36 flex flex-col justify-between hover:shadow-lg transition-shadow ${colorMap[color]}`}
    >
      <div>
        <h2 className="text-gray-700 text-lg font-semibold">{title}</h2>
        <p className="text-gray-900 text-3xl font-bold mt-2">{count}</p>
      </div>
      <div className="self-end text-opacity-80">{icon}</div>
    </div>
  );
}
