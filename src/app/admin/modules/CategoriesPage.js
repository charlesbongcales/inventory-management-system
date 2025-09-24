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

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories CRUD</h1>

      {/* Category Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded space-y-2">
        <input
          type="text"
          placeholder="Category Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {form.id ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Categories List */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{c.name}</td>
              <td className="px-4 py-2 border">{c.description}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
