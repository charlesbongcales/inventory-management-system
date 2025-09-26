"use client";

import { useState, useEffect } from "react";

export default function DashboardPage({ role }) {
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const PRODUCTS_API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const productsRes = await fetch(`${PRODUCTS_API}/api/products`);
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const products = await productsRes.json();
        setTotalProducts(products.length);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, [PRODUCTS_API]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Total Products: {totalProducts}</p>
    </div>
  );
}
