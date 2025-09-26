"use client";

import { useState, useEffect } from "react";

export default function ProductsPage({ role }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const PRODUCTS_API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${PRODUCTS_API}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const visibleProducts =
          role === "employee"
            ? data.map((p) => ({
                product_id: p.product_id,
                name: p.name,
                category: p.categories?.name || "N/A",
                stock: p.stock,
              }))
            : data;

        setProducts(visibleProducts);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [PRODUCTS_API, role]);

  // Filtered + Pagination
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return <div className="text-center py-10 text-gray-600">Loading products...</div>;
  if (error)
    return <div className="text-red-600 text-center py-10">{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3 focus:ring-2 focus:ring-red-400 outline-none"
        />
        {role !== "employee" && (
          <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition">
            Add Product
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Stock</th>
              {role !== "employee" && <th className="px-4 py-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.product_id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.category}</td>
                <td className="px-4 py-2 border">{p.stock}</td>
                {role !== "employee" && (
                  <td className="px-4 py-2 border space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan={role !== "employee" ? 4 : 3} className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
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
  );
}
