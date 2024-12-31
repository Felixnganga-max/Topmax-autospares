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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
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
      // Update the local state with the new status
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
      {data.length > 0 ? (
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
      ) : (
        <p className="no-orders-message">You need to be logged in to see this page</p>
      )}
    </div>
  );
};



export default MyOrders;