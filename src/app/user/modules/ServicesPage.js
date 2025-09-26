"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeServicesPage() {
  const API_SERVICES = process.env.NEXT_PUBLIC_SERVICES_API_URL + "/api";
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  // Pagination
  const [categoryPage, setCategoryPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, srvRes] = await Promise.all([
          axios.get(`${API_SERVICES}/service-categories`),
          axios.get(`${API_SERVICES}/services`)
        ]);
        setCategories(catRes.data);
        setServices(srvRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Pagination
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * ITEMS_PER_PAGE,
    categoryPage * ITEMS_PER_PAGE
  );

  const paginatedServices = services.slice(
    (servicePage - 1) * ITEMS_PER_PAGE,
    servicePage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Services</h1>

      {/* Categories */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Service Categories</h2>
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 border">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.length > 0 ? (
              paginatedCategories.map((cat) => (
                <tr key={cat.services_category_id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{cat.category_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 border text-center text-gray-500">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {categories.length > ITEMS_PER_PAGE && (
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="px-3 py-1">{categoryPage}</span>
            <button
              onClick={() => setCategoryPage((prev) => Math.min(prev + 1, Math.ceil(categories.length / ITEMS_PER_PAGE)))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Services */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Services</h2>
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 border">Service Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Small</th>
              <th className="px-4 py-2 border">Medium</th>
              <th className="px-4 py-2 border">Large</th>
              <th className="px-4 py-2 border">XL</th>
              <th className="px-4 py-2 border">XXL</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((srv) => (
                <tr key={srv.service_id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border">{srv.service_name}</td>
                  <td className="px-4 py-2 border">{srv.services_category?.category_name || "N/A"}</td>
                  <td className="px-4 py-2 border">{srv.small}</td>
                  <td className="px-4 py-2 border">{srv.medium}</td>
                  <td className="px-4 py-2 border">{srv.large}</td>
                  <td className="px-4 py-2 border">{srv.xlarge}</td>
                  <td className="px-4 py-2 border">{srv.xxlarge}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 border text-center text-gray-500">No services found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {services.length > ITEMS_PER_PAGE && (
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setServicePage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="px-3 py-1">{servicePage}</span>
            <button
              onClick={() => setServicePage((prev) => Math.min(prev + 1, Math.ceil(services.length / ITEMS_PER_PAGE)))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
