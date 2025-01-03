import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./AdminProductList.css";

const AdminProductList = () => {
  const { productData: initialProductData, url } = useContext(ShopContext);
  const [productData, setProductData] = useState(initialProductData);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "All Categories",
    ...new Set(productData.map((product) => product.category)),
  ];

  const filteredProducts =
    selectedCategory && selectedCategory !== "All Categories"
      ? productData.filter((product) => product.category === selectedCategory)
      : productData;

  const handleClick = async (productId, productName) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the product "${productName}"?`
    );

    if (userConfirmed) {
      try {
        setProductData((prevData) =>
          prevData.filter((product) => product._id !== productId)
        );
        await axios.delete(`${url}/api/spares/remove/${productId}`);
        toast.success(`Product "${productName}" has been deleted successfully!`);
      } catch (error) {
        toast.error(`Error deleting product "${productName}": ${error.message}`);
      }
    }
  };

  return (
    <div className="admin-product-list">
      <ToastContainer />
      <h2>Product Inventory</h2>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() =>
              setSelectedCategory(category === "All Categories" ? "" : category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-list-container">
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <div>
                <img
                  src={`${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-name">{product.name}</div>
              <div className="product-price">KSh {product.price}</div>
              <div className="product-stock">
                Available Stock: {product.stock}
              </div>
              <div className="product-actions">
                <Link to="#" title="View">
                  <FaEye />
                </Link>
                <Link to="#" title="Edit">
                  <FaEdit />
                </Link>
                <button
                  onClick={() => handleClick(product._id, product.name)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductList;
