"use client";

import { useState } from "react";
import AdminLayout from "./AdminLayout";
import DashboardPage from "./modules/DashboardPage";
import ProductsPage from "./modules/ProductsPage";
import CategoriesPage from "./modules/CategoriesPage";
import ServicesPage from "./modules/ServicesPage";
import UsersPage from "./modules/UsersPage";
import ReportsPage from "./modules/ReportsPage";
import SuppliersPage from "./modules/SuppliersPage"; // 👈 new page

export default function AdminPage() {
  const [active, setActive] = useState("dashboard");

  const renderModule = () => {
    switch (active) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductsPage />;
      case "categories":
        return <CategoriesPage />;
      case "services":
        return <ServicesPage />;
      case "users":
        return <UsersPage />;
      case "reports":
        return <ReportsPage />;
      case "suppliers": // 👈 replaced settings
        return <SuppliersPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout active={active} setActive={setActive}>
      {renderModule()}
    </AdminLayout>
  );
}
