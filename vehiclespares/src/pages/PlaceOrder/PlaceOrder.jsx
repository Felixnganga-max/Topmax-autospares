import React, { useContext,useEffect,useffect, useState } from "react";
import "./PlaceOrder.css";
import { ShopContext } from "../../context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, productData, token, url, getCartCount, setCartItems } =
    useContext(ShopContext);
  console.log(token);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    town: "",
    street: "",
  });

  // Handle changes in input fields
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Calculate the total price of the items in the cart
  const getTotals = () => {
    let total = 0;
    productData.forEach((item) => {
      if (cartItems[item._id]) {
        total += item.price * cartItems[item._id];
      }
    });
    return total;
  };

  // Handle placing the order
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    // Collect items from the cart to place the order
    productData.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    // Decode the token to get the user ID (if you're not already doing this in context)
    const userId = token.split(".")[1]
      ? JSON.parse(atob(token.split(".")[1])).id
      : null;

    let orderData = {
      userId: userId, // Add the user ID to the order data
      address: data,
      items: orderItems,
      amount: getTotals(),
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error(
        "Order placement error:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getCartCount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* Delivery Information Section */}
      <div className="place-order-left">
        <p>Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="town"
            value={data.town}
            onChange={onChangeHandler}
            type="text"
            placeholder="Town"
          />
          <input
            required
            name="street"
            value={data.street}
            onChange={onChangeHandler}
            type="text"
            placeholder="Street"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            type="email"
            placeholder="Email address"
          />
          <input
            required
            name="phoneNumber"
            value={data.phoneNumber}
            onChange={onChangeHandler}
            type="number"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* Payment Section */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>KSh{getTotals()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotals() === 0 ? "0" : 100}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>KSh{getTotals() === 0 ? "0" : getTotals() + 100}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
