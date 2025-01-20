import React, { useState, useEffect, useContext } from "react";
import "./Hero.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { productData, url } = useContext(ShopContext);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();

  // Slide-changing interval logic
  useEffect(() => {
    if (productData.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(
          (prevIndex) => (prevIndex + 1) % productData.length
        );
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [productData.length]);

  // Prevent errors if productData is empty
  if (productData.length === 0) {
    return <div>Loading...</div>;
  }

  // Get the current product based on the currentSlideIndex
  const randomProduct = productData[currentSlideIndex];

  // Destructure with fallback to prevent errors
  const {
    image = "",
    name = "Product",
    description = "No description available",
    price = 0,
  } = randomProduct || {};

  // Check if image is a full URL or needs the base URL
  const productImage = image.startsWith("http")
    ? image
    : `${url}/images/${image}`;

  return (
    <div
      className="hero-container"
      style={{
        transition: "background-image 1s ease-in-out",
      }}
    >
      {/* Center image */}
      <div className="center-image">
        {productImage && (
          <div className="image-container">
            <img
              src={productImage}
              alt={name}
              height={300}
              width={300}
              className="product-image"
            />
            <div className="image-overlay"></div>
          </div>
        )}
      </div>

      {/* Left Section */}
      <div className="hero-left animate" key={currentSlideIndex}>
        <h1>
          {name.slice(0, 40)}
          {name.length > 40 && "..."}
        </h1>
        <h2>Get it at KSh. {price.toLocaleString()} /- only</h2>
        <button
          onClick={() => navigate("/collections")}
          className="discover-btn"
        >
          Explore More
        </button>
      </div>

      {/* Right Section */}
      <div className="hero-right">
        <div className="form-header">
          <i className="fa fa-car"></i>
          <span>Add Your Vehicle</span>
        </div>
        <div className="vehicle-form">
          <select>
            <option>Choose Year</option>
          </select>
          <select>
            <option>Select Make</option>
          </select>
          <select className="make" disabled>
            <option>Select Make first</option>
          </select>
          <select>
            <option>Select Part</option>
          </select>
          <button className="search-btn">SEARCH</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
