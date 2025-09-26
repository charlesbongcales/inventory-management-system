"use client";

import { useState, useEffect } from "react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [search, setSearch] = useState("");

  const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/api/suppliers`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSuppliers();
      setLoading(false);
    };
    loadData();
  }, []);

  // Open Add modal
  const openAddModal = () => {
    setEditingSupplier(null);
    setForm({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setShowModal(true);
  };

  // Open Edit modal
  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      contact_person: supplier.contact_person || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
    });
    setShowModal(true);
  };

  // Submit (Add or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmAction(() => async () => {
      try {
        const method = editingSupplier ? "PUT" : "POST";
        const url = editingSupplier
          ? `${API}/api/suppliers/${editingSupplier.id}`
          : `${API}/api/suppliers`;

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to save supplier");

        await fetchSuppliers();
        setShowModal(false);
        setEditingSupplier(null);
      } catch (err) {
        alert(err.message);
      }
    });
    setShowConfirm(true);
  };

  // Delete supplier
  const handleDelete = (id) => {
    setConfirmAction(() => async () => {
      try {
        const res = await fetch(`${API}/api/suppliers/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete supplier");
        await fetchSuppliers();
      } catch (err) {
        alert(err.message);
      }
    });
    setShowConfirm(true);
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-600 text-lg font-medium">Loading suppliers...</p>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Suppliers Management</h1>

      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by supplier name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button
          onClick={openAddModal}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Add Supplier
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingSupplier ? "Edit Supplier" : "Add Supplier"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Supplier Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Contact Person"
                value={form.contact_person}
                onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border p-2 rounded"
              />

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  {editingSupplier ? "Update" : "Save"}
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

      {/* Suppliers Table */}
      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Suppliers List</h2>
        <table className="min-w-full border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Contact Person</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Notes</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{s.name}</td>
                <td className="px-4 py-2 border">{s.contact_person || "N/A"}</td>
                <td className="px-4 py-2 border">{s.phone || "N/A"}</td>
                <td className="px-4 py-2 border">{s.email || "N/A"}</td>
                <td className="px-4 py-2 border">{s.address || "N/A"}</td>
                <td className="px-4 py-2 border">{s.notes || "N/A"}</td>
                <td className="px-4 py-2 border flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
