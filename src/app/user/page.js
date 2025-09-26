"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import UserLayout from "./UserLayout";
import ProductsPage from "./modules/ProductsPage";
import ServicesPage from "./modules/ServicesPage"; // Employee-only services module

export default function UserPage() {
  const [active, setActive] = useState("products"); // Default to Products
  const [isAuthorized, setIsAuthorized] = useState(null);
  const router = useRouter();

  // Role-based auth check
  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (!token || role !== "employee") {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (isAuthorized === null) return <div>Loading...</div>;

  const renderModule = () => {
    switch (active) {
      case "products":
        return <ProductsPage role="employee" />;
      case "services":
        return <ServicesPage />;
      default:
        return <ProductsPage role="employee" />;
    }
  };

  return (
    <UserLayout active={active} setActive={setActive}>
      {renderModule()}
    </UserLayout>
  );
}
