import { Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Collections from "./pages/Collections/Collections";
import AboutUs from "./pages/AboutUs/AboutUs";
import Brands from "./pages/Brands/Brands";
import Navbar from "./components/Navbar/Navbar";
import Nav from "./components/Nav/Nav";
import MyOrders from "./pages/MyOrders/MyOrders";
import Product from "./pages/Product/Product";
import Footer from "./components/Footer/Footer";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import FilterAndProductDisplay from "./pages/FilterAndProductDisplay/FilterAndProductDisplay";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import AddSparePart from "./components/AddSparePart/AddSparePart";
import AdminProductList from "./components/AdminProductList/AdminProductList";
import AdminPage from "./pages/AdminPage/AdminPage";
import Verify from "./pages/Verify/Verify";
import { useContext } from "react";
import { ShopContext } from "./context/ShopContext";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

// Create ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);

  const isAdmin = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.userRole === "admin";
    } catch (error) {
      console.error("Token decode error:", error);
      return false;
    }
  };

  if (!token || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Render Navbar only if the current route is not "/admin" */}
      {location.pathname !== "/admin" && <Navbar />}

      {location.pathname !== "/admin" && <Nav setShowLogin={setShowLogin} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collections" element={<FilterAndProductDisplay />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/order" element={<Cart />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/product/:productId" element={<Product />} />

        {/* Protected Admin Routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddSparePart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <AdminProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {location.pathname !== "/admin" && <Footer />}
      {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
    </>
  );
}

export default App;
