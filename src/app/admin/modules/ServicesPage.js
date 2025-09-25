"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Reusable Modal
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const API_SERVICES = process.env.NEXT_PUBLIC_SERVICES_API_URL + "/api";
  const API_PRODUCTS = process.env.NEXT_PUBLIC_PRODUCTS_API_URL + "/api";

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    service_name: "",
    services_category_id: "",
    small: 0,
    medium: 0,
    large: 0,
    xlarge: 0,
    xxlarge: 0,
    service_id: null,
  });

  const [assignProduct, setAssignProduct] = useState({
    service_id: "",
    variant_id: "",
  });

  const [assignProducts, setAssignProducts] = useState([{ product_id: "", quantity: 0 }]);

  // Pagination
  const [categoryPage, setCategoryPage] = useState(1);
  const [servicePage, setServicePage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Fetch functions
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/service-categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/services`);
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/variants`);
      setVariants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_PRODUCTS}/products`);
      const serviceProducts = res.data.filter((p) => p.category_id === 5); // Only service products
      setProducts(serviceProducts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchVariants();
    fetchProducts();
  }, []);

  /* ==================== CATEGORY CRUD ==================== */
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_SERVICES}/service-categories`, { category_name: newCategory });
      setNewCategory("");
      setIsCategoryModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_SERVICES}/service-categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  /* ==================== SERVICE CRUD ==================== */
  const addService = async () => {
    if (!newService.service_name || !newService.services_category_id) return;
    try {
      if (newService.service_id) {
        await axios.put(`${API_SERVICES}/services/${newService.service_id}`, newService);
      } else {
        await axios.post(`${API_SERVICES}/services`, newService);
      }

      setNewService({
        service_name: "",
        services_category_id: "",
        small: 0,
        medium: 0,
        large: 0,
        xlarge: 0,
        xxlarge: 0,
        service_id: null,
      });
      setIsServiceModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${API_SERVICES}/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  /* ==================== ASSIGN PRODUCTS ==================== */
  const assignProductsToService = async () => {
    if (!assignProduct.service_id || !assignProduct.variant_id) {
      alert("Please select service and variant.");
      return;
    }

    const validRows = assignProducts.filter((p) => p.product_id && p.quantity > 0);
    if (validRows.length === 0) {
      alert("Please select at least one product with quantity.");
      return;
    }

    try {
      for (const p of validRows) {
        await axios.post(`${API_SERVICES}/service-products/assign`, {
          service_id: assignProduct.service_id,
          variant_id: assignProduct.variant_id,
          product_id: p.product_id,
          quantity: p.quantity,
        });
      }
      alert("✅ Products assigned successfully");
      setAssignProducts([{ product_id: "", quantity: 0 }]);
      setAssignProduct({ service_id: "", variant_id: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error assigning products");
    }
  };

  /* ==================== PAGINATION ==================== */
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * ITEMS_PER_PAGE,
    categoryPage * ITEMS_PER_PAGE
  );
  const paginatedServices = services.slice(
    (servicePage - 1) * ITEMS_PER_PAGE,
    servicePage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 space-y-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>

      {/* CATEGORY TABLE */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Service Categories</h2>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Category
          </button>
        </div>
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-2 border">Category Name</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat) => (
              <tr key={cat.services_category_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{cat.category_name}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setNewCategory(cat.category_name);
                      setIsCategoryModalOpen(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.services_category_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedCategories.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              onClick={() =>
                setCategoryPage((prev) =>
                  Math.min(prev + 1, Math.ceil(categories.length / ITEMS_PER_PAGE))
                )
              }
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* SERVICES TABLE */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Services</h2>
          <button
            onClick={() => setIsServiceModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add Service
          </button>
        </div>
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-2 border">Service Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Small</th>
              <th className="px-4 py-2 border">Medium</th>
              <th className="px-4 py-2 border">Large</th>
              <th className="px-4 py-2 border">XL</th>
              <th className="px-4 py-2 border">XXL</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.map((srv) => (
              <tr key={srv.service_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{srv.service_name}</td>
                <td className="px-4 py-2 border">{srv.services_category?.category_name || "N/A"}</td>
                <td className="px-4 py-2 border">{srv.small}</td>
                <td className="px-4 py-2 border">{srv.medium}</td>
                <td className="px-4 py-2 border">{srv.large}</td>
                <td className="px-4 py-2 border">{srv.xlarge}</td>
                <td className="px-4 py-2 border">{srv.xxlarge}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setNewService({ ...srv });
                      setIsServiceModalOpen(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(srv.service_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedServices.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              onClick={() =>
                setServicePage((prev) =>
                  Math.min(prev + 1, Math.ceil(services.length / ITEMS_PER_PAGE))
                )
              }
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ASSIGN PRODUCTS */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Assign Products to Service</h2>

        {/* Service & Variant Select */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <select
            value={assignProduct.service_id}
            onChange={(e) =>
              setAssignProduct({ ...assignProduct, service_id: e.target.value })
            }
            className="border p-2 rounded focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Service</option>
            {services.map((srv) => (
              <option key={srv.service_id} value={srv.service_id}>
                {srv.service_name}
              </option>
            ))}
          </select>

          <select
            value={assignProduct.variant_id}
            onChange={(e) =>
              setAssignProduct({ ...assignProduct, variant_id: e.target.value })
            }
            className="border p-2 rounded focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Variant</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Multiple Products */}
        {assignProducts.map((row, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <select
              value={row.product_id}
              onChange={(e) => {
                const newRows = [...assignProducts];
                newRows[index].product_id = e.target.value;
                setAssignProducts(newRows);
              }}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={row.quantity}
              onChange={(e) => {
                const newRows = [...assignProducts];
                newRows[index].quantity = Number(e.target.value);
                setAssignProducts(newRows);
              }}
              placeholder="Qty"
              className="border p-2 rounded w-24"
            />

            {assignProducts.length > 1 && (
              <button
                onClick={() => {
                  const newRows = assignProducts.filter((_, i) => i !== index);
                  setAssignProducts(newRows);
                }}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
              >
                ✖
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() =>
            setAssignProducts([...assignProducts, { product_id: "", quantity: 0 }])
          }
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition mb-4"
        >
          + Add Another Product
        </button>

        <button
          onClick={assignProductsToService}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Assign Products
        </button>
      </div>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={newCategory ? "Edit Category" : "Add Category"}
      >
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category Name"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={addCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {newCategory ? "Update" : "Add"}
        </button>
      </Modal>

      {/* SERVICE MODAL */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title={newService.service_id ? "Edit Service" : "Add Service"}
      >
        <input
          type="text"
          value={newService.service_name}
          onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
          placeholder="Service Name"
          className="border p-2 rounded w-full mb-2"
        />
        <select
          value={newService.services_category_id}
          onChange={(e) =>
            setNewService({ ...newService, services_category_id: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.services_category_id} value={c.services_category_id}>
              {c.category_name}
            </option>
          ))}
        </select>

        {/* Prices */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="number"
            placeholder="Small"
            value={newService.small}
            onChange={(e) => setNewService({ ...newService, small: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Medium"
            value={newService.medium}
            onChange={(e) => setNewService({ ...newService, medium: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Large"
            value={newService.large}
            onChange={(e) => setNewService({ ...newService, large: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="XL"
            value={newService.xlarge}
            onChange={(e) => setNewService({ ...newService, xlarge: Number(e.target.value) })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="XXL"
            value={newService.xxlarge}
            onChange={(e) => setNewService({ ...newService, xxlarge: Number(e.target.value) })}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={addService}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {newService.service_id ? "Update Service" : "Add Service"}
        </button>
      </Modal>
    </div>
  );
}
