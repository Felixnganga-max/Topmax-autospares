import React, { useState, useContext, useEffect } from "react";
import "./AdminPage.css";
import { 
  RiDashboardFill,
  RiUserLine,
  RiSettings4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiStoreLine,
  RiShoppingCart2Line,
  RiFileListLine,
  RiUserAddLine
} from 'react-icons/ri';
import AddSparePart from "../../components/AddSparePart/AddSparePart";
import AdminProductList from "../../components/AdminProductList/AdminProductList";
import OrderManagement from "../../components/OrderManagement/OrderManagement";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import WalkInSales from "../../components/WalkInSales/WalkInSales";
import ProductPerformance from "../../components/ProductPerformance/ProductPerformance";

const AdminPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const { token, setToken } = useContext(ShopContext);

  const menuItems = [
    { id: 'dashboard', icon: <RiDashboardFill />, label: 'Dashboard' },
    { id: 'walk-in', icon: <RiStoreLine />, label: 'Walk-In Clients' },
    { id: 'productsList', icon: <RiFileListLine />, label: 'Products List' },
    { id: 'addProduct', icon: <RiShoppingCart2Line />, label: 'Add Product' },
    { id: 'manageOrders', icon: <RiShoppingCart2Line />, label: 'Manage Orders' },
    { id: 'manageUsers', icon: <RiUserAddLine />, label: 'Platform Users' },
    { id: 'settings', icon: <RiSettings4Line />, label: 'Settings' },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

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
        return <WalkInSales />;
      default:
        return <ProductPerformance />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-section">
          <div className="logo-container">
            <img
              src="https://via.placeholder.com/40"
              alt="Logo"
              className="logo"
            />
            <h2 className={isCollapsed ? 'hidden' : ''}>Admin Panel</h2>
          </div>
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <RiMenuUnfoldLine strokeWidth={3}/> : <RiMenuFoldLine strokeWidth={3}/>}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className={`nav-label ${isCollapsed ? 'hidden' : ''}`}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <header className="top-nav">
          <div className="admin-profile">
            <span className="admin-name">Admin</span>
            <button onClick={logOut} className="logout-btn">
              Log Out
            </button>
            <a href="https://www.topmazautospares.com/" className="back-home">
              Back to Home
            </a>
          </div>
        </header>
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;