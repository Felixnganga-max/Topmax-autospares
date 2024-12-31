import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import "./FilterComponent.css";

const FilterComponent = ({ onFilterChange }) => {
  const { productData } = useContext(ShopContext); // Get product data from context

  // States for different filter options
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [bestSeller, setBestSeller] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [status, setStatus] = useState("");

  // Extract categories and brands from the product data
  const categories = [...new Set(productData.map((product) => product.category))];
  const brands = [...new Set(productData.map((product) => product.brand))];

  // Handlers for filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
    triggerFilterUpdate();
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand]
    );
    triggerFilterUpdate();
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split(",").map(Number);
    setPriceRange([min, max]);
    triggerFilterUpdate();
  };

  const handleBestSellerChange = () => {
    setBestSeller((prev) => !prev);
    triggerFilterUpdate();
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    triggerFilterUpdate();
  };

  const handleStatusChange = (statusOption) => {
    setStatus(statusOption);
    triggerFilterUpdate();
  };

  // Trigger filter update to parent component
  const triggerFilterUpdate = () => {
    // Ensure an object is always passed to the parent
    onFilterChange({
      selectedCategories,
      selectedBrands,
      priceRange,
      bestSeller,
      selectedRating,
      status,
    });
  };

  // This ensures initial state is updated
  useEffect(() => {
    triggerFilterUpdate();
  }, []); // This ensures that filters are applied on first render

  return (
    <div className="filter-container">
      {/* Filter by Category */}
      <div className="filter-category">
        <h4>Category</h4>
        {categories.map((category, index) => (
          <div className="filter-option" key={index}>
            <input
              type="checkbox"
              id={`category-${index}`}
              onChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={`category-${index}`}>{category}</label>
          </div>
        ))}
      </div>

      {/* Filter by Brand */}
      <div className="filter-brand">
        <h4>Brand</h4>
        {brands.map((brand, index) => (
          <div className="filter-option" key={index}>
            <input
              type="checkbox"
              id={`brand-${index}`}
              onChange={() => handleBrandChange(brand)}
            />
            <label htmlFor={`brand-${index}`}>{brand}</label>
          </div>
        ))}
      </div>

      {/* Filter by Price */}
      <div className="filter-price-range">
        <h4>Price Range</h4>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceRange.join(",")}
          onChange={(e) => handlePriceChange(e)}
        />
        <div className="price-labels">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Filter by Best Seller */}
      <div className="filter-best-seller">
        <h4>Best Seller</h4>
        <div className="filter-option">
          <input
            type="checkbox"
            id="best-seller"
            checked={bestSeller}
            onChange={handleBestSellerChange}
          />
          <label htmlFor="best-seller">Show Best Sellers Only</label>
        </div>
      </div>

      {/* Filter by Rating */}
      <div className="filter-rating">
        <h4>Rating</h4>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div className="filter-option" key={rating}>
            <input
              type="radio"
              id={`rating-${rating}`}
              name="rating"
              onChange={() => handleRatingChange(rating)}
            />
            <label htmlFor={`rating-${rating}`}>{rating} Stars & Up</label>
          </div>
        ))}
      </div>

      {/* Filter by Status */}
      <div className="filter-status">
        <h4>Status</h4>
        <div className="filter-option">
          <input
            type="radio"
            id="status-in-stock"
            name="status"
            onChange={() => handleStatusChange("in stock")}
          />
          <label htmlFor="status-in-stock">In Stock</label>
        </div>
        <div className="filter-option">
          <input
            type="radio"
            id="status-sold"
            name="status"
            onChange={() => handleStatusChange("sold")}
          />
          <label htmlFor="status-sold">Sold</label>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
