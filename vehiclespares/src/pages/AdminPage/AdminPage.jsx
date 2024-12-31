import React, { useContext, useEffect, useState } from "react";
import "./AdminPage.css";
import AddSparePart from "../../components/AddSparePart/AddSparePart";
import AdminProductList from "../../components/AdminProductList/AdminProductList";
import OrderManagement from "../../components/OrderManagement/OrderManagement";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import WalkInSales from "../../components/WalkInSales/WalkInSales";
import ProductPerformance from "../../components/ProductPerformance/ProductPerformance";

const AdminPage = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(ShopContext);
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "addProduct":
        return <AddSparePart />;
      case "manageOrders":
        return <OrderManagement />;
      case "productsList":
        return <AdminProductList />;
      case "manageUsers":
        return <h2>Manage Users</h2>;
      case "walk-in":
        return <WalkInSales />
      default:
        return (
          <>
          <ProductPerformance />
          </>
        );
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  useEffect((token) => {
    navigate("/admin");
  });

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="logo"
          />
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => setActiveSection("dashboard")}>Dashboard</li>
            <li onClick={() => setActiveSection("walk-in")}>
              Walk In Clients
            </li>
            <li onClick={() => setActiveSection("productsList")}>
              Products List
            </li>
            <li onClick={() => setActiveSection("addProduct")}>Add Product</li>
            <li onClick={() => setActiveSection("manageOrders")}>
              Manage Orders
            </li>
            <li onClick={() => setActiveSection("manageUsers")}>
              Platform Users
            </li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-nav">
          <div className="admin-profile">
            <span className="admin-name"> {} Admin</span>
            <span onClick={logOut} className="admin-name">
              Log Out
            </span>
          </div>
        </header>
        <div className="content">{renderContent()}</div>
      </div>
      {/* Footer has been removed */}
    </div>
  );
};

export default AdminPage;
