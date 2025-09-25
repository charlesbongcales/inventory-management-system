"use client";

import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
  });

  const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = form.id ? `${API}/api/categories/${form.id}` : `${API}/api/categories`;
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, description: form.description }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      setForm({ id: null, name: "", description: "" });
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${API}/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setForm({ id: category.id, name: category.name, description: category.description || "" });
  };

  if (loading) return <p className="text-gray-600">Loading categories...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Categories CRUD</h1>

      {/* Category Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add / Update Category</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border p-2 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-600"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            {form.id ? "Update Category" : "Add Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Categories List</h2>
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Description</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{c.name}</td>
                <td className="px-4 py-2 border">{c.description}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 transition"
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
  );
}
