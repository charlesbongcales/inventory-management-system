"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ServicesPage() {
  /* ======================
     API BASE URLS FROM ENV
  ====================== */
  const API_SERVICES = process.env.NEXT_PUBLIC_SERVICES_API_URL + "/api";
  const API_PRODUCTS = process.env.NEXT_PUBLIC_PRODUCTS_API_URL + "/api";

  /* ======================
     STATES
  ====================== */
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    service_name: "",
    services_category_id: "",
    small: 0,
    medium: 0,
    large: 0,
    xl: 0,
    xxl: 0,
  });

  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);

  const [assignProduct, setAssignProduct] = useState({
    service_id: "",
    variant_id: "",
    product_id: "",
    quantity: 0,
  });

  /* ======================
     FETCH DATA
  ====================== */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/service-categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/services`);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services", err);
    }
  };

  const fetchVariants = async () => {
    try {
      const res = await axios.get(`${API_SERVICES}/variants`);
      setVariants(res.data);
    } catch (err) {
      console.error("Error fetching variants", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_PRODUCTS}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchVariants();
    fetchProducts();
  }, []);

  /* ======================
     CATEGORY CRUD
  ====================== */
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await axios.post(`${API_SERVICES}/service-categories`, { category_name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category", err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_SERVICES}/service-categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category", err);
    }
  };

  /* ======================
     SERVICE CRUD
  ====================== */
  const addService = async () => {
    if (!newService.service_name || !newService.services_category_id) return;
    try {
      await axios.post(`${API_SERVICES}/services`, newService);
      setNewService({
        service_name: "",
        services_category_id: "",
        small: 0,
        medium: 0,
        large: 0,
        xl: 0,
        xxl: 0,
      });
      fetchServices();
    } catch (err) {
      console.error("Error adding service", err);
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`${API_SERVICES}/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error("Error deleting service", err);
    }
  };

  /* ======================
     ASSIGN PRODUCT TO SERVICE
  ====================== */
  const assignProductToService = async () => {
    const { service_id, variant_id, product_id, quantity } = assignProduct;
    if (!service_id || !variant_id || !product_id || quantity <= 0) return;

    try {
      await axios.post(`${API_SERVICES}/service-products/assign`, assignProduct);
      alert("✅ Product assigned successfully");
      setAssignProduct({ service_id: "", variant_id: "", product_id: "", quantity: 0 });
    } catch (err) {
      console.error("Error assigning product", err);
      alert("❌ Error assigning product");
    }
  };

  /* ======================
     JSX RENDER
  ====================== */
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Services Management</h1>

      {/* CATEGORY MANAGEMENT */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Service Categories</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            className="border p-2 rounded w-64"
          />
          <button onClick={addCategory} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.services_category_id} className="flex justify-between border p-2 rounded">
              <span>{cat.category_name}</span>
              <button
                onClick={() => deleteCategory(cat.services_category_id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* SERVICES MANAGEMENT */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Services</h2>
        <div className="grid grid-cols-7 gap-2 mb-4">
          <input
            type="text"
            value={newService.service_name}
            onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
            placeholder="Service Name"
            className="border p-2 rounded"
          />
          <select
            value={newService.services_category_id}
            onChange={(e) => setNewService({ ...newService, services_category_id: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.services_category_id} value={cat.services_category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newService.small}
            onChange={(e) => setNewService({ ...newService, small: Number(e.target.value) })}
            placeholder="Small Qty"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={newService.medium}
            onChange={(e) => setNewService({ ...newService, medium: Number(e.target.value) })}
            placeholder="Medium Qty"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={newService.large}
            onChange={(e) => setNewService({ ...newService, large: Number(e.target.value) })}
            placeholder="Large Qty"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={newService.xl}
            onChange={(e) => setNewService({ ...newService, xl: Number(e.target.value) })}
            placeholder="XL Qty"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={newService.xxl}
            onChange={(e) => setNewService({ ...newService, xxl: Number(e.target.value) })}
            placeholder="XXL Qty"
            className="border p-2 rounded"
          />
        </div>
        <button onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Service
        </button>

        <ul className="mt-6 space-y-2">
          {services.map((srv) => (
            <li key={srv.service_id} className="flex justify-between border p-2 rounded">
              <div>
                <strong>{srv.service_name}</strong> <br />
                <span className="text-sm text-gray-600">
                  Category: {srv.services_category?.category_name}
                </span>
                <div className="text-sm">
                  Small: {srv.small}, Medium: {srv.medium}, Large: {srv.large}, XL: {srv.xl}, XXL: {srv.xxl}
                </div>
              </div>
              <button
                onClick={() => deleteService(srv.service_id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ASSIGN PRODUCT TO SERVICE */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Assign Product to Service</h2>
        <div className="grid grid-cols-4 gap-2 mb-4">
          <select
            value={assignProduct.service_id}
            onChange={(e) => setAssignProduct({ ...assignProduct, service_id: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Service</option>
            {services.map((srv) => (
              <option key={srv.service_id} value={srv.service_id}>{srv.service_name}</option>
            ))}
          </select>

          <select
            value={assignProduct.variant_id}
            onChange={(e) => setAssignProduct({ ...assignProduct, variant_id: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Variant</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <select
            value={assignProduct.product_id}
            onChange={(e) => setAssignProduct({ ...assignProduct, product_id: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name} {p.categories?.name ? `(${p.categories.name})` : ""}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={assignProduct.quantity}
            onChange={(e) => setAssignProduct({ ...assignProduct, quantity: Number(e.target.value) })}
            placeholder="Qty"
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={assignProductToService}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Assign Product
        </button>
      </div>
    </div>
  );
}
