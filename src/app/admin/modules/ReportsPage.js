"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_PRODUCTS = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;
  const API_SUPPLIERS = process.env.NEXT_PUBLIC_PRODUCTS_API_URL; // if separate, replace with NEXT_PUBLIC_SUPPLIERS_API_URL

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_PRODUCTS}/api/reports/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_SUPPLIERS}/api/reports/suppliers`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      startY: 20,
      head: [["Name", "Category", "Supplier", "Stock", "Price"]],
      body: products.map(p => [
        p.name,
        p.categories?.name || "",
        p.suppliers?.name || "",
        p.stock,
        p.price,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Name", "Contact", "Phone", "Email", "Address"]],
      body: suppliers.map(s => [
        s.name,
        s.contact_person || "",
        s.phone || "",
        s.email || "",
        s.address || "",
      ]),
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPreviewUrl(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      startY: 20,
      head: [["Name", "Category", "Supplier", "Stock", "Price"]],
      body: products.map(p => [
        p.name,
        p.categories?.name || "",
        p.suppliers?.name || "",
        p.stock,
        p.price,
      ]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Name", "Contact", "Phone", "Email", "Address"]],
      body: suppliers.map(s => [
        s.name,
        s.contact_person || "",
        s.phone || "",
        s.email || "",
        s.address || "",
      ]),
    });

    doc.save("Carwash_Reports.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reports</h1>

      <div className="flex gap-4 mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={generatePDF}
        >
          Preview PDF
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {previewUrl && (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          className="w-full h-[600px] border rounded shadow"
        />
      )}
    </div>
  );
}
