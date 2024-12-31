import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./TrendingSearches.css";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaCartPlus } from "react-icons/fa6";


const categories = ["Interior Accessories", "Brakes", "Lights", "Engine"];

const TrendingSearches = () => {
  const { productData, addToCart, url } = useContext(ShopContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredProducts = productData
    .filter((product) => product.category === selectedCategory)
    .slice(0, 4);

  return (
    <div className="trending-searches">
      <h2 className="trending-title">TRENDING SEARCHES</h2>
      <div className="trending-categories">
        {categories.map((category, index) => (
          <span
            key={index}
            className={`trending-category ${
              selectedCategory === category ? "trending-category-active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </span>
        ))}
      </div>

      <div className="trending-product-grid">
        {filteredProducts.map((product) => (
          <div
            className="trending-product-card"
            key={product._id}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* //TOP STUFF */}
            <img
              src={`${url}/images/${product.image}`}
              alt={product.name}
              className="trending-product-image"
            />
            {/* //MIDDLE STUFF */}
            <div className="trending-product-info">
              <h4 className="trending-product-name">{product.name}</h4>
              <div className="trending-product-price">
                KSh. {product.price.toLocaleString()}
              </div>
              <div
                className={`trending-stock-status ${
                  product.stock > 0
                    ? "trending-stock-in-stock"
                    : "trending-stock-out-of-stock"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
                {product.brand}
              </div>
              {/* <hr className="break-a"/> */}
              <div className="call-to-action-btns">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product._id);
                  }}
                  className="trending-add-to-cart"
                >
                  <FaCartPlus className="cart-i" />
                </button>
                <button className="proceed-buy">Proceed to buy</button>
              </div>
            </div>

            {/* DOWN STUFF */}
            <hr className="break-b" />
            {/* Social Media Icons */}
            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FcLike />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;
