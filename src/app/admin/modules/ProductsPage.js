"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    price: 0,
    stock: 0,
    image: null,
  });

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

  // Load products & categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    setLoading(false);
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { ...form };
    if (form.image) formData.image_path = form.image.name;

    try {
      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save product");
      await fetchProducts();
      setForm({
        sku: "",
        name: "",
        description: "",
        category_id: "",
        price: 0,
        stock: 0,
        image: null,
      });
      setPreview(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Products CRUD</h1>

      {/* Product Form */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add / Update Product</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
            className="border p-2 rounded bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border p-2 rounded bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            required
            className="border p-2 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            required
            className="border p-2 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            required
            className="border p-2 rounded bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="border p-2 rounded bg-gray-50 text-gray-900"
          />

          {/* Image Preview */}
          {preview && (
            <div className="col-span-full">
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <Image
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="rounded border object-cover"
              />
            </div>
          )}

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 col-span-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-full hover:bg-blue-700 transition"
          >
            Save Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Products List</h2>
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">SKU</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{p.sku}</td>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.categories?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{p.price}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                <td className="px-4 py-2 border">
                  {p.image_path ? (
                    <Image
                      src={`${API}/storage/${p.image_path}`}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
