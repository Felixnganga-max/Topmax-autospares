import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [productData, setProductData] = useState([]);
  const url = "http://localhost:4004"; // Define the base URL
  const [token, setToken] = useState("");

  // Fetch product data
  const fetchProductData = async () => {
    try {
      const response = await axios.get(url + "/api/spares/list");

      // Log the entire response to understand its structure
      console.log("Full API Response:", response.data);

      // Ensure we're setting the correct data
      if (response.data && response.data.data) {
        setProductData(response.data.data);
        console.log("Product Data from API:", response.data.data);
      } else {
        console.error("Unexpected API response structure", response.data);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const addToCart = async (itemId) => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      console.error("No token was found in storage");
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);

      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );

      // Detailed error logging
      if (error.response) {
        console.error("Error details:", {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
      }
    }
  };

  // Handle removing items from the cart
  const removeFromCart = async (itemId, clearAll = false) => {
    const storedToken = localStorage.getItem("token");

    try {
      // Update local state first
      setCartItems((prev) => {
        const cartData = { ...prev };

        if (clearAll) {
          // Completely remove the item from the cart
          delete cartData[itemId];
        } else if (cartData[itemId] > 1) {
          // Decrease quantity by one if more than 1 exists
          cartData[itemId] -= 1;
        } else {
          // Remove the item if the quantity is 1
          delete cartData[itemId];
        }

        return cartData;
      });

      // Send request to backend
      await axios.post(
        url + "/api/cart/remove",
        { itemId, clearAll },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Get total count of items in the cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  // Load CartData
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get-cart",
        {}, // Assuming the token is passed in the header, no need for body data
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response:", response.data); // Log the API response to check the data structure

      // Ensure cartData is returned and correctly set
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        console.error("Error loading cart data:", response.data.message);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Load token and data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchProductData();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    };

    loadData(); // Call the function
  }, []);

  const contextValue = {
    productData,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getCartCount,
    url,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
