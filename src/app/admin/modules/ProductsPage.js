"use client";

import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    supplier_id: "",
    cost: "",
    price: "",
    stock: "",
    reorder_level: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/api/suppliers`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchSuppliers();
      await fetchProducts();
      setLoading(false);
    };
    loadData();
  }, []);

  // Open Add modal
  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      description: "",
      category_id: "",
      supplier_id: "",
      cost: "",
      price: "",
      stock: "",
      reorder_level: "",
    });
    setShowModal(true);
  };

  // Open Edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
      cost: product.cost,
      price: product.price,
      stock: product.stock,
      reorder_level: product.reorder_level,
    });
    setShowModal(true);
  };

  // Submit (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmAction(() => async () => {
      try {
        const method = editingProduct ? "PUT" : "POST";
        const url = editingProduct
          ? `${API}/api/products/${editingProduct.product_id}`
          : `${API}/api/products`;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to save product");

        await fetchProducts();
        setShowModal(false);
        setEditingProduct(null);
      } catch (err) {
        alert(err.message);
      }
    });
    setShowConfirm(true);
  };

  // Delete product
  const handleDelete = (id) => {
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
        await fetchProducts();
      } catch (err) {
        alert(err.message);
      }
    });
    setShowConfirm(true);
  };

  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categories?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-600 text-lg font-medium">Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6 min-h-[80vh] bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Products Management</h1>

      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={openAddModal}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Add Product
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border p-2 rounded"
              />
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={form.supplier_id}
                onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cost"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Reorder Level"
                value={form.reorder_level}
                onChange={(e) => setForm({ ...form, reorder_level: Number(e.target.value) })}
                required
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border p-2 rounded"
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                >
                  {editingProduct ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Are you sure you want to proceed?
            </h3>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction) confirmAction();
                  setShowConfirm(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Products List</h2>
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Supplier</th>
              <th className="px-4 py-2 border">Cost</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Reorder Level</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.product_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.categories?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{p.suppliers?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{p.cost}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">{p.reorder_level}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.product_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                currentPage === i + 1 ? "bg-gray-300 font-bold" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
