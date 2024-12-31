import React, { useContext, useEffect, useState } from "react";
import "./OrderManagement.css";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";

const OrderManagement = () => {
  const { url } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Handle order status update
  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value,
    });

    if (response.data.success) {
      console.log(response.data.data);
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-management-container">
      <div className="filter-container">
        <button onClick={() => setStatusFilter("All")}>All</button>
        <button onClick={() => setStatusFilter("Order Processing")}>
          Order Processing
        </button>
        <button onClick={() => setStatusFilter("Out for Delivery")}>
          Out for Delivery
        </button>
        <button onClick={() => setStatusFilter("Delivered")}>Delivered</button>
      </div>

      <div className="order-list">
        {orders
          .filter((order) => statusFilter === "All" || order.status === statusFilter)
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort orders by date descending
          .map((order) => (
            <div className="order-row" key={order._id}>
              <div className="order-cell">
                {order.items.map((item, index) => (
                  <div className="item-text" key={index}>
                    {item.name} x {item.quantity} @ {item.price}
                  </div>
                ))}
              </div>
              <div className="order-cell">Ksh {order.amount}</div>
              <div className="order-cell">{order.address.phoneNumber}</div>
              <div className="order-cell">
                <span>Status: </span>
                <select
                  value={order.status}
                  onChange={(event) => statusHandler(event, order._id)}
                >
                  <option value="Order Processing">Order Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <div className="order-cell">
                {order.address.firstName} {order.address.lastName}
              </div>
              <div className="order-cell">{order.address.town}</div>
              <div className="order-cell">{order.address.email}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderManagement;
