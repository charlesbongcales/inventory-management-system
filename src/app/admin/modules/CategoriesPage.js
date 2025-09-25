"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal
  const openModal = (category = null) => {
    if (category) {
      setForm({
        id: category.id,
        name: category.name,
        description: category.description || "",
      });
    } else {
      setForm({ id: null, name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ id: null, name: "", description: "" });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = form.id
        ? `${API}/api/categories/${form.id}`
        : `${API}/api/categories`;
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      toast.success(form.id ? "Category updated!" : "Category added!");
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = (category) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      const res = await fetch(
        `${API}/api/categories/${categoryToDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted!");
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <p className="text-gray-600">Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => openModal()}
          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left border">Name</th>
                <th className="px-4 py-3 text-left border">Description</th>
                <th className="px-4 py-3 text-center border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border">{c.name}</td>
                  <td className="px-4 py-3 border">{c.description || "-"}</td>
                  <td className="px-4 py-3 border text-center space-x-2">
                    <button
                      onClick={() => openModal(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(c)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {form.id ? "Update Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
                >
                  {form.id ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{categoryToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
