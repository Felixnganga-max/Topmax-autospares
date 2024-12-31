import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./WalkInSales.css";
import Receipt from '../../components/Receipt';

const WalkIn = () => {
  const { productData: initialProductData } = useContext(ShopContext);
  const [productData, setProductData] = useState(initialProductData);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [receiptGenerated, setReceiptGenerated] = useState(false); // Track receipt generation
  const [showReceipt, setShowReceipt] = useState(false); // Control receipt visibility

  const categories = [
    "All Categories",
    ...new Set(productData.map((product) => product.category)),
  ];

  const filteredProducts = productData.filter(
    (product) =>
      (selectedCategory === "" || selectedCategory === "All Categories"
        ? true
        : product.category === selectedCategory) &&
      (searchTerm === ""
        ? true
        : product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("Cannot exceed available stock!");
        return;
      }
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`Added ${product.name} to cart`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const product = productData.find((p) => p._id === productId);
    if (newQuantity > product.stock) {
      toast.error("Cannot exceed available stock!");
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
    toast.info("Item removed from cart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCompleteSale = async () => {
    if (!customerName || !customerPhone || cart.length === 0) {
      toast.error("Please provide customer details and add products to cart.");
      return;
    }

    const saleData = {
      cart,
      paymentMethod,
      customerName,
      customerPhone,
    };

    try {
      const response = await fetch("http://localhost:4004/api/walkinsales/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Sale successfully recorded!");
        setCart([]); // Clear the cart after successful sale
        setReceiptGenerated(true); // Mark receipt as generated
        setShowReceipt(true); // Show receipt popup
      } else {
        toast.error(result.message || "Failed to record sale");
      }
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Error completing sale. Please try again.");
    }
  };

  return (
    <div className="walk-in-container">
      <ToastContainer />

      {/* Categories Column */}
      <div className="categories-section">
        <h3>Categories</h3>
        <div className="category-list">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Column */}
      <div className="products-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="products-list">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="product-item"
                onClick={() => handleAddToCart(product)}
              >
                <div className="product-name">{product.name}</div>
                <div className="product-price">KSh {product.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <div className="cart">
          <h3>Cart</h3>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    KSh {item.price * item.quantity}
                  </span>
                </div>
                <div className="cart-item-actions">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item._id, Number(e.target.value))
                    }
                    min="1"
                    max={item.stock}
                  />
                  <button
                    className="remove-item"
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h4>Total: KSh {getTotalPrice()}</h4>
          </div>
        </div>

        <div className="payment-section">
          <select
            className="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
          </select>
          <input
            className="customer-name"
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            className="customer-phone"
            type="text"
            placeholder="Customer Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
          <button
            className="pay-now"
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
          >
            Complete Sale
          </button>
        </div>

        {/* Centered Receipt Pop-up */}
        {showReceipt && (
          <div className="receipt-popup">
            <div className="receipt-popup-content">
              <Receipt saleData={{ products: cart, totalAmount: getTotalPrice() }} />
              <button
                className="close-receipt"
                onClick={() => setShowReceipt(false)}
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkIn;
