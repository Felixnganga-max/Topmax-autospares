import React, { useContext } from "react"; // Removed useEffect as it's no longer needed
import "./Nav.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";
import { CiMenuFries } from "react-icons/ci";
import { IoBagSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const Nav = ({ setShowLogin }) => {
  const { getCartCount, token, setToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const isAdmin = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.userRole === 'admin';
    } catch (error) {
      console.error('Token decode error:', error);
      return false;
    }
  };

  const handleCartClick = () => {
    navigate("/order");
  };

  const handleAccountClick = () => {
    setShowLogin(true);
  };

  const handleAdminClick = () => {
    if (isAdmin()) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="nav">
      <div className="left-nav">
        <h3>SHOP BY CATEGORIES</h3>
        <CiMenuFries style={{ height: 100 }} />
      </div>

      <div className="center-nav">
        <input type="text" placeholder="Search products..." />
      </div>

      <div className="right-nav">
        {!token ? (
          <div className="account" onClick={handleAccountClick}>
            <p>Sign In</p>
            <VscAccount style={{ cursor: "pointer", fontSize: "30px" }} />
          </div>
        ) : (
          <div className="nav-profile">
            <VscAccount style={{ cursor: "pointer", fontSize: "30px" }} />
            <ul className="nav-drop">
              <li className="list-drop" onClick={() => navigate("/my-orders")}>
                <span><IoBagSharp style={{fontSize: "25px" }}/></span>
                Orders
              </li>
              {isAdmin() && (
                <li className="list-drop" onClick={handleAdminClick}>
                  <span><MdAdminPanelSettings style={{fontSize: "25px" }}/></span>
                  Admin Panel
                </li>
              )}
              <li className="list-drop">
                <span><IoMdSettings style={{fontSize: "25px" }}/></span>
                Settings
              </li>
              <li onClick={logOut} className="list-drop">
                <span><IoIosLogOut style={{fontSize: "25px" }}/></span>
                LogOut
              </li>
            </ul>
          </div>
        )}

        <FaCartShopping
          className="icon-r"
          onClick={handleCartClick}
          style={{ cursor: "pointer", fontSize: "30px" }}
        />
        <div className="cart-item-count">{getCartCount()}</div>
      </div>
    </div>
  );
};

export default Nav;