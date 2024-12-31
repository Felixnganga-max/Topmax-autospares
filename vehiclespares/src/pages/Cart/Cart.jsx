import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    productData,
    cartItems,
    addToCart,
    removeFromCart,
    url,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        tempData.push({
          _id: itemId,
          quantity: cartItems[itemId],
        });
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const calculateSubtotal = () => {
    return cartData.reduce((total, item) => {
      const productInfo = productData.find(
        (product) => product._id === item._id
      );
      return productInfo ? total + productInfo.price * item.quantity : total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 0.0;
  const total = subtotal + deliveryFee;

  if (cartData.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <button onClick={() => navigate("/collections")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      {/* Cart Items Section */}
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartData.map((item) => {
          const productInfo = productData.find(
            (product) => product._id === item._id
          );

          if (!productInfo) return null;

          const totalPrice = productInfo.price * item.quantity;

          return (
            <div key={item._id} className="cart-items-title cart-items-item">
              <img
                src={`${url}/images/${productInfo.image}`}
                alt={productInfo.name}
                className="cart-item-image"
              />
              <p>{productInfo.name}</p>
              <p>KSh {productInfo.price.toLocaleString()}</p>
              <div className="quantity-control">
                <button
                  onClick={() => removeFromCart(item._id)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <p>{item.quantity}</p>
                <button onClick={() => addToCart(item._id)}>+</button>
              </div>
              <p>KSh {totalPrice.toLocaleString()}</p>
              <p
                className="cross"
                onClick={() => removeFromCart(item._id, true)} // Adjust to remove all
              >
                X
              </p>
              <hr />
            </div>
          );
        })}
      </div>

      {/* Cart Totals Section */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>KSh {subtotal.toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>KSh {deliveryFee.toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <b>KSh {total.toLocaleString()}</b>
            </div>
          </div>
          <button onClick={() => navigate("/place-order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code Section */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="promo">
              <input type="text" placeholder="Promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
