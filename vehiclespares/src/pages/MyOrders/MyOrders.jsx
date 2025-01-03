import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(ShopContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/user-orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId) => {
    try {
      const response = await axios.post(
        url + `/api/order/track-order`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.map((order) =>
          order._id === orderId
            ? { ...order, status: response.data.status }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders-container">
      {!token ? (
        <div className="auth-required-container">
          <p className="auth-required-message">
            You need to be logged in to see this page.
          </p>
          <p className="auth-suggestion-message">
            Sign in now to access your order history and enjoy seamless shopping with us.
          </p>
          <a href="/login" className="auth-login-btn">
            Login Now
          </a>
        </div>
      ) : data.length === 0 ? (
        <div className="no-orders-container">
          <p className="no-orders-message">
            You haven't placed any orders yet.
          </p>
          <p className="no-orders-suggestion">
            Discover our premium selection of products and place your first order today!
          </p>
          <a href="/shop" className="shop-now-btn">
            Start Shopping
          </a>
        </div>
      ) : (
        <ul className="order-list">
          {data.map((order, index) => (
            <li key={index} className="order-item">
              <p className="order-item-details order-date">
                Ordered on {formatDate(order.date)}
              </p>
              <div className="order-item-details">
                <ul className="order-item-list">
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="order-item-list-item">
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="order-item-details order-total">
                Total Amount: KSh {order.amount.toFixed(2)}
              </p>
              <p className="order-item-details">
                <span className="order-status">{order.status}</span>
              </p>
              <div className="container-btn">
                <button
                  className="btn"
                  onClick={() => updateOrderStatus(order._id)}
                >
                  Track Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
